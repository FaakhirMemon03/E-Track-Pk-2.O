import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Phone, Mail, MapPin, MessageSquare, AlertTriangle } from 'lucide-react';

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
    'Payment Reversal',
    'Abusive Behavior',
    'Multiple Cancellations',
    'Other'
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="glass p-10 lg:p-12 rounded-[40px] border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 blur-3xl rounded-full -mr-40 -mt-40"></div>
        
        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">Blacklist a Customer</h3>
            <p className="text-slate-400 text-sm">Contribute to the network by flagging fraudulent activity.</p>
          </div>
        </div>

        {msg.text && (
          <div className={`p-6 rounded-2xl mb-10 flex items-start gap-4 text-sm font-medium animate-fade-in ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.type === 'success' ? <CheckCircle className="mt-0.5 flex-shrink-0" size={18} /> : <AlertTriangle className="mt-0.5 flex-shrink-0" size={18} />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Phone size={12} /> Phone Number *
              </label>
              <input
                type="text"
                placeholder="03001234567"
                className="input-field"
                value={formData.phone}
                required
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} /> Email Address *
              </label>
              <input
                type="email"
                placeholder="customer@email.com"
                className="input-field"
                value={formData.email}
                required
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MapPin size={12} /> Full Address *
            </label>
            <input
              type="text"
              placeholder="Street, City, Area"
              className="input-field"
              value={formData.address}
              required
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Quick Select Reason</label>
            <div className="flex flex-wrap gap-3">
              {reasons.map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setFormData({ ...formData, reason: r })}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${formData.reason === r ? 'bg-red-500 text-white border-red-500' : 'bg-white/5 text-slate-400 border-white/5 hover:border-red-500/50 hover:text-red-400'}`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
              <MessageSquare size={12} /> Detailed Reason *
            </label>
            <textarea
              placeholder="Provide context for other sellers (e.g. 'Cancelled at doorstep after 3 attempts')"
              className="input-field min-h-[120px] resize-none py-4"
              value={formData.reason}
              required
              onChange={e => setFormData({ ...formData, reason: e.target.value })}
            />
          </div>

          <button 
            type="submit" 
            className="w-full h-16 rounded-[20px] bg-red-500 hover:bg-red-600 text-white font-black text-lg shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group" 
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldAlert size={20} className="group-hover:scale-110 transition-transform" />
                Confirm Blacklist
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BlacklistReport;
