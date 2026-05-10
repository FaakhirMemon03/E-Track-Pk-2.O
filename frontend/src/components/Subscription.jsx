import React, { useState } from 'react';
import { CreditCard, CheckCircle, Upload, Smartphone, User, Landmark, HelpCircle, FileText } from 'lucide-react';

const plans = [
  { id: '1month', label: 'Starter Plan', price: '15,000', desc: '1 Month access', icon: <Smartphone size={24} /> },
  { id: '6month', label: 'Professional', price: '25,000', desc: '6 Months access', badge: 'POPULAR', icon: <Landmark size={24} /> },
  { id: '1year', label: 'Enterprise', price: '50,000', desc: '1 Year access', badge: 'BEST VALUE', icon: <CreditCard size={24} /> },
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
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-up">
      {/* Choose Plan */}
      <div className="space-y-6">
        <div className="flex items-center gap-4 px-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <CreditCard size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Select Membership</h3>
            <p className="text-slate-400 text-sm">Choose a plan that fits your store's transaction volume.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map(plan => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`glass p-8 rounded-[32px] cursor-pointer transition-all duration-300 relative group overflow-hidden border-2 ${selectedPlan === plan.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/5 hover:border-white/20'}`}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest z-10">
                  {plan.badge}
                </div>
              )}
              <div className={`mb-6 p-4 rounded-2xl w-fit transition-all duration-300 ${selectedPlan === plan.id ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'bg-white/5 text-slate-400 group-hover:bg-white/10 group-hover:text-white'}`}>
                {plan.icon}
              </div>
              <h4 className="text-lg font-bold text-white mb-2 tracking-tight">{plan.label}</h4>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-xs font-bold text-slate-500">PKR</span>
                <span className="text-3xl font-black text-white tracking-tighter">{plan.price}</span>
              </div>
              <p className="text-xs font-medium text-slate-400 leading-relaxed mb-6">{plan.desc}</p>

              <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-opacity duration-300 ${selectedPlan === plan.id ? 'opacity-100 text-indigo-400' : 'opacity-0'}`}>
                <CheckCircle size={14} /> Selected Plan
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
        {/* Payment Guide */}
        <div className="glass p-10 rounded-[40px] border-white/5 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>

          <div className="relative z-10">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-3 tracking-tight">
              <Landmark className="text-indigo-400" size={24} /> Payment Guide
            </h4>

            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-4 group hover:bg-white/10 transition-all">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Platform</span>
                  <span className="text-xs font-black text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full">EasyPaisa / JazzCash</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-black text-white group-hover:tracking-wider transition-all duration-500">0300-1234567</p>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Account Name: E-Track PK Admin</p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                <div className="flex items-center gap-3 text-indigo-400">
                  <HelpCircle size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Quick Tip</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Always take a screenshot of your successful transaction. The Admin needs this to verify and activate your dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="glass p-10 lg:p-12 rounded-[40px] border-white/5 space-y-8 relative overflow-hidden shadow-2xl">
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Upload size={24} />
            </div>
            <h4 className="text-xl font-bold text-white tracking-tight">Submit Proof</h4>
          </div>

          {msg.text && (
            <div className={`p-6 rounded-2xl text-sm font-medium animate-fade-in flex items-start gap-3 relative z-10 ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
              {msg.type === 'success' && <CheckCircle className="mt-0.5" size={18} />}
              {msg.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <FileText size={12} /> Transaction ID (TID)
              </label>
              <input
                type="text"
                placeholder="Enter 11-digit TID from SMS"
                className="input-field py-4"
                value={transactionId}
                required
                onChange={e => setTransactionId(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Upload size={12} /> Payment Screenshot
              </label>
              <div
                className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-10 text-center transition-all ${file ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 hover:border-indigo-500/50 hover:bg-white/5'}`}
                onClick={() => document.getElementById('pay-file').click()}
              >
                <div className={`mx-auto mb-4 w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${file ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-500 group-hover:scale-110 group-hover:text-white'}`}>
                  <Upload size={24} />
                </div>
                <p className={`text-sm font-bold ${file ? 'text-white' : 'text-slate-500'}`}>
                  {file ? file.name : 'Click or Drag Screenshot Here'}
                </p>
                <p className="text-[10px] text-slate-600 mt-2 font-black uppercase tracking-widest">PNG, JPG up to 10MB</p>
                <input id="pay-file" type="file" accept="image/*" className="hidden" onChange={e => setFile(e.target.files[0])} />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full h-16 rounded-[24px] text-lg font-black tracking-tight flex items-center justify-center gap-3 disabled:opacity-50 group shadow-2xl"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <CheckCircle size={20} className="group-hover:scale-110 transition-transform" />
                  Submit Approval Request
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
