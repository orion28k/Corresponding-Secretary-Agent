export default function Sidebar({ activeTab, onTabChange, emailCount }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h1>Corresponding<br />Secretary</h1>
        <span>AI Email Agent</span>
      </div>

      <nav className="sidebar-nav">
        <div
          className={`nav-item ${activeTab === 'inbox' ? 'active' : ''}`}
          onClick={() => onTabChange('inbox')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <polyline points="3,4 12,13 21,4" />
          </svg>
          Inbox
          <span className="nav-badge">{emailCount}</span>
        </div>
        <div
          className={`nav-item ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => onTabChange('summary')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <line x1="10" y1="9" x2="8" y2="9" />
          </svg>
          Summary
        </div>
        <div
          className={`nav-item ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => onTabChange('sent')}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22,2 15,22 11,13 2,9" />
          </svg>
          Sent
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="account-card">
          <div className="account-avatar">A</div>
          <div className="account-info">
            <div className="account-name">Account</div>
            <div className="account-email">user@gmail.com</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
