import React, { useState } from 'react';
import { CreditCard, CheckCircle, Upload } from 'lucide-react';

const plans = [
  { id: '1month', label: '1 Month', price: 'PKR 999', desc: 'Best for trying out' },
  { id: '6month', label: '6 Months', price: 'PKR 4,999', desc: 'Save 17%', badge: 'POPULAR' },
  { id: '1year', label: '1 Year', price: 'PKR 8,999', desc: 'Save 25%', badge: 'BEST VALUE' },
];

const Subscription = () => {
  const [file, setFile] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    if (!file) return setMsg({ text: 'Please upload a payment screenshot', type: 'error' });
    if (!selectedPlan) return setMsg({ text: 'Please select a plan', type: 'error' });
    setLoading(true);

    const formData = new FormData();
    formData.append('screenshot', file);
    formData.append('transactionId', transactionId);
    formData.append('plan', selectedPlan);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/payment-proof', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Payment submitted! Admin will review within 24 hours and activate your plan.', type: 'success' });
        setFile(null); setTransactionId(''); setSelectedPlan('');
      } else {
        setMsg({ text: data.error || 'Upload failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server connection error. Please try again.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade page-section">
      {/* Plans */}
      <div className="section-card">
        <div className="section-title">
          <CreditCard size={22} className="icon-primary" />
          <div>
            <h3>Choose Your Plan</h3>
            <p>Select a plan and submit payment proof for activation.</p>
          </div>
        </div>

        <div className="plans-grid">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`plan-card glass ${selectedPlan === plan.id ? 'plan-selected' : ''}`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.badge && <div className="plan-badge">{plan.badge}</div>}
              <h4>{plan.label}</h4>
              <div className="plan-price">{plan.price}</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{plan.desc}</p>
              <div className={`plan-check ${selectedPlan === plan.id ? 'visible' : ''}`}>
                <CheckCircle size={22} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Instructions */}
      <div className="section-card" style={{ marginTop: '25px' }}>
        <div className="payment-instruction-box">
          <h4>💳 Payment Instructions</h4>
          <p>Send the amount to the following account:</p>
          <div className="payment-details">
            <div><span>EasyPaisa / JazzCash</span><strong>0300-1234567</strong></div>
            <div><span>Account Name</span><strong>E-Track PK Admin</strong></div>
          </div>
        </div>

        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            {msg.type === 'success' ? <CheckCircle size={18} /> : null}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Transaction ID (TID)</label>
            <input
              type="text"
              placeholder="Enter your transaction ID"
              value={transactionId}
              required
              onChange={e => setTransactionId(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Payment Screenshot</label>
            <div className="file-upload-area" onClick={() => document.getElementById('pay-file').click()}>
              <Upload size={24} />
              <p>{file ? file.name : 'Click to upload screenshot'}</p>
              <input id="pay-file" type="file" accept="image/*" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
            </div>
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Submitting...' : '✅ Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Subscription;
