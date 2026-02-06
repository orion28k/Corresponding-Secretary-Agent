import { useState, useMemo } from 'react';

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export default function SummaryPanel() {
  const today = useMemo(() => new Date(), []);
  const weekAgo = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 7);
    return d;
  }, [today]);

  const [fromDate, setFromDate] = useState(formatDate(weekAgo));
  const [toDate, setToDate] = useState(formatDate(today));
  const [quickRange, setQuickRange] = useState('7');
  const [category, setCategory] = useState('all');
  const [result, setResult] = useState(null);

  function handleQuickRange(value) {
    setQuickRange(value);
    const days = parseInt(value);
    if (!days) return;
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    setToDate(formatDate(to));
    setFromDate(formatDate(from));
  }

  function handleSummarize() {
    setResult({
      from: fromDate,
      to: toDate,
    });
  }

  return (
    <div className="summary-panel">
      <h2>Email Summary</h2>
      <p className="subtitle">
        Select a timeframe to generate an AI-powered summary of your inbox activity.
      </p>

      <div className="summary-form">
        <div className="form-row">
          <div className="form-group">
            <label>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Quick Range</label>
            <select value={quickRange} onChange={(e) => handleQuickRange(e.target.value)}>
              <option value="">Custom range</option>
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">All categories</option>
              <option value="personal">Personal</option>
              <option value="work">Work</option>
              <option value="newsletters">Newsletters</option>
            </select>
          </div>
        </div>
        <button className="btn-summarize" onClick={handleSummarize}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14,2 14,8 20,8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          Summarize
        </button>
      </div>

      {result && (
        <div className="summary-result">
          <div className="summary-result-header">
            <h3>Summary</h3>
            <span className="tag">AI Generated</span>
          </div>
          <div className="summary-body">
            <p><strong>Period:</strong> {result.from} to {result.to}</p>
            <p>You received <strong>12 emails</strong> during this period from <strong>10 unique senders</strong>.</p>
            <p><strong>Key topics:</strong> Research collaboration (Dr. Sarah Chen), Q4 budget review (James Morton), contract finalization (Rachel Kim), server migration planning (David Park), and a partnership inquiry (Tom Bradley).</p>
            <p><strong>Action items:</strong> 3 emails require a response, 1 invoice pending payment, and 1 benefits enrollment deadline approaching (Feb 15).</p>
            <p>This is a placeholder summary. Connect the backend AI agent to generate real timeframe summaries.</p>
          </div>
        </div>
      )}
    </div>
  );
}
