import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/auth/store/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        navigate('/login');
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert('Signup failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass premium-shadow" style={{ width: '400px', padding: '40px' }}>
        <h2 style={{ marginBottom: '30px' }}>Create Store Account</h2>
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
