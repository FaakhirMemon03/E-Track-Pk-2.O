import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, AlertTriangle, CreditCard, MessageSquare, User, LogOut, TrendingUp, ShieldAlert, Activity } from 'lucide-react';
import CustomerLookup from '../components/CustomerLookup';
import BlacklistReport from '../components/BlacklistReport';
import Subscription from '../components/Subscription';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

const StoreDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [stats, setStats] = useState({ totalSearches: 0, blacklistedByYou: 0, systemWideReports: 0, recentActivity: [] });
  const [timeLeft, setTimeLeft] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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

  const navItems = [
    { icon: <TrendingUp size={20} />, label: "Overview", path: "/dashboard" },
    { icon: <Search size={20} />, label: "Customer Lookup", path: "/dashboard/lookup" },
    { icon: <ShieldAlert size={20} />, label: "Blacklist Report", path: "/dashboard/report" },
    { icon: <CreditCard size={20} />, label: "Subscription", path: "/dashboard/subscription" },
    { icon: <MessageSquare size={20} />, label: "Live Support", path: "/dashboard/support" },
    { icon: <User size={20} />, label: "Profile Settings", path: "/dashboard/profile" },
  ];

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="sidebar-header">
          <div className="logo-icon"><ShieldAlert size={28} /></div>
          <span>E-Track PK</span>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item, i) => (
            <Link 
              key={i} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="logout-btn nav-item">
          <LogOut size={20} /> <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="content-header glass">
          <div>
            <p className="welcome-text">Welcome back,</p>
            <h2 className="user-name">{user.name}</h2>
            <div className="plan-pill">{user.plan?.toUpperCase()} PLAN</div>
          </div>
          <div className="header-right">
            <div className="timer-card glass">
              <span className="timer-label">Session Expires In</span>
              <span className="timer-value">{timeLeft}</span>
            </div>
          </div>
        </header>

        <div className="page-content">
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
      <div className="stat-card glass primary-glow">
        <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
        <div className="stat-info">
          <p className="stat-label">Total Searches</p>
          <h3 className="stat-number">{stats.totalSearches}</h3>
        </div>
      </div>
      <div className="stat-card glass danger-glow">
        <div className="stat-icon-wrapper"><ShieldAlert size={24} /></div>
        <div className="stat-info">
          <p className="stat-label">Blacklisted by You</p>
          <h3 className="stat-number">{stats.blacklistedByYou}</h3>
        </div>
      </div>
      <div className="stat-card glass success-glow">
        <div className="stat-icon-wrapper"><Activity size={24} /></div>
        <div className="stat-info">
          <p className="stat-label">System Wide Reports</p>
          <h3 className="stat-number">{stats.systemWideReports}</h3>
        </div>
      </div>
    </div>

    <div className="activity-section glass">
      <div className="section-header-compact">
        <Activity size={18} className="icon-primary" />
        <h3>Live Network Activity</h3>
      </div>
      <div className="activity-list">
        {stats.recentActivity.length > 0 ? stats.recentActivity.map((act, i) => (
          <div key={i} className="activity-item">
            <div className="activity-dot"></div>
            <div className="activity-content">
              <span className="store-name">{act.reportedBy?.name}</span>
              <span className="activity-text"> reported a fraud customer </span>
              <span className="fraud-phone">{act.phone.slice(0, 4)}XXXXXXX</span>
              <div className="activity-reason">{act.reason}</div>
            </div>
            <div className="activity-time">Just now</div>
          </div>
        )) : (
          <div className="empty-state">
            <p>No recent platform activity to show.</p>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default StoreDashboard;
