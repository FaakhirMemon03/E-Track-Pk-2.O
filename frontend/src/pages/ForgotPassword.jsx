import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, Shield, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1); // 1: Email, 2: Code & New Password
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleGetCode = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch(`http://localhost:5000/api/auth/store/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: `Reset code: ${data.code} (Check your console or terminal if email is not configured)`, type: 'success' });
        setStep(2);
      } else {
        setMsg({ text: data.error, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server error', type: 'error' });
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch(`http://localhost:5000/api/auth/store/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Password updated successfully! Redirecting to login...', type: 'success' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setMsg({ text: data.error, type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server error', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      <div className="glass p-8 md:p-12 rounded-[32px] w-full max-w-md animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
        
        <div className="text-center mb-10 relative z-10">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-400">
            <KeyRound size={32} />
          </div>
          <h2 className="text-3xl font-black text-white mb-2">Recover Access</h2>
          <p className="text-slate-400">Securely reset your store account password</p>
        </div>

        {msg.text && (
          <div className={`p-4 rounded-xl mb-8 text-sm font-medium animate-fade-in flex items-start gap-3 relative z-10 ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.type === 'success' ? <CheckCircle size={18} className="mt-0.5" /> : <Shield size={18} className="mt-0.5" />}
            {msg.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleGetCode} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Store Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                  type="email" 
                  placeholder="Enter your store email" 
                  className="input-field pl-12 h-14"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button className="btn-primary w-full h-14 rounded-2xl text-lg group">
              Send Reset Code <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link to="/login" className="flex items-center justify-center gap-2 text-slate-500 text-sm font-bold hover:text-white transition-colors mt-6">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Reset Code</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                className="input-field h-14 text-center tracking-[1em] font-mono font-black"
                required 
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                className="input-field h-14"
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <button className="btn-primary w-full h-14 rounded-2xl text-lg">Update Password</button>
            <button type="button" onClick={() => setStep(1)} className="w-full text-slate-500 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
              Wrong Email? Change It
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
