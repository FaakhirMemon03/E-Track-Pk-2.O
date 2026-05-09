import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Search, ShieldAlert, CreditCard, MessageSquare, User, LogOut, TrendingUp, Activity, Shield } from 'lucide-react';
import CustomerLookup from '../components/CustomerLookup';
import BlacklistReport from '../components/BlacklistReport';
import Subscription from '../components/Subscription';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Overview',         path: '/dashboard' },
  { icon: <Search size={18} />,          label: 'Customer Lookup',  path: '/dashboard/lookup' },
  { icon: <ShieldAlert size={18} />,     label: 'Blacklist Report', path: '/dashboard/report' },
  { icon: <CreditCard size={18} />,      label: 'Subscription',     path: '/dashboard/subscription' },
  { icon: <MessageSquare size={18} />,   label: 'Live Support',     path: '/dashboard/support' },
  { icon: <User size={18} />,            label: 'Profile Settings', path: '/dashboard/profile' },
];

const StoreDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [stats, setStats] = useState({ totalSearches: 0, blacklistedByYou: 0, systemWideReports: 0, recentActivity: [] });
  const [timeLeft, setTimeLeft] = useState('');
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(user.planExpiresAt) - new Date();
      if (diff <= 0) { clearInterval(timer); handleLogout(); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);

    fetch('http://localhost:5000/api/store/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    }).then(r => r.json()).then(d => { if (d && !d.error) setStats(d); }).catch(() => {});

    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const avatarSrc = user.profilePic ? `http://localhost:5000${user.profilePic}` : null;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar glass">
        <div className="sidebar-brand">
          <div className="sidebar-logo"><Shield size={20} /></div>
          <span>E-Track PK</span>
        </div>

        {/* User info */}
        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-username">{user.name}</p>
            <p className="sidebar-email">{user.email}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'nav-active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="sidebar-logout">
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* Main */}
      <main className="dash-main">
        {/* Header */}
        <div className="dash-header glass">
          <div>
            <p className="dash-greeting">Welcome back,</p>
            <h2 className="dash-username">{user.name}</h2>
            <span className="plan-tag">{user.plan?.toUpperCase()} PLAN</span>
          </div>
          <div className="dash-timer">
            <span className="timer-label">Session Expires In</span>
            <span className="timer-value">{timeLeft}</span>
          </div>
        </div>

        {/* Content */}
        <div className="dash-content">
          <Routes>
            <Route path="/"            element={<Overview stats={stats} />} />
            <Route path="lookup"       element={<CustomerLookup />} />
            <Route path="report"       element={<BlacklistReport />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="support"      element={<Chat user={user} role="store" />} />
            <Route path="profile"      element={<Profile user={user} setUser={setUser} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

const Overview = ({ stats }) => (
  <div className="animate-fade">
    <div className="stats-row">
      <div className="stat-box glass">
        <div className="stat-icon-wrap primary"><TrendingUp size={22} /></div>
        <div><p className="stat-lbl">Total Searches</p><h3 className="stat-val">{stats.totalSearches}</h3></div>
      </div>
      <div className="stat-box glass">
        <div className="stat-icon-wrap danger"><ShieldAlert size={22} /></div>
        <div><p className="stat-lbl">Blacklisted by You</p><h3 className="stat-val">{stats.blacklistedByYou}</h3></div>
      </div>
      <div className="stat-box glass">
        <div className="stat-icon-wrap success"><Activity size={22} /></div>
        <div><p className="stat-lbl">Network Reports</p><h3 className="stat-val">{stats.systemWideReports}</h3></div>
      </div>
    </div>

    <div className="activity-box glass">
      <div className="activity-head">
        <Activity size={18} /><h3>Recent Platform Activity</h3>
      </div>
      {stats.recentActivity?.length > 0 ? (
        <table className="act-table">
          <thead>
            <tr><th>Store</th><th>Phone</th><th>Reason</th><th>Date</th></tr>
          </thead>
          <tbody>
            {stats.recentActivity.map((a, i) => (
              <tr key={i}>
                <td><span className="store-chip">{a.reportedBy?.name || 'Unknown'}</span></td>
                <td><span className="phone-danger">{a.phone?.slice(0,4)}XXXXXXX</span></td>
                <td>{a.reason}</td>
                <td>{new Date(a.createdAt).toLocaleDateString('en-PK')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="act-empty"><Shield size={36} /><p>No recent activity yet.</p></div>
      )}
    </div>
  </div>
);

export default StoreDashboard;
