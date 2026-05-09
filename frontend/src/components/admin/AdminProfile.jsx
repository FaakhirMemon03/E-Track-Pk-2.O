import React, { useState } from 'react';

const AdminProfile = ({ admin, setAdmin }) => {
  const [formData, setFormData] = useState({ 
    username: admin.username, 
    password: '', 
    recoveryQuestion: admin.recoveryQuestion || '', 
    recoveryAnswer: admin.recoveryAnswer || '' 
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Admin profile updated');
        setAdmin({ ...admin, ...formData });
        localStorage.setItem('admin', JSON.stringify({ ...admin, ...formData }));
      }
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="glass animate-fade" style={{ padding: '40px', maxWidth: '600px' }}>
      <h3>Admin Settings</h3>
      <form onSubmit={handleUpdate}>
        <label>Admin Username</label>
        <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
        <label>New Password</label>
        <input type="password" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
        <label>Recovery Question (for forgot password)</label>
        <input type="text" placeholder="e.g. Your first school name?" value={formData.recoveryQuestion} onChange={e => setFormData({...formData, recoveryQuestion: e.target.value})} />
        <label>Recovery Answer</label>
        <input type="text" value={formData.recoveryAnswer} onChange={e => setFormData({...formData, recoveryAnswer: e.target.value})} />
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Update Settings</button>
      </form>
    </div>
  );
};

export default AdminProfile;
