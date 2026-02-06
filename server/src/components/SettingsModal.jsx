import { useState } from 'react';

export default function SettingsModal({ onClose }) {
  const [activeSection, setActiveSection] = useState('general');
  const [notifications, setNotifications] = useState(true);
  const [tone, setTone] = useState('professional');

  const sections = [
    { id: 'general', label: 'General' },
    { id: 'model', label: 'Model' },
  ];

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal settings-modal">
        <div className="modal-header">
          <h3>Settings</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="settings-layout">
          <nav className="settings-nav">
            {sections.map((s) => (
              <button
                key={s.id}
                className={`settings-nav-item ${activeSection === s.id ? 'active' : ''}`}
                onClick={() => setActiveSection(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
          <div className="settings-content">
            {activeSection === 'general' && (
              <div className="settings-section">
                <h4 className="settings-section-title">General</h4>
                <div className="settings-row">
                  <div className="settings-row-info">
                    <span className="settings-label">Email Notifications</span>
                    <span className="settings-description">Receive notifications for new emails</span>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={(e) => setNotifications(e.target.checked)}
                    />
                    <span className="toggle-slider" />
                  </label>
                </div>
              </div>
            )}

            {activeSection === 'model' && (
              <div className="settings-section">
                <h4 className="settings-section-title">Model</h4>
                <div className="settings-row">
                  <div className="settings-row-info">
                    <span className="settings-label">Tone</span>
                    <span className="settings-description">Set the tone for AI-generated responses</span>
                  </div>
                  <select
                    className="settings-select"
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                  >
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="casual">Casual</option>
                    <option value="concise">Concise</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onClose}>Save</button>
        </div>
      </div>
    </div>
  );
}
