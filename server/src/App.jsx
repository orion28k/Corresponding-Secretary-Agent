import { useState } from 'react';
import { emails } from './data/emails';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import EmailList from './components/EmailList';
import SummaryPanel from './components/SummaryPanel';
import SentPanel from './components/SentPanel';
import ResponseModal from './components/ResponseModal';
import SettingsModal from './components/SettingsModal';

function App() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [summaries, setSummaries] = useState({});
  const [modalEmail, setModalEmail] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function handleSummarize(emailId) {
    setSummaries((prev) => {
      if (prev[emailId]) {
        const next = { ...prev };
        delete next[emailId];
        return next;
      }
      const email = emails.find((e) => e.id === emailId);
      return {
        ...prev,
        [emailId]: `This email from ${email.sender} (${email.email}) regarding "${email.subject}" discusses: ${email.snippet} This is a placeholder summary — connect the backend AI to generate real summaries.`,
      };
    });
  }

  return (
    <>
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        emailCount={emails.length}
      />
      <main className="main">
        <Header activeTab={activeTab} onTabChange={setActiveTab} onOpenSettings={() => setSettingsOpen(true)} />
        <div className="content">
          <div className={`tab-panel ${activeTab === 'inbox' ? 'active' : ''}`}>
            <EmailList
              emails={emails}
              summaries={summaries}
              onSummarize={handleSummarize}
              onCreateResponse={setModalEmail}
            />
          </div>
          <div className={`tab-panel ${activeTab === 'summary' ? 'active' : ''}`}>
            <SummaryPanel />
          </div>
          <div className={`tab-panel ${activeTab === 'sent' ? 'active' : ''}`}>
            <SentPanel />
          </div>
        </div>
      </main>
      {modalEmail && (
        <ResponseModal
          email={modalEmail}
          onClose={() => setModalEmail(null)}
        />
      )}
      {settingsOpen && (
        <SettingsModal onClose={() => setSettingsOpen(false)} />
      )}
    </>
  );
}

export default App;
