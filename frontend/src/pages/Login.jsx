import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass premium-shadow" style={{ width: '400px', padding: '40px' }}>
        <h2 style={{ marginBottom: '30px' }}>Login to E-Track</h2>

        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Store Email</label>
          <input type="email" placeholder="email@store.com" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <label>Password</label>
          <input type="password" placeholder="••••••••" required onChange={e => setFormData({...formData, password: e.target.value})} />
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link to="/forgot-password" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%' }}>Login</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
