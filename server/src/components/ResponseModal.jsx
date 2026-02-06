import { useState, useEffect } from 'react';

export default function ResponseModal({ email, onClose }) {
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    setResponseText('');
  }, [email]);

  function handleGenerate() {
    setResponseText(
      "Thank you for your email. I've reviewed the details and would like to discuss this further.\n\nPlease let me know your availability for a brief call this week.\n\nBest regards"
    );
  }

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <h3>Create Response</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="modal-context">
            Re: {email.subject} — from {email.email}
          </div>
          <textarea
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
            placeholder={`Type your response to ${email.sender} or click "Generate with AI" for a draft...`}
          />
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleGenerate}>Generate with AI</button>
        </div>
      </div>
    </div>
  );
}
