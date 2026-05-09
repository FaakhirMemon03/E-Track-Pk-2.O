import React, { useState } from 'react';

const BlacklistReport = () => {
  const [formData, setFormData] = useState({ phone: '', email: '', address: '', reason: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      if (res.ok) {
        alert('Customer blacklisted successfully. Thank you for contributing to the community.');
        setFormData({ phone: '', email: '', address: '', reason: '' });
      } else {
        alert('Failed to report');
      }
    } catch (err) {
      alert('Error reporting');
    }
  };

  return (
    <div className="glass animate-fade" style={{ padding: '40px', maxWidth: '700px' }}>
      <h3>Blacklist a Customer</h3>
      <p>Report a customer who refused delivery or cancelled multiple times. This data will be shared with all other stores.</p>
      <form onSubmit={handleSubmit}>
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
