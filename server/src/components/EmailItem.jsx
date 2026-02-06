import { useState, useEffect, useRef } from 'react';

export default function EmailItem({ email, onSummarize, onCreateResponse, summaryText }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  function handleSummarize() {
    setDropdownOpen(false);
    onSummarize(email.id);
    setShowSummary((prev) => !prev);
  }

  function handleCreateResponse() {
    setDropdownOpen(false);
    onCreateResponse(email);
  }

  return (
    <>
      <div className={`email-item ${email.unread ? 'unread' : ''}`}>
        <input
          type="checkbox"
          className="email-checkbox"
          onClick={(e) => e.stopPropagation()}
        />
        <div className="email-sender">{email.sender}</div>
        <div className="email-preview">
          <span className="email-subject">{email.subject}</span>
          <span className="email-snippet">— {email.snippet}</span>
        </div>
        <span className="email-date">{email.date}</span>
        <div className="email-more-wrapper" ref={wrapperRef}>
          <button
            className="email-more"
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((prev) => !prev);
            }}
            title="Actions"
          >
            ···
          </button>
          {dropdownOpen && (
            <div className="dropdown">
              <button className="dropdown-item" onClick={handleSummarize}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14,2 14,8 20,8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                Summarize
              </button>
              <button className="dropdown-item" onClick={handleCreateResponse}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                Create Response
              </button>
              <div className="dropdown-divider" />
              <button className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22,4 12,14.01 9,11.01" />
                </svg>
                Mark as Read
              </button>
            </div>
          )}
        </div>
      </div>
      {showSummary && summaryText && (
        <div className="email-summary-inline">
          <span className="tag">AI Summary</span>
          <div className="summary-text">{summaryText}</div>
        </div>
      )}
    </>
  );
}
