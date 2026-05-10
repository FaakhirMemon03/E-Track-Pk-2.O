import React, { useState, useEffect } from 'react';
import { ShoppingBag, Mail, Calendar, Shield, Settings, CheckCircle, XCircle, MoreVertical, Search } from 'lucide-react';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const activatePlan = async (id) => {
    const plan = prompt('Enter plan name (1month, 6month, 1year):', '1month');
    const months = parseInt(prompt('Enter duration in months:', '1'));
    if (!plan || isNaN(months)) return;

    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/admin/stores/${id}/activate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ plan, durationMonths: months })
    });
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
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search stores..." 
            className="input-field pl-12 py-3 bg-white/5 border-white/10 w-64 lg:w-80 rounded-2xl"
          />
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
                          <Calendar size={14} />
                        </div>
                        <div>
                          <span className="text-xs font-black text-white uppercase tracking-widest">{store.plan}</span>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Exp: {new Date(store.planExpiresAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-8">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${store.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {store.status === 'active' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                        {store.status}
                      </span>
                    </td>
                    <td className="px-8 py-8">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => activatePlan(store._id)} 
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
                        <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white transition-all">
                          <MoreVertical size={16} />
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

      {/* Global Controls */}
      <div className="glass p-10 rounded-[32px] border-white/5 flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg">
            <Shield size={28} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white tracking-tight leading-tight">Ecosystem Security</h4>
            <p className="text-slate-400 text-sm">Monitor system integrity and store health metrics.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="btn-outline h-12 px-6 text-xs">Download Audit Log</button>
          <button className="btn-primary h-12 px-6 text-xs">
            <Settings size={14} /> Global Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreManagement;
