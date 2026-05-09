import React, { useState, useEffect } from 'react';

const BlacklistMonitor = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setCustomers(data);
    };
    fetchCustomers();
  }, []);

  return (
    <div className="glass animate-fade" style={{ padding: '30px' }}>
      <h3>Platform Blacklist Monitor</h3>
      <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {customers.map(c => (
          <div key={c._id} className="glass" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <strong>{c.phone}</strong>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.email}</span>
            </div>
            <p style={{ fontSize: '0.9rem', marginBottom: '10px' }}>{c.address}</p>
            <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '10px', fontSize: '0.8rem' }}>
              <p>Reason: {c.reason}</p>
              <p style={{ color: 'var(--primary)' }}>Reported by: {c.reportedBy?.name || 'Unknown'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlacklistMonitor;
