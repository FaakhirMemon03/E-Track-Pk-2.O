import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Users, ShieldCheck, Settings, MessageSquare, LogOut } from 'lucide-react';
import StoreManagement from '../components/admin/StoreManagement';
import BlacklistMonitor from '../components/admin/BlacklistMonitor';
import AdminProfile from '../components/admin/AdminProfile';
import Chat from '../components/Chat';

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('admin')) || { username: 'Admin' });
  const [currentStoreChat, setCurrentStoreChat] = useState(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <div className="glass" style={{ width: '280px', padding: '30px', margin: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
        <div className="logo" style={{ marginBottom: '50px' }}>E-Track ADMIN</div>
        <nav style={{ flex: 1, background: 'transparent', flexDirection: 'column', alignItems: 'flex-start', height: 'auto', gap: '10px' }}>
          {[
            { icon: <Users size={20} />, label: "Manage Stores", path: "" },
            { icon: <ShieldCheck size={20} />, label: "Blacklist Monitor", path: "monitor" },
            { icon: <MessageSquare size={20} />, label: "Support Chats", path: "chats" },
            { icon: <Settings size={20} />, label: "Admin Settings", path: "settings" },
          ].map((item, i) => (
            <Link key={i} to={item.path} className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', border: 'none', padding: '15px' }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)', borderColor: 'transparent' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <div className="glass" style={{ padding: '20px 40px', marginBottom: '40px' }}>
          <h2 style={{ textAlign: 'left', margin: 0 }}>Admin Control Panel</h2>
          <p style={{ margin: 0 }}>Logged in as: <strong>{admin.email}</strong></p>
        </div>

        <Routes>
          <Route path="/" element={<StoreManagement />} />
          <Route path="monitor" element={<BlacklistMonitor />} />
          <Route path="chats" element={<ChatList onSelectStore={(id) => navigate(`chats/${id}`)} />} />
          <Route path="chats/:storeId" element={<Chat user={{ ...admin, currentChatStoreId: window.location.pathname.split('/').pop() }} role="admin" />} />
          <Route path="settings" element={<AdminProfile admin={admin} setAdmin={setAdmin} />} />
        </Routes>
      </div>
    </div>
  );
};

const ChatList = ({ onSelectStore }) => {
  const [stores, setStores] = useState([]);
  useEffect(() => {
    const fetchStores = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/stores', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setStores(data);
    };
    fetchStores();
  }, []);

  return (
    <div className="glass animate-fade" style={{ padding: '30px' }}>
      <h3>Active Conversations</h3>
      <div style={{ marginTop: '20px' }}>
        {stores.map(store => (
          <div key={store._id} onClick={() => onSelectStore(store._id)} className="glass" style={{ padding: '15px', marginBottom: '10px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{store.name} ({store.email})</span>
            <button className="btn-primary" style={{ padding: '8px 15px' }}>Open Chat</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
