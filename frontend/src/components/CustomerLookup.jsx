import React, { useState } from 'react';

const CustomerLookup = () => {
  const [query, setQuery] = useState({ phone: '', email: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLookup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/store/lookup?phone=${query.phone}&email=${query.email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      alert('Lookup failed');
    }
    setLoading(false);
  };

  const getRiskColor = (risk) => {
    if (risk === 'High Risk') return 'var(--danger)';
    if (risk === 'Medium Risk') return 'var(--warning)';
    return 'var(--success)';
  };

  return (
    <div className="animate-fade">
      <div className="glass" style={{ padding: '40px' }}>
        <h3>Search Customer Risk</h3>
        <p>Enter phone or email to check if this customer has been blacklisted by other stores.</p>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '15px' }}>
          <input type="text" placeholder="Phone Number" onChange={e => setQuery({...query, phone: e.target.value})} />
          <input type="email" placeholder="Email Address" onChange={e => setQuery({...query, email: e.target.value})} />
          <button type="submit" className="btn-primary" style={{ height: '48px' }}>Search</button>
        </form>
      </div>

      {result && (
        <div className="glass animate-fade" style={{ marginTop: '30px', padding: '40px', textAlign: 'center' }}>
          <h3>Risk Assessment</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: '800', color: getRiskColor(result.risk), margin: '20px 0' }}>
            {result.risk}
          </div>
          <p>Total reports found across platform: {result.reports.length}</p>
          
          {result.reports.length > 0 && (
            <div style={{ marginTop: '30px', textAlign: 'left' }}>
              <h4>Report History</h4>
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {result.reports.map((report, i) => (
                  <div key={i} className="glass" style={{ padding: '15px', marginBottom: '10px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <strong>Reported by: {report.reportedBy.name}</strong>
                      <span style={{ color: 'var(--text-muted)' }}>{new Date(report.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: '5px 0 0 0' }}>Reason: {report.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomerLookup;
