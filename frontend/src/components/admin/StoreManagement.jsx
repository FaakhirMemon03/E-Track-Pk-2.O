import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Mail, Calendar, Shield, Settings, 
  CheckCircle, XCircle, MoreVertical, Search, 
  AlertCircle, ChevronRight, Package, CreditCard 
} from 'lucide-react';

const planMapping = {
  'trial': 'Trial (14 Days)',
  '1month': 'Starter Plan',
  '6month': 'Professional',
  '1year': 'Enterprise',
  'none': 'No Active Plan'
};

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // Full store object
  const [activationData, setActivationData] = useState({ plan: '1month', months: 1 });

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/stores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setStores(data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => { fetchStores(); }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/admin/stores/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchStores();
  };

  const handleActivate = async () => {
    if (!activeModal) return;
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/admin/stores/${activeModal._id}/activate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ plan: activationData.plan, durationMonths: activationData.months })
    });
    setActiveModal(null);
    fetchStores();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-up">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-2">
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight leading-tight">Store Management</h3>
          <p className="text-slate-400 text-sm">Control ecosystem access and manage membership statuses.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search stores..." 
              className="input-field pl-12 py-3 bg-white/5 border-white/10 w-64 lg:w-80 rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="glass-heavy rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
        {loading ? (
          <div className="p-32 flex justify-center">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/2">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Store Identity</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Active Membership</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Access Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Administrative Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {stores.map(store => (
                  <tr key={store._id} className="hover:bg-white/2 transition-colors group">
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-sm border border-indigo-500/20 shadow-lg shadow-indigo-500/5 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                          {store.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-white group-hover:text-indigo-400 transition-colors leading-tight">{store.name}</p>
                          <p className="text-xs text-slate-500 font-medium tracking-tight flex items-center gap-1 mt-1">
                            <Mail size={10} /> {store.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                          <Package size={14} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-white uppercase tracking-widest">{planMapping[store.plan] || store.plan}</span>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                            {store.planExpiresAt ? `Exp: ${new Date(store.planExpiresAt).toLocaleDateString()}` : 'No Expiry Set'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        store.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        store.status === 'pending_approval' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {store.status === 'active' ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                        {store.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => setActiveModal(store)} 
                          className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                        >
                          Modify Plan
                        </button>
                        <button 
                          onClick={() => updateStatus(store._id, store.status === 'active' ? 'banned' : 'active')} 
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95 ${store.status === 'active' ? 'border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white' : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white'}`}
                        >
                          {store.status === 'active' ? 'Ban Store' : 'Reinstate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activation Modal Overlay */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass p-10 rounded-[40px] max-w-xl w-full border border-white/10 shadow-2xl space-y-8 overflow-y-auto max-h-[90vh] custom-scrollbar">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white tracking-tight">Activate Membership</h4>
                <p className="text-slate-500 text-xs">Reviewing verification for: <strong>{activeModal.name}</strong></p>
              </div>
            </div>

            {/* Payment Verification Section */}
            {(activeModal.paymentTransactionId || activeModal.paymentScreenshot) && (
              <div className="p-6 bg-indigo-500/5 rounded-[24px] border border-indigo-500/10 space-y-4">
                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Verification Details</p>
                {activeModal.paymentTransactionId && (
                  <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                    <span className="text-xs text-slate-400">Transaction ID</span>
                    <span className="text-xs font-black text-white">{activeModal.paymentTransactionId}</span>
                  </div>
                )}
                {activeModal.paymentScreenshot && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400">Payment Screenshot</p>
                    <a 
                      href={`http://localhost:5000${activeModal.paymentScreenshot}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block group relative rounded-xl overflow-hidden border border-white/10"
                    >
                      <img 
                        src={`http://localhost:5000${activeModal.paymentScreenshot}`} 
                        alt="Proof" 
                        className="w-full h-40 object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">View Full Image</span>
                      </div>
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Assign Plan</label>
                <select 
                  className="input-field h-12"
                  value={activationData.plan}
                  onChange={(e) => setActivationData({...activationData, plan: e.target.value})}
                >
                  <option value="1month">Starter Plan - PKR 999</option>
                  <option value="6month">Professional - PKR 4,999</option>
                  <option value="1year">Enterprise - PKR 8,999</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Duration (Months)</label>
                <input 
                  type="number" 
                  className="input-field h-12" 
                  value={activationData.months}
                  onChange={(e) => setActivationData({...activationData, months: parseInt(e.target.value)})}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setActiveModal(null)}
                className="flex-1 py-4 rounded-2xl border border-white/5 text-slate-400 font-bold hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleActivate}
                className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-black shadow-xl shadow-indigo-500/20 hover:bg-indigo-600 transition-all"
              >
                Approve & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
