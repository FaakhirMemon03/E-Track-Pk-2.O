import React, { useState } from 'react';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({ name: user.name, password: '' });
  const [file, setFile] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('name', formData.name);
    if (file) fd.append('profilePic', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profile updated');
        setUser(data.store);
        localStorage.setItem('user', JSON.stringify(data.store));
      }
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div className="glass animate-fade" style={{ padding: '40px', maxWidth: '600px' }}>
      <h3>Store Profile Settings</h3>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src={user.profilePic ? `http://localhost:5000${user.profilePic}` : 'https://via.placeholder.com/100'} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary)' }} />
      </div>
      <form onSubmit={handleUpdate}>
        <label>Store Name</label>
        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
        <label>New Profile Picture</label>
        <input type="file" onChange={e => setFile(e.target.files[0])} />
        <label>Change Password (Leave blank to keep current)</label>
        <input type="password" placeholder="••••••••" onChange={e => setFormData({...formData, password: e.target.value})} />
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Changes</button>
      </form>
    </div>
  );
};

export default Profile;
