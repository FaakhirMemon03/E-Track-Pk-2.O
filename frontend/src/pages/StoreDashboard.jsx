import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Search, ShieldAlert, CreditCard, 
  MessageSquare, User, LogOut, TrendingUp, Activity, 
  Shield, Bell, ChevronRight, Clock, ExternalLink, Menu, X
} from 'lucide-react';
import CustomerLookup from '../components/CustomerLookup';
import BlacklistReport from '../components/BlacklistReport';
import Subscription from '../components/Subscription';
import OrderStatus from '../components/OrderStatus';
import Chat from '../components/Chat';
import Profile from '../components/Profile';

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard',      path: '/dashboard' },
  { icon: <Search size={20} />,          label: 'Risk Lookup',    path: '/dashboard/lookup' },
  { icon: <ShieldAlert size={20} />,     label: 'Report Fraud',   path: '/dashboard/report' },
  { icon: <Clock size={20} />,          label: 'Order Status',   path: '/dashboard/orders' },
  { icon: <CreditCard size={20} />,      label: 'Subscription',   path: '/dashboard/subscription' },
  { icon: <MessageSquare size={20} />,   label: 'Live Support',   path: '/dashboard/support' },
  { icon: <User size={20} />,            label: 'Profile',        path: '/dashboard/profile' },
];

const StoreDashboard = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [stats, setStats] = useState({ totalSearches: 0, blacklistedByYou: 0, systemWideReports: 0, recentActivity: [] });
  const [timeLeft, setTimeLeft] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
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
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-200">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900/80 backdrop-blur-2xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
              <Shield size={22} fill="white" />
            </div>
            <span className="text-xl font-black bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">E-Track PK</span>
          </div>

          <nav className="flex-1 space-y-2">
            {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                >
                  <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-white/5 mt-auto space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white font-black overflow-hidden flex-shrink-0">
                {avatarSrc ? <img src={avatarSrc} alt="avatar" className="w-full h-full object-cover" /> : user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user.plan} PLAN</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/15 transition-all">
              <LogOut size={18} /> <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 px-8 flex items-center justify-between bg-slate-950/50 backdrop-blur-md border-b border-white/5 z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-black text-white tracking-tight animate-fade-in">{activeLabel}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1 leading-none mb-1">
                <Clock size={10} /> Plan Expires
              </span>
              <span className="text-sm font-black text-white font-mono leading-none">{timeLeft}</span>
            </div>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Routes>
            <Route path="/"            element={<Overview stats={stats} user={user} />} />
            <Route path="lookup"       element={<CustomerLookup />} />
            <Route path="report"       element={<BlacklistReport />} />
            <Route path="orders"       element={<OrderStatus />} />
            <Route path="subscription" element={<Subscription />} />
            <Route path="support"      element={<Chat user={user} role="store" />} />
            <Route path="profile"      element={<Profile user={user} setUser={setUser} />} />
          </Routes>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-45 lg:hidden animate-fade-in"></div>
      )}
    </div>
  );
};

const Overview = ({ stats, user }) => (
  <div className="max-w-6xl animate-fade-up space-y-10">
    <div>
      <h2 className="text-4xl font-black mb-2 bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent">Welcome back, {user.name}</h2>
      <p className="text-slate-400">Here's what's happening with your store protection today.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:border-indigo-500/30 transition-all">
        <div className="relative z-10">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Total Lookups</span>
          <h3 className="text-5xl font-black text-white mb-2">{stats.totalSearches}</h3>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
            <TrendingUp size={14} /> +12% from last week
          </div>
        </div>
        <Search size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-indigo-500/10 transition-colors" />
      </div>

      <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:border-red-500/30 transition-all">
        <div className="relative z-10">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Personal Blacklist</span>
          <h3 className="text-5xl font-black text-white mb-2">{stats.blacklistedByYou}</h3>
          <p className="text-red-400 text-xs font-bold">Risk reduction active</p>
        </div>
        <ShieldAlert size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-red-500/10 transition-colors" />
      </div>

      <div className="glass p-8 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
        <div className="relative z-10">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-4">Network Intel</span>
          <h3 className="text-5xl font-black text-white mb-2">{stats.systemWideReports}</h3>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
            <Activity size={14} /> Shared ecosystem active
          </div>
        </div>
        <Activity size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-emerald-500/10 transition-colors" />
      </div>
    </div>

    <div className="glass-heavy rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
      <div className="p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <Activity size={20} />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">Recent Network Activity</span>
        </div>
        <Link to="/dashboard/lookup" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/5 text-xs font-bold text-slate-400 hover:text-white transition-all">
          Verify Customer <ChevronRight size={14} />
        </Link>
      </div>
      
      {stats.recentActivity?.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/2">
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Origin Store</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Target Phone</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">Reason</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {stats.recentActivity.map((a, i) => (
                <tr key={i} className="hover:bg-white/2 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-[10px] font-black border border-indigo-500/10">
                        {a.reportedBy?.name?.charAt(0) || 'U'}
                      </div>
                      <span className="text-sm font-bold text-white">{a.reportedBy?.name || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-mono text-sm tracking-widest text-slate-300 bg-white/5 px-2 py-1 rounded-md">{a.phone?.slice(0,4)}XXXXXXX</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-tighter">
                      {a.reason}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="text-xs font-bold text-slate-500">
                      {new Date(a.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-20 text-center space-y-4">
          <Shield size={64} className="mx-auto text-white/5" />
          <div className="space-y-1">
            <p className="text-lg font-bold text-white">No threats detected</p>
            <p className="text-sm text-slate-500 max-w-xs mx-auto">Your store and the shared network are currently clean under our protection.</p>
          </div>
        </div>
      )}
    </div>

    <div className="glass p-10 rounded-[32px] flex flex-wrap items-center justify-between gap-8 border border-indigo-500/10">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white tracking-tight">Need deeper protection?</h3>
        <p className="text-slate-400 text-sm max-w-md">Upgrade your plan to unlock automated API integration, bulk search, and real-time fraud alerts.</p>
      </div>
      <Link to="/dashboard/subscription" className="btn-primary px-8">
        Upgrade Now <ExternalLink size={18} />
      </Link>
    </div>
  </div>
);

export default StoreDashboard;
