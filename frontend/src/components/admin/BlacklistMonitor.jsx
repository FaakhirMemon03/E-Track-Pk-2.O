import React, { useState, useEffect } from 'react';
import { ShieldAlert, User, MapPin, MessageSquare, Building2, Search, Filter, Phone, Mail, Clock } from 'lucide-react';

const BlacklistMonitor = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setCustomers(data);
      } catch (e) {}
      setLoading(false);
    };
    fetchCustomers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-fade-up">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-6 px-2">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 shadow-lg shadow-red-500/5">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h3 className="text-3xl font-black text-white tracking-tight leading-tight">Blacklist Monitor</h3>
            <p className="text-slate-400 text-sm">Real-time surveillance of global fraud reports across the network.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text" 
              placeholder="Filter by phone/email..." 
              className="input-field pl-10 py-2.5 text-xs bg-white/5 border-white/10 w-56 rounded-xl"
            />
          </div>
          <button className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-32 flex justify-center">
          <div className="w-12 h-12 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {customers.map(c => (
            <div key={c._id} className="glass p-8 rounded-[32px] border-white/5 relative group hover:border-red-500/30 transition-all duration-300 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-red-500/10 transition-colors"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-white font-mono font-black text-lg tracking-wider">
                    <Phone size={14} className="text-red-500" />
                    {c.phone}
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-tight">
                    <Mail size={12} />
                    {c.email}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                  <ShieldAlert size={16} />
                </div>
              </div>

              <div className="flex items-start gap-3 mb-8 relative z-10">
                <MapPin size={16} className="text-slate-600 mt-1 flex-shrink-0" />
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 italic">
                  {c.address}
                </p>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4 relative z-10">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    <MessageSquare size={10} /> Fraud Reason
                  </div>
                  <p className="text-sm font-bold text-white tracking-tight">{c.reason}</p>
                </div>
                
                <div className="flex items-center justify-between gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-indigo-500 flex items-center justify-center text-[10px] font-black text-white">
                      {c.reportedBy?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-white truncate max-w-[100px]">{c.reportedBy?.name || 'Authorized Store'}</p>
                      <div className="flex items-center gap-1 text-[8px] font-bold text-slate-600 uppercase">
                        <Building2 size={8} /> Source Store
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                    <Clock size={10} />
                    {new Date(c.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && customers.length === 0 && (
        <div className="p-32 text-center space-y-6">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-700">
            <ShieldAlert size={40} />
          </div>
          <div className="space-y-2">
            <h4 className="text-xl font-bold text-white">Platform is Secure</h4>
            <p className="text-slate-500 max-w-sm mx-auto text-sm">No new fraud cases have been reported in the selected period.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlacklistMonitor;
