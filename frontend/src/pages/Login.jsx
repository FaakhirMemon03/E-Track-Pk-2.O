import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setLoading(true);

    try {
      // 1. Try Store Login
      let res = await fetch('http://localhost:5000/api/auth/store/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      let data = await res.json();

      // 2. If Store Login fails, try Admin Login
      if (!res.ok) {
        const adminRes = await fetch('http://localhost:5000/api/auth/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        const adminData = await adminRes.json();

        if (adminRes.ok) {
          localStorage.setItem('token', adminData.token);
          localStorage.setItem('admin', JSON.stringify(adminData.admin));
          setMsg({ text: 'Admin Login successful! Redirecting...', type: 'success' });
          setTimeout(() => navigate('/admin'), 1500);
          setLoading(false);
          return;
        } else {
          // If both fail, show the original store error or a generic one
          setMsg({ text: data.error || 'Invalid credentials', type: 'error' });
          setLoading(false);
          return;
        }
      }

      // Store Login was successful
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.store));
      setMsg({ text: 'Login successful! Redirecting...', type: 'success' });
      setTimeout(() => navigate('/dashboard'), 1500);
      
    } catch (err) {
      setMsg({ text: 'Could not connect to server', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="glass p-8 md:p-12 rounded-[32px] w-full max-w-md animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center p-3 mb-8 border border-white/10 shadow-2xl mx-auto">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400">Login to access your secure dashboard</p>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium animate-fade-in ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="input-field pl-12" 
                required 
                onChange={e => setFormData({...formData, email: e.target.value})} 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center px-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Password</label>
              <Link to="/forgot-password" size={12} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-bold uppercase tracking-tighter">Forgot?</Link>
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

          <button type="submit" className="btn-primary w-full py-4 text-lg group shadow-xl" disabled={loading}>
            {loading ? 'Authenticating...' : 'Login'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-10 text-center text-slate-400 text-sm relative z-10">
          Don't have an account? <Link to="/signup" className="text-indigo-400 font-bold hover:underline">Signup for free</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
