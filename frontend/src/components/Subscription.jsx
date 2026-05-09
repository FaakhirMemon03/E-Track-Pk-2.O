import React, { useState } from 'react';

const Subscription = () => {
  const [file, setFile] = useState(null);
  const [transactionId, setTransactionId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please upload a screenshot');
    
    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('transactionId', transactionId);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/payment-proof', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('Payment proof submitted. Admin will review your request.');
      }
    } catch (err) {
      alert('Upload failed');
    }
  };

  return (
    <div className="glass animate-fade" style={{ padding: '40px', maxWidth: '600px' }}>
      <h3>Purchase / Renew Plan</h3>
      <div style={{ marginBottom: '30px', padding: '20px', background: 'rgba(99,102,241,0.1)', borderRadius: '12px' }}>
        <p><strong>Payment Instructions:</strong></p>
        <p>Send the amount to the following Easypaisa/JazzCash account:</p>
        <p>Account: <strong>0300-1234567</strong> (E-Track PK Admin)</p>
      </div>

      <form onSubmit={handleSubmit}>
        <label>Transaction ID</label>
        <input type="text" placeholder="Enter TID" required onChange={e => setTransactionId(e.target.value)} />
        <label>Payment Screenshot</label>
        <input type="file" accept="image/*" required onChange={e => setFile(e.target.files[0])} />
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Submit for Approval</button>
      </form>
    </div>
  );
};

export default Subscription;
