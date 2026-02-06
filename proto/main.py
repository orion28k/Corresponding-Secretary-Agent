import os, sys, csv, json, datetime as dt, re
from typing import List, Dict, Any

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

import LLM as MyAI

# ---- Summarization guardrails ----
DAYS_LOOKBACK = 1825            # narrower window than 30d to reduce volume
MAX_EMAILS = 4000              # hard cap on number of emails to summarize per run
BATCH_SIZE = 40               # emails per LLM call (map step)
MAX_CONTENT_CHARS = 500       # truncate email body to reduce tokens

# Scopes: read-only access
SCOPES = ["https://www.googleapis.com/auth/gmail.readonly"]

def get_service():
    creds = None
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file("credentials.json", SCOPES)
            creds = flow.run_local_server(port=0)
        with open("token.json", "w") as f:
            f.write(creds.to_json())
    return build("gmail", "v1", credentials=creds)

def list_message_ids(service, query: str, max_per_page: int = 500) -> List[str]:
    """
    Uses users.messages.list with the Gmail search query (q=...).
    Paginates until all matching message IDs are collected.
    """
    ids: List[str] = []
    page_token = None
    while True:
        resp = service.users().messages().list(
            userId="me", q=query, maxResults=max_per_page, pageToken=page_token
        ).execute()
        for m in resp.get("messages", []):
            ids.append(m["id"])
        page_token = resp.get("nextPageToken")
        if not page_token:
            break
    return ids

def _decode_b64url(data: str) -> str:
    import base64
    try:
        return base64.urlsafe_b64decode(data).decode("utf-8", errors="ignore")
    except Exception:
        return ""

def _find_text_plain(payload: dict) -> str:
    """Recursively search for a text/plain part and return its decoded text."""
    if not payload:
        return ""
    mime = payload.get("mimeType")
    body = payload.get("body", {})
    data = body.get("data")
    if mime == "text/plain" and data:
        return _decode_b64url(data)
    # Recurse into parts if present
    for part in payload.get("parts", []) or []:
        text = _find_text_plain(part)
        if text:
            return text
    return ""

def _truncate(text: str, max_chars: int = MAX_CONTENT_CHARS) -> str:
    if text is None:
        return ""
    text = text.strip()
    return text if len(text) <= max_chars else text[:max_chars] + "…"

def get_message_map(service, msg_id: str) -> Dict[str, Any]:
    """
    Return only: subject, content (plain text message body), date, from — in that order.
    """
    # 1) Headers (metadata)
    meta = service.users().messages().get(
        userId="me",
        id=msg_id,
        format="metadata",
        metadataHeaders=["Subject", "Date", "From"],
    ).execute()
    hdrs = {h["name"]: h["value"] for h in meta.get("payload", {}).get("headers", [])}

    # 2) Body (full)
    full = service.users().messages().get(
        userId="me",
        id=msg_id,
        format="full",
    ).execute()
    raw_content = _find_text_plain(full.get("payload", {})) or full.get("snippet", "")
    content = _truncate(raw_content, MAX_CONTENT_CHARS)

    # Maintain insertion order exactly as requested
    return {
        "subject": hdrs.get("Subject", ""),
        "content": content,
        "date": hdrs.get("Date", ""),
        "from": hdrs.get("From", ""),
    }

from itertools import islice

def _chunks(seq, size):
    it = iter(seq)
    while True:
        chunk = list(islice(it, size))
        if not chunk:
            break
        yield chunk

def _extract_email_address(from_header: str) -> str:
    """Extract email address from 'From' header like 'John Doe <john@example.com>' or 'john@example.com'"""
    if not from_header:
        return ""
    match = re.search(r'<(.+?)>', from_header)
    if match:
        return match.group(1).strip()
    # If no angle brackets, return the whole thing (might be just an email)
    return from_header.strip()

def _extract_sender_name(from_header: str) -> str:
    """Extract display name from 'From' header"""
    if not from_header:
        return ""
    match = re.search(r'^(.+?)\s*<', from_header)
    if match:
        name = match.group(1).strip('"').strip()
        return name
    # If no angle brackets, try to use the part before @ as name
    email_match = re.search(r'(.+?)@', from_header)
    if email_match:
        return email_match.group(1)
    return from_header.strip()

def _deduplicate_senders(categorized_data: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """Deduplicate by email address, keeping the most recent entry"""
    seen = {}
    for item in categorized_data:
        email = item["email_address"]
        if email not in seen:
            seen[email] = item
    return list(seen.values())


def main():
    with open("system_instructions.txt", "r", encoding="utf-8") as f:
        systemInstructions = f.read()
    llm = MyAI.LLM(systemInstructions)

    try:
        days = DAYS_LOOKBACK
        service = get_service()

        # Gmail supports UI-like search operators. Here we use "newer_than:{days}d"
        # You could also use absolute dates: after:YYYY/MM/DD before:YYYY/MM/DD
        query = f"newer_than:{days}d label:inbox -category:promotions -category:social -category:updates -category:forums"

        msg_ids = list_message_ids(service, query=query)
        if len(msg_ids) > MAX_EMAILS:
            msg_ids = msg_ids[:MAX_EMAILS]
        print(f"Found {len(msg_ids)} messages in last {days} days.")

        # Map step: collect and truncate emails
        rows: List[Dict[str, Any]] = []
        for mid in msg_ids:
            row = get_message_map(service, mid)
            # Pre-extract email and sender name
            row["email_address"] = _extract_email_address(row["from"])
            row["sender_name"] = _extract_sender_name(row["from"])
            rows.append(row)

        # Batch calls to LLM for categorization
        all_categorized: List[Dict[str, str]] = []
        for i, batch in enumerate(_chunks(rows, BATCH_SIZE)):
            prompt = json.dumps(batch, ensure_ascii=False)
            response_text = llm.respond(prompt)
            print(f"Batch {i+1} LLM Response:\n{response_text}\n", file=sys.stderr)
            try:
                # Try to parse JSON response
                categorized_batch = json.loads(response_text)
                if isinstance(categorized_batch, list):
                    all_categorized.extend(categorized_batch)
                    print(f"Batch {i+1}: Parsed {len(categorized_batch)} entries", file=sys.stderr)
            except json.JSONDecodeError as e:
                print(f"Warning: Could not parse LLM response as JSON for batch {i+1}: {e}", file=sys.stderr)
                continue

        # Deduplicate by email address
        unique_senders = _deduplicate_senders(all_categorized)

        # Write to CSV
        csv_path = "categorized_senders.csv"
        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=["email_address", "sender_name", "category"])
            writer.writeheader()
            for sender in unique_senders:
                writer.writerow(sender)

        print(f"Categorized {len(unique_senders)} unique senders to {csv_path}")

    except HttpError as e:
        print(f"Gmail API error: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()