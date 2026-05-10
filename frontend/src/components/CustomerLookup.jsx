import React, { useState } from 'react';
import { Search, ShieldAlert, ShieldCheck, ShieldX, Phone, Mail, ArrowRight, History } from 'lucide-react';

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
      
      // Fetch Fraud Reports
      const res = await fetch(`http://localhost:5000/api/store/lookup?phone=${query.phone}&email=${query.email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      
      // Fetch Delivery History (if phone is provided)
      let deliveryData = { delivered: 0, returned: 0 };
      if (query.phone) {
        try {
          const dRes = await fetch(`http://localhost:5000/api/store/check-delivery/${query.phone}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          deliveryData = await dRes.json();
        } catch (e) {}
      }

      if (res.ok) {
        setResult({ ...data, delivery: deliveryData });
      } else {
        setMsg({ text: data.error || 'Lookup failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Could not connect to server', type: 'error' });
    }
    setLoading(false);
  };

  const getRiskConfig = (risk) => {
    if (risk === 'High Risk') return { 
      color: 'text-red-400', 
      icon: <ShieldX size={64} />, 
      bg: 'bg-red-500/10', 
      border: 'border-red-500/20',
      shadow: 'shadow-red-500/10'
    };
    if (risk === 'Medium Risk') return { 
      color: 'text-amber-400', 
      icon: <ShieldAlert size={64} />, 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/20',
      shadow: 'shadow-amber-500/10'
    };
    return { 
      color: 'text-emerald-400', 
      icon: <ShieldCheck size={64} />, 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/20',
      shadow: 'shadow-emerald-500/10'
    };
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-up">
      {/* Search Card */}
      <div className="glass p-10 rounded-[32px] border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
        
        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Search size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Customer Risk Lookup</h3>
            <p className="text-slate-400 text-sm">Scan our neural network for fraud history across 500+ stores.</p>
          </div>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-xl mb-8 text-sm font-medium animate-fade-in ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleLookup} className="grid md:grid-cols-[1fr_1fr_auto] gap-4 relative z-10">
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Phone (0300...)"
              className="input-field pl-12 h-14"
              onChange={e => setQuery({ ...query, phone: e.target.value })}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="email"
              placeholder="Email Address"
              className="input-field pl-12 h-14"
              onChange={e => setQuery({ ...query, email: e.target.value })}
            />
          </div>
          <button type="submit" className="btn-primary h-14 px-8 min-w-[140px]" disabled={loading}>
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Analyze'}
          </button>
        </form>
      </div>

      {/* Results Card */}
      {result && (() => {
        const config = getRiskConfig(result.risk);
        return (
          <div className="animate-fade-in space-y-6">
            <div className={`glass p-12 rounded-[40px] text-center border-2 transition-all ${config.bg} ${config.border} ${config.shadow}`}>
              <div className={`flex justify-center mb-6 animate-bounce-slow ${config.color}`}>{config.icon}</div>
              <h2 className={`text-5xl font-black mb-4 tracking-tighter ${config.color}`}>{result.risk}</h2>
              <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
                {result.reports.length === 0
                  ? 'The system has not identified any negative patterns for this customer. Proceed with confidence.'
                  : `Our database has flagged ${result.reports.length} historical incident${result.reports.length > 1 ? 's' : ''} with this customer.`}
              </p>
            </div>

            {/* Delivery Trust Metrics */}
            <div className="grid grid-cols-2 gap-6">
              <div className="glass p-8 rounded-[32px] border-emerald-500/20 text-center relative overflow-hidden group hover:bg-emerald-500/5 transition-all">
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Successful Deliveries</span>
                  <h4 className="text-4xl font-black text-emerald-400 tracking-tighter">{result.delivery?.delivered || 0}</h4>
                  <p className="text-[10px] text-emerald-500/60 font-bold uppercase tracking-widest mt-2">Network Verification</p>
                </div>
                <CheckCircle className="absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors" size={80} />
              </div>

              <div className="glass p-8 rounded-[32px] border-red-500/20 text-center relative overflow-hidden group hover:bg-red-500/5 transition-all">
                <div className="relative z-10">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Returned Orders</span>
                  <h4 className="text-4xl font-black text-red-400 tracking-tighter">{result.delivery?.returned || 0}</h4>
                  <p className="text-[10px] text-red-500/60 font-bold uppercase tracking-widest mt-2">Delivery Failures</p>
                </div>
                <XCircle className="absolute -right-4 -bottom-4 text-red-500/5 group-hover:text-red-500/10 transition-colors" size={80} />
              </div>
            </div>

            {result.reports.length > 0 && (
              <div className="glass p-10 rounded-[32px] border-white/5 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 border border-white/5">
                    <History size={20} />
                  </div>
                  <h4 className="text-xl font-bold text-white tracking-tight">Report History</h4>
                </div>

                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {result.reports.map((report, i) => (
                    <div key={i} className="glass bg-white/2 p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[10px] font-black border border-indigo-500/10">
                            {report.reportedBy?.name?.charAt(0) || 'S'}
                          </div>
                          <span className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {report.reportedBy?.name || 'Authorized Store'}
                          </span>
                        </div>
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">
                          {new Date(report.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="mt-1 text-red-500/50"><ShieldAlert size={14} /></div>
                        <p className="text-sm text-slate-400 leading-relaxed italic">
                          "{report.reason}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};

export default CustomerLookup;
