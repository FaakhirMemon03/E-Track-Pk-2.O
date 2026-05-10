import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Search, ShieldAlert, CreditCard, 
  MessageSquare, User, LogOut, TrendingUp, Activity, 
  Shield, Bell, ChevronRight, Clock, ExternalLink
} from 'lucide-react';
import CustomerLookup from '../components/CustomerLookup';
import BlacklistReport from '../components/BlacklistReport';
import Subscription from '../components/Subscription';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard',      path: '/dashboard' },
  { icon: <Search size={20} />,          label: 'Risk Lookup',    path: '/dashboard/lookup' },
  { icon: <ShieldAlert size={20} />,     label: 'Report Fraud',   path: '/dashboard/report' },
  { icon: <CreditCard size={20} />,      label: 'Subscription',   path: '/dashboard/subscription' },
  { icon: <MessageSquare size={20} />,   label: 'Live Support',   path: '/dashboard/support' },
  { icon: <User size={20} />,            label: 'Profile',        path: '/dashboard/profile' },
];

const StoreDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [stats, setStats] = useState({ totalSearches: 0, blacklistedByYou: 0, systemWideReports: 0, recentActivity: [] });
  const [timeLeft, setTimeLeft] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const timer = setInterval(() => {
      const diff = new Date(user.planExpiresAt) - new Date();
      if (diff <= 0) { 
        clearInterval(timer); 
        handleLogout(); 
        return; 
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${d}d ${h}h ${m}m ${s}s`);
    }, 1000);

    fetch('http://localhost:5000/api/store/stats', {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(d => { if (d && !d.error) setStats(d); })
    .catch(() => {});

    return () => clearInterval(timer);
  }, [user.planExpiresAt]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const activeLabel = navItems.find(item => item.path === location.pathname)?.label || 'Dashboard';
  const avatarSrc = user.profilePic ? `http://localhost:5000${user.profilePic}` : null;

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo-container">
          <div className="logo-icon">
            <Shield size={22} fill="white" />
          </div>
          <span className="logo-text">E-Track PK</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-compact">
            <div className="compact-avatar">
              {avatarSrc ? <img src={avatarSrc} alt="avatar" /> : user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="compact-info">
              <p className="compact-name">{user.name}</p>
              <p className="compact-role">{user.plan} Store</p>
            </div>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-wrapper">
        <header className="top-bar">
          <div className="page-info">
            <h1 className="animate-fade">{activeLabel}</h1>
          </div>

          <div className="top-bar-actions">
            <div className="session-timer glass">
              <span className="timer-lbl"><Clock size={10} style={{marginRight: 4}} /> Plan Expires</span>
              <span className="timer-val">{timeLeft}</span>
            </div>
            <button className="btn-outline" style={{padding: '10px', borderRadius: '12px'}}>
              <Bell size={20} />
            </button>
          </div>
        </header>

        <main className="content-scroll">
          <Routes>
            <Route path="/"            element={<Overview stats={stats} user={user} />} />
            <Route path="lookup"       element={<CustomerLookup />} />
            <Route path="report"       element={<BlacklistReport />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="support"      element={<Chat user={user} role="store" />} />
            <Route path="profile"      element={<Profile user={user} setUser={setUser} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Overview = ({ stats, user }) => (
  <div className="animate-fade">
    <div className="section-card-header">
      <h2 className="gradient-text">Welcome back, {user.name}</h2>
      <p>Here's what's happening with your store protection today.</p>
    </div>

    <div className="stats-grid">
      <div className="stat-card glass">
        <div className="stat-card-info">
          <span className="stat-card-lbl">Total Lookups</span>
          <h3 className="stat-card-val">{stats.totalSearches}</h3>
        </div>
        <div className="stat-card-icon">
          <Search size={24} />
        </div>
      </div>

      <div className="stat-card glass danger">
        <div className="stat-card-info">
          <span className="stat-card-lbl">Personal Blacklist</span>
          <h3 className="stat-card-val">{stats.blacklistedByYou}</h3>
        </div>
        <div className="stat-card-icon">
          <ShieldAlert size={24} />
        </div>
      </div>

      <div className="stat-card glass success">
        <div className="stat-card-info">
          <span className="stat-card-lbl">Network Intelligence</span>
          <h3 className="stat-card-val">{stats.systemWideReports}</h3>
        </div>
        <div className="stat-card-icon">
          <Activity size={24} />
        </div>
      </div>
    </div>

    <div className="data-box glass-heavy">
      <div className="data-box-header">
        <div className="data-box-title">
          <Activity size={20} className="icon-primary" />
          <span>Recent Network Activity</span>
        </div>
        <Link to="/dashboard/lookup" className="badge" style={{textDecoration: 'none'}}>
          Verify Customer <ChevronRight size={14} />
        </Link>
      </div>
      
      {stats.recentActivity?.length > 0 ? (
        <div style={{overflowX: 'auto'}}>
          <table className="premium-table">
            <thead>
              <tr>
                <th>Origin Store</th>
                <th>Target Phone</th>
                <th>Reason for Report</th>
                <th>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentActivity.map((a, i) => (
                <tr key={i}>
                  <td>
                    <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                      <div className="compact-avatar" style={{width: 28, height: 28, fontSize: '0.7rem'}}>
                        {a.reportedBy?.name?.charAt(0) || 'U'}
                      </div>
                      <span style={{fontWeight: 600}}>{a.reportedBy?.name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td>
                    <span className="phone-mask">{a.phone?.slice(0,4)}XXXXXXX</span>
                  </td>
                  <td>
                    <span className="status-chip reported">{a.reason}</span>
                  </td>
                  <td>
                    <span style={{color: 'var(--text-dim)', fontSize: '0.85rem'}}>
                      {new Date(a.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="act-empty">
          <Shield size={48} style={{opacity: 0.2, marginBottom: 16}} />
          <p>No suspicious activity detected in the network recently.</p>
          <p style={{fontSize: '0.85rem', color: 'var(--text-dim)'}}>Your store is currently safe under our protection.</p>
        </div>
      )}
    </div>

    <div className="section-card glass" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '30px 40px'}}>
      <div>
        <h3 style={{fontSize: '1.2rem', marginBottom: 4}}>Need deeper protection?</h3>
        <p style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>Upgrade your plan to unlock automated API integration and real-time alerts.</p>
      </div>
      <Link to="/dashboard/subscription" className="btn-primary">
        View Plans <ExternalLink size={18} />
      </Link>
    </div>
  </div>
);

export default StoreDashboard;

