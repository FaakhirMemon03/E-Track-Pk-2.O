import React, { useState } from 'react';
import { User, Camera, Lock, CheckCircle, Save, Mail, ShoppingBag } from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({ name: user.name || '', password: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setLoading(true);
    const fd = new FormData();
    fd.append('name', formData.name);
    if (file) fd.append('profilePic', file);
    if (formData.password) fd.append('password', formData.password);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Profile updated successfully!', type: 'success' });
        setUser(data.store);
        localStorage.setItem('user', JSON.stringify(data.store));
        setFormData({ ...formData, password: '' });
      } else {
        setMsg({ text: data.error || 'Update failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server error. Could not update profile.', type: 'error' });
    }
    setLoading(false);
  };

  const avatarSrc = preview || (user.profilePic ? `http://localhost:5000${user.profilePic}` : null);

  return (
    <div className="max-w-4xl mx-auto animate-fade-up">
      <div className="glass p-10 lg:p-12 rounded-[40px] border-white/5 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl rounded-full -mr-40 -mt-40"></div>
        
        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
            <User size={28} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">Profile Settings</h3>
            <p className="text-slate-400 text-sm">Manage your store identity and security credentials.</p>
          </div>
        </div>

        {msg.text && (
          <div className={`p-6 rounded-2xl mb-10 flex items-start gap-4 text-sm font-medium animate-fade-in ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.type === 'success' ? <CheckCircle className="mt-0.5 flex-shrink-0" size={18} /> : <Lock className="mt-0.5 flex-shrink-0" size={18} />}
            {msg.text}
          </div>
        )}

        {/* Avatar Upload */}
        <div className="flex flex-col items-center mb-12 relative z-10">
          <div 
            className="group relative cursor-pointer"
            onClick={() => document.getElementById('profile-pic').click()}
          >
            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-indigo-500/30 bg-slate-900 flex items-center justify-center transition-all group-hover:border-indigo-500 group-hover:scale-105 shadow-2xl">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={48} className="text-slate-700" />
              )}
            </div>
            <div className="absolute inset-0 bg-slate-950/60 rounded-[40px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
              <Camera className="text-white" size={24} />
            </div>
            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white border-4 border-slate-950 group-hover:scale-110 transition-transform">
              <Camera size={16} />
            </div>
          </div>
          <input id="profile-pic" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-6">Click to update brand logo</p>
        </div>

        <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-8 relative z-10">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <ShoppingBag size={12} /> Store Name
              </label>
              <input
                type="text"
                className="input-field py-4"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <Mail size={12} /> Contact Email
              </label>
              <input
                type="email"
                className="input-field py-4 opacity-50 cursor-not-allowed"
                value={user.email}
                disabled
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2 text-indigo-400">
                <Lock size={12} /> Update Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field py-4"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
              />
              <p className="text-[10px] text-slate-600 font-bold px-1 italic">Leave blank if you don't want to change it.</p>
            </div>

            <div className="pt-2">
              <button 
                type="submit" 
                className="btn-primary w-full h-14 rounded-[20px] font-black tracking-tight flex items-center justify-center gap-3 disabled:opacity-50 group" 
                disabled={loading}
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Save size={20} className="group-hover:scale-110 transition-transform" />
                    Save All Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
