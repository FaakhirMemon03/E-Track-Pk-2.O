import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Search, ShieldAlert, CreditCard,
  MessageSquare, User, LogOut, TrendingUp, Activity, Shield
} from 'lucide-react';
import CustomerLookup from '../components/CustomerLookup';
import BlacklistReport from '../components/BlacklistReport';
import Subscription from '../components/Subscription';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

const navItems = [
  { icon: <LayoutDashboard size={18} />, label: 'Overview', path: '/dashboard' },
  { icon: <Search size={18} />, label: 'Customer Lookup', path: '/dashboard/lookup' },
  { icon: <ShieldAlert size={18} />, label: 'Blacklist Report', path: '/dashboard/report' },
  { icon: <CreditCard size={18} />, label: 'Subscription', path: '/dashboard/subscription' },
  { icon: <MessageSquare size={18} />, label: 'Live Support', path: '/dashboard/support' },
  { icon: <User size={18} />, label: 'Profile', path: '/dashboard/profile' },
];

const StoreDashboard = () => {
  const [user] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [stats, setStats] = useState({ totalSearches: 0, blacklistedByYou: 0, systemWideReports: 0, recentActivity: [] });
  const [timeLeft, setTimeLeft] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="db-shell">
      {/* ── Sidebar ── */}
      <aside className="db-sidebar">
        {/* User Card */}
        <div className="db-user-card">
          <div className="db-avatar">
            {avatarSrc
              ? <img src={avatarSrc} alt="avatar" />
              : <span>{user.name?.charAt(0).toUpperCase()}</span>}
          </div>
          <div className="db-user-info">
            <p className="db-user-name">{user.name}</p>
            <p className="db-user-email">{user.email}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="db-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`db-nav-item ${location.pathname === item.path ? 'db-nav-active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <button onClick={handleLogout} className="db-logout">
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* ── Main ── */}
      <main className="db-main">
        {/* Top Bar */}
        <div className="db-topbar">
          <div>
            <h2 className="db-topbar-title">
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </h2>
            <p className="db-topbar-sub">E-Track PK Platform</p>
          </div>
          <div className="db-plan-info">
            <span className="db-plan-badge">{user.plan?.toUpperCase()} PLAN</span>
            <span className="db-timer">{timeLeft}</span>
          </div>
        </div>

        {/* Page Content */}
        <div className="db-content">
          <Routes>
            <Route path="/" element={<Overview stats={stats} />} />
            <Route path="lookup" element={<CustomerLookup />} />
            <Route path="report" element={<BlacklistReport />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="support" element={<Chat user={user} role="store" />} />
            <Route path="profile" element={<Profile user={user} setUser={() => {}} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

/* ── Overview Page ── */
const Overview = ({ stats }) => (
  <div className="animate-fade">
    {/* Stat Cards */}
    <div className="db-cards">
      <div className="db-card db-card-blue">
        <div className="db-card-icon"><TrendingUp size={22} /></div>
        <div>
          <p className="db-card-label">Total Searches</p>
          <h3 className="db-card-value">{stats.totalSearches}</h3>
        </div>
      </div>
      <div className="db-card db-card-red">
        <div className="db-card-icon"><ShieldAlert size={22} /></div>
        <div>
          <p className="db-card-label">Blacklisted by You</p>
          <h3 className="db-card-value">{stats.blacklistedByYou}</h3>
        </div>
      </div>
      <div className="db-card db-card-green">
        <div className="db-card-icon"><Shield size={22} /></div>
        <div>
          <p className="db-card-label">Network Reports</p>
          <h3 className="db-card-value">{stats.systemWideReports}</h3>
        </div>
      </div>
    </div>

    {/* Recent Activity Table */}
    <div className="db-section">
      <div className="db-section-head">
        <Activity size={18} />
        <h3>Recent Platform Activity</h3>
      </div>

      {stats.recentActivity?.length > 0 ? (
        <table className="db-table">
          <thead>
            <tr>
              <th>Store</th>
              <th>Phone</th>
              <th>Reason</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentActivity.map((act, i) => (
              <tr key={i}>
                <td><span className="db-store-tag">{act.reportedBy?.name || 'Unknown'}</span></td>
                <td><span className="db-phone">{act.phone?.slice(0, 4)}XXXXXXX</span></td>
                <td>{act.reason}</td>
                <td>{new Date(act.createdAt).toLocaleDateString('en-PK')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="db-empty">
          <Shield size={40} />
          <p>No recent platform activity yet.</p>
        </div>
      )}
    </div>
  </div>
);

export default StoreDashboard;
