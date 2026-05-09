import React, { useState } from 'react';
import { User, Camera, Lock, CheckCircle } from 'lucide-react';

const Profile = ({ user, setUser }) => {
  const [formData, setFormData] = useState({ name: user.name || '', password: '' });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) setPreview(URL.createObjectURL(selected));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setLoading(true);
    const fd = new FormData();
    fd.append('name', formData.name);
    if (file) fd.append('profilePic', file);
    if (formData.password) fd.append('password', formData.password);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Profile updated successfully!', type: 'success' });
        setUser(data.store);
        localStorage.setItem('user', JSON.stringify(data.store));
        setFormData({ ...formData, password: '' });
      } else {
        setMsg({ text: data.error || 'Update failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Server error. Could not update profile.', type: 'error' });
    }
    setLoading(false);
  };

  const avatarSrc = preview || (user.profilePic ? `http://localhost:5000${user.profilePic}` : null);

  return (
    <div className="animate-fade page-section">
      <div className="section-card">
        <div className="section-title">
          <User size={22} className="icon-primary" />
          <div>
            <h3>Profile Settings</h3>
            <p>Update your store's name, profile picture, and password.</p>
          </div>
        </div>

        {msg.text && (
          <div className={`alert alert-${msg.type}`}>
            {msg.type === 'success' ? <CheckCircle size={18} /> : null}
            {msg.text}
          </div>
        )}

        {/* Avatar Upload */}
        <div className="avatar-upload-area">
          <div className="avatar-wrapper" onClick={() => document.getElementById('profile-pic').click()}>
            {avatarSrc ? (
              <img src={avatarSrc} alt="Profile" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">
                <User size={40} />
              </div>
            )}
            <div className="avatar-overlay">
              <Camera size={20} />
            </div>
          </div>
          <input id="profile-pic" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '12px' }}>Click to change photo</p>
        </div>

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>Store Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label><Lock size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />New Password <span style={{ color: 'var(--text-muted)' }}>(leave blank to keep current)</span></label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary full-width" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
