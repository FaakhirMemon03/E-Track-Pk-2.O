import React, { useState } from 'react';
import { Settings, Mail, Lock, ShieldCheck, HelpCircle, Save, Key, Shield } from 'lucide-react';

const AdminProfile = ({ admin, setAdmin }) => {
  const [formData, setFormData] = useState({ 
    name: admin.name || 'Master Admin',
    email: admin.email, 
    password: '', 
    recoveryQuestion: admin.recoveryQuestion || '', 
    recoveryAnswer: admin.recoveryAnswer || '' 
  });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setMsg({ text: 'Administrative profile updated successfully.', type: 'success' });
        setAdmin({ ...admin, ...formData });
        localStorage.setItem('admin', JSON.stringify({ ...admin, ...formData }));
      } else {
        setMsg({ text: 'Update failed. Please check your inputs.', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Network error. Could not reach security server.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto animate-fade-up">
      <div className="glass p-10 lg:p-12 rounded-[40px] border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl rounded-full -mr-40 -mt-40"></div>
        
        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg">
            <Settings size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">Admin System Settings</h3>
            <p className="text-slate-400 text-sm">Configure master access and recovery protocols.</p>
          </div>
        </div>

        {msg.text && (
          <div className={`p-6 rounded-2xl mb-10 flex items-start gap-4 text-sm font-medium animate-fade-in relative z-10 ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.type === 'success' ? <ShieldCheck size={18} className="mt-0.5" /> : <Lock size={18} className="mt-0.5" />}
            {msg.text}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Shield size={12} className="text-indigo-400" /> Administrative Name
              </label>
              <input 
                type="text" 
                className="input-field py-4"
                placeholder="Master Admin"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} /> Master Email
              </label>
              <input 
                type="email" 
                className="input-field py-4"
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2 text-indigo-400">
                <Key size={12} /> Master Password
              </label>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-field py-4 border-indigo-500/20"
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 space-y-8">
            <div className="flex items-center gap-3">
              <HelpCircle className="text-slate-600" size={18} />
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Recovery Protocol</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">Security Question</label>
                <input 
                  type="text" 
                  placeholder="e.g. Master code name?" 
                  className="input-field py-4"
                  value={formData.recoveryQuestion} 
                  onChange={e => setFormData({...formData, recoveryQuestion: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 ml-1">Security Answer</label>
                <input 
                  type="text" 
                  placeholder="Secret answer"
                  className="input-field py-4"
                  value={formData.recoveryAnswer} 
                  onChange={e => setFormData({...formData, recoveryAnswer: e.target.value})} 
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full h-16 rounded-[24px] bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 group"
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <Save size={22} className="group-hover:scale-110 transition-transform" />
                Commit Admin Changes
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
