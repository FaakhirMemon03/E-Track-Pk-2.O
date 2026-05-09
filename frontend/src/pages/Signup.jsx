import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    try {
      const res = await fetch('http://localhost:5000/api/auth/store/signup', {
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass premium-shadow" style={{ width: '400px', padding: '40px' }}>
        <h2 style={{ marginBottom: '30px' }}>Create Store Account</h2>
        
        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>Store Name</label>
          <input type="text" placeholder="Enter store name" required onChange={e => setFormData({...formData, name: e.target.value})} />
          <label>Store Email</label>
          <input type="email" placeholder="email@store.com" required onChange={e => setFormData({...formData, email: e.target.value})} />
          <label>Password</label>
          <input type="password" placeholder="••••••••" required onChange={e => setFormData({...formData, password: e.target.value})} />
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Register</button>
        </form>
        <p style={{ marginTop: '20px', textAlign: 'center' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
