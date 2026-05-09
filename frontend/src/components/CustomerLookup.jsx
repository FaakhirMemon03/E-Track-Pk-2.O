import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, ShieldX, AlertCircle } from 'lucide-react';

const CustomerLookup = () => {
  const [query, setQuery] = useState({ phone: '', email: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setMsg({ text: '', type: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/store/lookup?phone=${query.phone}&email=${query.email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setMsg({ text: data.error || 'Lookup failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Could not connect to server', type: 'error' });
    }
    setLoading(false);
  };

  const getRiskConfig = (risk) => {
    if (risk === 'High Risk') return { color: 'var(--danger)', icon: <ShieldX size={48} />, bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' };
    if (risk === 'Medium Risk') return { color: '#f59e0b', icon: <ShieldAlert size={48} />, bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' };
    return { color: 'var(--success)', icon: <ShieldCheck size={48} />, bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' };
  };

  return (
    <div className="animate-fade page-section">
      {/* Search Card */}
      <div className="section-card">
        <div className="section-title">
          <Search size={22} className="icon-primary" />
          <div>
            <h3>Customer Risk Lookup</h3>
            <p>Enter phone or email to check if this customer has been blacklisted by any store.</p>
          </div>
        </div>

        {msg.text && <div className={`alert alert-${msg.type}`}>{msg.text}</div>}

        <form onSubmit={handleLookup} className="lookup-form">
          <input
            type="text"
            placeholder="📞  Phone Number (e.g. 03001234567)"
            onChange={e => setQuery({ ...query, phone: e.target.value })}
          />
          <input
            type="email"
            placeholder="✉️  Email Address"
            onChange={e => setQuery({ ...query, email: e.target.value })}
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {/* Results Card */}
      {result && (() => {
        const config = getRiskConfig(result.risk);
        return (
          <div className="section-card animate-fade" style={{ marginTop: '25px' }}>
            <div className="risk-banner" style={{ background: config.bg, border: `1px solid ${config.border}`, borderRadius: '16px', padding: '40px', textAlign: 'center', marginBottom: '30px' }}>
              <div style={{ color: config.color, marginBottom: '15px' }}>{config.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: config.color }}>{result.risk}</div>
              <p style={{ color: 'var(--text-muted)', marginTop: '10px' }}>
                {result.reports.length === 0
                  ? 'No reports found. This customer appears safe.'
                  : `${result.reports.length} report${result.reports.length > 1 ? 's' : ''} found across the platform.`}
              </p>
            </div>

            {result.reports.length > 0 && (
              <>
                <h4 style={{ marginBottom: '15px' }}>Report History</h4>
                <div style={{ maxHeight: '350px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {result.reports.map((report, i) => (
                    <div key={i} className="glass report-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ color: 'var(--primary)' }}>Reported by: {report.reportedBy?.name || 'Unknown Store'}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{new Date(report.createdAt).toLocaleDateString('en-PK')}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)' }}>Reason: <span style={{ color: 'white' }}>{report.reason}</span></p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default CustomerLookup;
