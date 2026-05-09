import React, { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';

const BlacklistReport = () => {
  const [formData, setFormData] = useState({ phone: '', email: '', address: '', reason: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setLoading(true);
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
        setMsg({ text: 'Customer successfully blacklisted. Thank you for protecting the community!', type: 'success' });
        setFormData({ phone: '', email: '', address: '', reason: '' });
      } else {
        setMsg({ text: data.error || 'Failed to report customer', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Error connecting to server. Please try again.', type: 'error' });
    }
    setLoading(false);
  };

  const reasons = [
    'Refused Delivery',
    'Fake Order / Address',
    'Payment Reversal / Chargeback',
    'Abusive / Rude Behavior',
    'Multiple Cancellations',
    'Other'
  ];

  return (
    <div className="animate-fade page-section">
      <div className="section-card">
        <div className="section-title">
          <ShieldAlert size={22} style={{ color: 'var(--danger)' }} />
          <div>
            <h3>Blacklist a Customer</h3>
            <p>Report a fraudulent customer to warn other stores in the network.</p>
          </div>
        </div>

        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            {msg.type === 'success' ? <CheckCircle size={18} /> : <ShieldAlert size={18} />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-grid-2">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                placeholder="03001234567"
                value={formData.phone}
                required
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Email Address *</label>
              <input
                type="email"
                placeholder="customer@email.com"
                value={formData.email}
                required
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Full Address *</label>
            <input
              type="text"
              placeholder="Street, City, Area"
              value={formData.address}
              required
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Quick Select Reason</label>
            <div className="reason-chips">
              {reasons.map(r => (
                <button
                  type="button"
                  key={r}
                  className={`reason-chip ${formData.reason === r ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, reason: r })}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Detailed Reason *</label>
            <textarea
              placeholder="Describe what happened..."
              value={formData.reason}
              required
              rows="4"
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-danger full-width" disabled={loading}>
            {loading ? 'Reporting...' : '🚫 Report & Blacklist Customer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlacklistReport;
