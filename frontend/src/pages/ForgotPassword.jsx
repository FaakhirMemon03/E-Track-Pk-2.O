import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail } from 'lucide-react';

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)' }}>
      <div className="glass premium-shadow animate-fade" style={{ width: '450px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div className="feature-icon" style={{ margin: '0 auto 20px auto', width: '60px', height: '60px', background: 'rgba(99,102,241,0.1)', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <KeyRound size={32} />
          </div>
          <h2>Store Password Recovery</h2>
          <p style={{ color: 'var(--text-muted)' }}>Enter your email to receive a reset code.</p>
        </div>

        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            {msg.text}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleGetCode}>
            <div style={{ marginBottom: '30px' }}>
              <label>Store Email Address</label>
              <div style={{ position: 'relative', marginTop: '8px' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  placeholder="Enter your store email" 
                  required 
                  style={{ paddingLeft: '40px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button className="btn-primary full-width">Send Reset Code</button>
            <Link to="/login" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', textDecoration: 'none' }}>Back to Login</Link>
          </form>
        ) : (
          <form onSubmit={handleReset}>
            <div style={{ marginBottom: '20px' }}>
              <label>Reset Code</label>
              <input 
                type="text" 
                placeholder="Enter 6-digit code" 
                required 
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>
            
            <div style={{ marginBottom: '30px' }}>
              <label>New Password</label>
              <input 
                type="password" 
                placeholder="Enter new password" 
                required 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            
            <button className="btn-primary full-width">Update Password</button>
            <button type="button" onClick={() => setStep(1)} className="btn-outline full-width" style={{ marginTop: '10px' }}>Change Email</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
