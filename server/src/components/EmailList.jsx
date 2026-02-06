import EmailItem from './EmailItem';

export default function EmailList({ emails, summaries, onSummarize, onCreateResponse }) {
  return (
    <div>
      <div className="email-list-header">
        <h2>Inbox</h2>
        <span className="email-count">{emails.length} messages</span>
      </div>
      <div className="email-list">
        {emails.map((email) => (
          <EmailItem
            key={email.id}
            email={email}
            summaryText={summaries[email.id]}
            onSummarize={onSummarize}
            onCreateResponse={onCreateResponse}
          />
        ))}
      </div>
    </div>
  );
}
