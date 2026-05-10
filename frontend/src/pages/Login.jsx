import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch('http://localhost:5000/api/auth/store/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.store));
        setMsg({ text: 'Login successful! Redirecting...', type: 'success' });
        setTimeout(() => navigate('/dashboard'), 1500);
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
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <Shield size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Login to access your store dashboard</p>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" size={12} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot Password?</Link>
            </div>
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

          <button type="submit" className="btn-primary w-full py-4 text-lg group">
            Login <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-10 text-center text-slate-400 text-sm">
          Don't have an account? <Link to="/signup" className="text-indigo-400 font-bold hover:underline">Signup for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
