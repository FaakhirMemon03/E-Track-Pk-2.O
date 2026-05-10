import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { getApiUrl } from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch(getApiUrl('/api/auth/store/signup'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: data.message + ' Redirecting...', type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMsg({ text: data.error, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Could not connect to server', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="glass p-8 md:p-12 rounded-[32px] w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center p-3 mb-8 border border-white/10 shadow-2xl mx-auto">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
          <p className="text-slate-400">Join the network and start protecting your store</p>
        </div>
        
        {msg.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Store Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Enter store name" 
                className="input-field pl-12" 
                required 
                onChange={e => setFormData({...formData, name: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Store Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="email@store.com" 
                className="input-field pl-12" 
                required 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-field pl-12" 
                required 
                onChange={e => setFormData({...formData, password: e.target.value})} 
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg mt-4 group">
            Register Account <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-10 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-indigo-400 font-bold hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
