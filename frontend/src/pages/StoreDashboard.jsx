import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { LayoutDashboard, UserSearch, ShieldAlert, CreditCard, MessageSquare, User, LogOut } from 'lucide-react';
import CustomerLookup from '../components/CustomerLookup';
import BlacklistReport from '../components/BlacklistReport';
import Subscription from '../components/Subscription';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

const StoreDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [timeLeft, setTimeLeft] = useState('');
  const navigate = useNavigate();

  // Timer Logic
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const expiry = new Date(user.planExpiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        clearInterval(timer);
        handleLogout('Your plan has expired. Please purchase a plan to continue.');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [user.planExpiresAt]);

  const handleLogout = (msg) => {
    if (msg) alert(msg);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Sidebar */}
      <div className="glass" style={{ width: '280px', padding: '30px', margin: '20px', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
        <div className="logo" style={{ marginBottom: '50px' }}>E-Track PK</div>
        <nav style={{ flex: 1, background: 'transparent', flexDirection: 'column', alignItems: 'flex-start', height: 'auto', gap: '10px' }}>
          {[
            { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "" },
            { icon: <UserSearch size={20} />, label: "Customer Lookup", path: "lookup" },
            { icon: <ShieldAlert size={20} />, label: "Blacklist Report", path: "report" },
            { icon: <CreditCard size={20} />, label: "Subscription", path: "subscription" },
            { icon: <MessageSquare size={20} />, label: "Live Support", path: "chat" },
            { icon: <User size={20} />, label: "Profile Settings", path: "profile" },
          ].map((item, i) => (
            <Link key={i} to={item.path} className="btn-outline" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'flex-start', border: 'none', padding: '15px' }}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <button onClick={() => handleLogout()} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--danger)', borderColor: 'transparent' }}>
          <LogOut size={20} /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        {/* Header */}
        <div className="glass" style={{ padding: '20px 40px', marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: '1.2rem', textAlign: 'left', marginBottom: 0 }}>Welcome, {user.name}</h2>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>Plan: <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{user.plan.toUpperCase()}</span></p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>Time Left</p>
            <h3 style={{ color: 'var(--warning)', margin: 0 }}>{timeLeft || 'Calculating...'}</h3>
          </div>
        </div>

        {/* Dynamic Content */}
        <Routes>
          <Route path="/" element={<DashboardHome user={user} />} />
          <Route path="lookup" element={<CustomerLookup />} />
          <Route path="report" element={<BlacklistReport />} />
          <Route path="subscription" element={<Subscription />} />
          <Route path="chat" element={<Chat user={user} role="store" />} />
          <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
        </Routes>
      </div>
    </div>
  );
};

const DashboardHome = ({ user }) => (
  <div className="animate-fade">
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
      <div className="glass" style={{ padding: '30px' }}>
        <p>Total Searches</p>
        <h2>42</h2>
      </div>
      <div className="glass" style={{ padding: '30px' }}>
        <p>Blacklisted by You</p>
        <h2>5</h2>
      </div>
      <div className="glass" style={{ padding: '30px' }}>
        <p>System Wide Reports</p>
        <h2>1.2k+</h2>
      </div>
    </div>
    <div className="glass" style={{ marginTop: '30px', padding: '40px' }}>
      <h3>Platform Activity</h3>
      <p>Daraz PK just blacklisted 0300-XXXXXXX for 'Refused Delivery'.</p>
      <p>Store "FashionHub" reported a fraud email: fake@gmail.com</p>
    </div>
  </div>
);

export default StoreDashboard;
