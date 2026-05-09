import React, { useState } from 'react';

const BlacklistReport = () => {
  const [formData, setFormData] = useState({ phone: '', email: '', address: '', reason: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/report', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Customer blacklisted successfully. Thank you for contributing!', type: 'success' });
        setFormData({ phone: '', email: '', address: '', reason: '' });
      } else {
        setMsg({ text: data.error || 'Failed to report', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Error connecting to server', type: 'error' });
    }
  };

  return (
    <div className="glass animate-fade" style={{ padding: '40px', maxWidth: '700px' }}>
      <h3>Blacklist a Customer</h3>
      <p>Report a customer who refused delivery or cancelled multiple times.</p>

      {msg.text && (
        <div className={`alert alert-${msg.type}`} style={{ marginTop: '20px' }}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label>Phone Number</label>
            <input type="text" placeholder="03000000000" value={formData.phone} required onChange={e => setFormData({...formData, phone: e.target.value})} />
          </div>
          <div>
            <label>Email Address</label>
            <input type="email" placeholder="customer@email.com" value={formData.email} required onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
        </div>
        <label>Full Address</label>
        <input type="text" placeholder="Street, City, Area" value={formData.address} required onChange={e => setFormData({...formData, address: e.target.value})} />
        <label>Reason for Blacklisting</label>
        <textarea placeholder="e.g. Refused delivery 3 times, Rude behavior, Fake order" value={formData.reason} required rows="4" onChange={e => setFormData({...formData, reason: e.target.value})}></textarea>
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Report Customer</button>
      </form>
    </div>
  );
};

export default BlacklistReport;
