const sentEmails = [
  { id: 101, to: "Dr. Sarah Chen", email: "s.chen@university.edu", subject: "Re: Research Collaboration Proposal", snippet: "Thank you for reaching out. I'd be happy to discuss the NLP project further. Let's schedule a call...", date: "10:55 AM" },
  { id: 102, to: "James Morton", email: "jmorton@techcorp.io", subject: "Re: Q4 Budget Review", snippet: "I've reviewed the allocations and have a few suggestions for the engineering line items...", date: "Yesterday" },
  { id: 103, to: "Rachel Kim", email: "rkim@lawfirm.com", subject: "Re: Contract Review — Final Draft", snippet: "The agreement looks good. I've signed and attached the executed copy for your records...", date: "Feb 3" },
  { id: 104, to: "David Park", email: "dpark@cloud.dev", subject: "Re: Server Migration Plan", snippet: "Thanks for the heads up. I'll make sure the team is aware of the downtime window...", date: "Feb 2" },
  { id: 105, to: "Lisa Wang", email: "lwang@finance.co", subject: "Re: Invoice #2024-0892", snippet: "Invoice received. I've forwarded it to accounts payable for processing within Net 30 terms...", date: "Feb 1" },
];

export default function SentPanel() {
  return (
    <div>
      <div className="email-list-header">
        <h2>Sent</h2>
        <span className="email-count">{sentEmails.length} messages</span>
      </div>
      <div className="email-list">
        {sentEmails.map((email) => (
          <div className="email-item" key={email.id}>
            <input
              type="checkbox"
              className="email-checkbox"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="email-sender">{email.to}</div>
            <div className="email-preview">
              <span className="email-subject">{email.subject}</span>
              <span className="email-snippet">— {email.snippet}</span>
            </div>
            <span className="email-date">{email.date}</span>
            <div style={{ width: 30 }} />
          </div>
        ))}
      </div>
    </div>
  );
}
