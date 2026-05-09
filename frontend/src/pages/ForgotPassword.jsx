import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, Mail, ShieldQuestion } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('store'); // 'store' or 'admin'
  const [step, setStep] = useState(1); // 1: Email, 2: Question/Code, 3: Success
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleGetQuestion = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      const endpoint = role === 'admin' ? '/api/auth/admin/forgot-password' : '/api/auth/store/forgot-password';
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok) {
        if (role === 'admin') {
          setQuestion(data.question);
        } else {
          setMsg({ text: `Reset code: ${data.code} (In production, this would be emailed)`, type: 'success' });
        }
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
      const endpoint = role === 'admin' ? '/api/auth/admin/reset-password' : '/api/auth/store/reset-password';
      const body = role === 'admin' 
        ? { email, answer, newPassword }
        : { email, token, newPassword };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Password reset successfully! Redirecting to login...', type: 'success' });
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
          <h2>Reset Password</h2>
          <p style={{ color: 'var(--text-muted)' }}>Follow the steps to recover your account.</p>
        </div>

        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            {msg.text}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleGetQuestion}>
            <div style={{ marginBottom: '20px' }}>
              <label>Account Type</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="glass"
                style={{ width: '100%', padding: '12px', marginTop: '8px', color: 'white' }}
              >
                <option value="store">Store Owner</option>
                <option value="admin">Platform Admin</option>
              </select>
            </div>
            <div style={{ marginBottom: '30px' }}>
              <label>Email Address</label>
              <div style={{ position: 'relative', marginTop: '8px' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  required 
                  style={{ paddingLeft: '40px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button className="btn-primary full-width">Continue</button>
            <Link to="/login" style={{ display: 'block', textAlign: 'center', marginTop: '20px', color: 'var(--text-muted)', textDecoration: 'none' }}>Back to Login</Link>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleReset}>
            {role === 'admin' ? (
              <div style={{ marginBottom: '20px' }}>
                <label>Security Question</label>
                <p style={{ color: 'var(--primary)', fontWeight: '600', margin: '10px 0' }}>{question}</p>
                <input 
                  type="text" 
                  placeholder="Enter your answer" 
                  required 
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
            ) : (
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
            )}
            
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
            
            <button className="btn-primary full-width">Reset Password</button>
            <button type="button" onClick={() => setStep(1)} className="btn-outline full-width" style={{ marginTop: '10px' }}>Try Different Email</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
