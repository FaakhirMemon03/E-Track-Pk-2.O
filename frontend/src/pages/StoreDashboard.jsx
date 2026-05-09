import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Search, AlertTriangle, CreditCard, MessageSquare, User, LogOut, TrendingUp, ShieldAlert, Activity } from 'lucide-react';
import CustomerLookup from '../components/store/CustomerLookup';
import BlacklistReport from '../components/BlacklistReport';
import Subscription from '../components/Subscription';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

const StoreDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [stats, setStats] = useState({ totalSearches: 0, blacklistedByYou: 0, systemWideReports: 0, recentActivity: [] });
  const [timeLeft, setTimeLeft] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Timer logic
    const timer = setInterval(() => {
      const now = new Date();
      const expiry = new Date(user.planExpiresAt);
      const diff = expiry - now;

      if (diff <= 0) {
        clearInterval(timer);
        handleLogout();
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    // Fetch Stats
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/store/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) setStats(data);
      } catch (err) { console.error(err); }
    };

    fetchStats();
    return () => clearInterval(timer);
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <LayoutDashboard size={24} />
          <span>E-Track PK</span>
        </div>
        
        <nav className="sidebar-nav">
          {[
            { icon: <TrendingUp size={20} />, label: "Dashboard", path: "" },
            { icon: <Search size={20} />, label: "Customer Lookup", path: "lookup" },
            { icon: <ShieldAlert size={20} />, label: "Blacklist Report", path: "report" },
            { icon: <CreditCard size={20} />, label: "Subscription", path: "subscription" },
            { icon: <MessageSquare size={20} />, label: "Live Support", path: "support" },
            { icon: <User size={20} />, label: "Profile Settings", path: "profile" },
          ].map((item, i) => (
            <Link key={i} to={item.path} className="nav-item">
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header glass">
          <div>
            <h2>Welcome, {user.name}</h2>
            <p className="plan-badge">Plan: {user.plan?.toUpperCase()}</p>
          </div>
          <div className="timer-box">
            <span className="timer-label">Time Left</span>
            <span className="timer-value">{timeLeft}</span>
          </div>
        </header>

        <div className="dashboard-grid">
          <Routes>
            <Route path="/" element={<HomeStats stats={stats} />} />
            <Route path="lookup" element={<CustomerLookup />} />
            <Route path="report" element={<BlacklistReport />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="support" element={<Chat user={user} role="store" />} />
            <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const HomeStats = ({ stats }) => (
  <div className="stats-layout animate-fade">
    <div className="stats-grid">
      <div className="stat-card glass">
        <TrendingUp className="stat-icon" />
        <div className="stat-info">
          <h3>Total Searches</h3>
          <p className="stat-number">{stats.totalSearches}</p>
        </div>
      </div>
      <div className="stat-card glass">
        <ShieldAlert className="stat-icon" style={{color: 'var(--danger)'}} />
        <div className="stat-info">
          <h3>Blacklisted by You</h3>
          <p className="stat-number">{stats.blacklistedByYou}</p>
        </div>
      </div>
      <div className="stat-card glass">
        <Activity className="stat-icon" style={{color: 'var(--success)'}} />
        <div className="stat-info">
          <h3>System Reports</h3>
          <p className="stat-number">{stats.systemWideReports}</p>
        </div>
      </div>
    </div>

    <div className="activity-card glass">
      <h3><Activity size={20} style={{verticalAlign: 'middle', marginRight: '10px'}} /> Platform Activity</h3>
      <div className="activity-list">
        {stats.recentActivity.length > 0 ? stats.recentActivity.map((act, i) => (
          <div key={i} className="activity-item">
            <span className="store-name">{act.reportedBy?.name}</span> blacklisted <strong>{act.phone.slice(0, 4)}XXXXXXX</strong> for '{act.reason}'
          </div>
        )) : <p style={{color: 'var(--text-muted)'}}>No recent activity found.</p>}
      </div>
    </div>
  </div>
);

export default StoreDashboard;
