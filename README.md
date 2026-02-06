# Corresponding Secretary

An AI-powered email agent that connects to Gmail to fetch, categorize, summarize, and draft responses to emails using Google's Gemini LLM.

## Project Structure

```
├── proto/                  # Backend prototype
│   ├── main.py             # Gmail API integration, email fetching & categorization
│   └── LLM.py              # Gemini LLM wrapper
├── server/                 # Frontend (React + Vite)
│   └── src/
│       ├── App.jsx          # Root layout & state management
│       ├── App.css          # Global styles
│       ├── data/emails.js   # Mock email data
│       └── components/
│           ├── Sidebar.jsx       # Navigation sidebar with account info
│           ├── Header.jsx        # Tab bar & action buttons
│           ├── EmailList.jsx     # Inbox email list
│           ├── EmailItem.jsx     # Individual email row with action dropdown
│           ├── SummaryPanel.jsx  # Timeframe-based email summary
│           ├── SentPanel.jsx     # Sent emails view
│           ├── ResponseModal.jsx # AI response drafting modal
│           └── SettingsModal.jsx # Settings (General, Model tone)
└── Timeline-P1.pdf         # Project timeline
```

## Backend (Proto)

The backend prototype connects to the Gmail API to:

- Fetch inbox emails using Gmail search operators (excludes promotions, social, updates, forums)
- Extract sender, subject, date, and plain-text body from each message
- Batch emails and send them to Gemini for sender categorization
- Deduplicate senders and export results to `categorized_senders.csv`

### Requirements

- Python 3.x
- Google Cloud project with Gmail API enabled
- `credentials.json` (OAuth 2.0 client credentials)
- Gemini API key

### Python Dependencies

```
google-auth
google-auth-oauthlib
google-api-python-client
google-generativeai
```

### Usage

1. Place your `credentials.json` in the project root
2. Update the Gemini API key path in `proto/LLM.py`
3. Run the categorizer:

```bash
cd proto
python main.py
```

On first run, a browser window opens for Gmail OAuth. A `token.json` is saved for subsequent runs.

## Frontend

A React single-page app providing the user interface for the email agent.

### Features

- **Inbox** — View emails with per-email action menu (Summarize, Create Response, Mark as Read)
- **Summary** — Select a date range and generate an AI-powered summary of inbox activity
- **Sent** — View sent email history
- **Settings** — General preferences and Model tone configuration (Professional, Friendly, Formal, Casual, Concise)
- **Account** — User account display in the sidebar

### Setup

```bash
cd server
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

### Build

```bash
npm run build
```

Output is in `server/dist/`.
