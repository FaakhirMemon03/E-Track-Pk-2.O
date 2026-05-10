import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, ShieldCheck, Settings, MessageSquare, LogOut, 
  Shield, Bell, LayoutGrid, Activity, ChevronRight, UserCircle,
  TrendingUp, AlertCircle, CheckCircle, Package, ShieldAlert 
} from 'lucide-react';
import StoreManagement from '../components/admin/StoreManagement';
import BlacklistMonitor from '../components/admin/BlacklistMonitor';
import AdminProfile from '../components/admin/AdminProfile';
import Chat from '../components/Chat';

const adminNavItems = [
  { icon: <LayoutGrid size={20} />,   label: "Overview",         path: "/admin" },
  { icon: <Users size={20} />,        label: "Manage Stores",    path: "/admin/stores" },
  { icon: <ShieldCheck size={20} />,  label: "Fraud Monitor",    path: "/admin/monitor" },
  { icon: <MessageSquare size={20} />, label: "Support Desk",     path: "/admin/chats" },
  { icon: <Settings size={20} />,      label: "Admin Settings",   path: "/admin/settings" },
];

const AdminDashboard = () => {
  const [admin, setAdmin] = useState(JSON.parse(localStorage.getItem('admin')) || { email: 'Admin' });
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  const activeLabel = adminNavItems.find(item => item.path === location.pathname)?.label || 'Admin Control';

  return (
    <div className="flex h-screen w-full bg-[#020617] overflow-hidden text-slate-200 font-sans">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Sidebar */}
      <aside className="w-80 bg-slate-900/40 backdrop-blur-3xl border-r border-white/5 flex flex-col p-8 hidden lg:flex relative z-50">
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="w-12 h-12 bg-linear-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 ring-1 ring-white/20">
            <Shield size={26} fill="white" className="drop-shadow-lg" />
          </div>
          <div>
            <span className="text-xl font-black bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase tracking-tighter block leading-none">E-Track</span>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mt-1 block">Administrative</span>
          </div>
        </div>

        <nav className="flex-1 space-y-3">
          {adminNavItems.map((item, i) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/');
            return (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-[20px] text-sm font-bold transition-all duration-300 group relative ${
                  isActive 
                    ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/25 ring-1 ring-white/20' 
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-indigo-400'} transition-all duration-300`}>
                  {item.icon}
                </span>
                <span className="tracking-tight">{item.label}</span>
                {isActive && (
                  <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Admin Card */}
        <div className="mt-auto space-y-6">
          <div className="p-6 rounded-[28px] bg-white/5 border border-white/5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <UserCircle size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-white truncate">{admin.email?.split('@')[0]}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Master Admin</p>
              </div>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-xs font-black text-red-400 bg-red-500/10 border border-red-500/10 hover:bg-red-500 hover:text-white transition-all duration-300"
            >
              <LogOut size={14} /> <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="h-24 px-10 flex items-center justify-between bg-slate-950/20 backdrop-blur-md border-b border-white/5">
          <div className="flex items-center gap-6">
            <div className="h-8 w-[2px] bg-indigo-500/50 rounded-full hidden lg:block"></div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">{activeLabel}</h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-white tracking-tight leading-none mb-1 group-hover:text-indigo-400 transition-colors">System Online</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Global Status</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 group-hover:border-indigo-500/50 group-hover:text-white transition-all shadow-inner">
                <Bell size={20} />
                <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-[#020617] shadow-[0_0_10px_#6366f1]"></span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<AdminOverview />} />
              <Route path="stores" element={<StoreManagement />} />
              <Route path="monitor" element={<BlacklistMonitor />} />
              <Route path="chats" element={<ChatList onSelectStore={(id) => navigate(`/admin/chats/${id}`)} />} />
              <Route path="chats/:storeId" element={<Chat user={{ ...admin, currentChatStoreId: window.location.pathname.split('/').pop() }} role="admin" />} />
              <Route path="settings" element={<AdminProfile admin={admin} setAdmin={setAdmin} />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState({ totalStores: 0, pendingApprovals: 0, totalBlacklisted: 0, recentStores: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/stores', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const stores = await res.json();
        
        const resCust = await fetch('http://localhost:5000/api/admin/customers', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const customers = await resCust.json();

        setStats({
          totalStores: stores.length,
          pendingApprovals: stores.filter(s => s.status === 'pending_approval').length,
          totalBlacklisted: customers.length,
          recentStores: stores.slice(-5).reverse()
        });
      } catch (e) {}
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-12 animate-fade-up">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: "Total Network Stores", value: stats.totalStores, icon: <Users size={32} />, color: "indigo", sub: "Ecosystem Growth", trend: <TrendingUp size={14} /> },
          { label: "Pending Approvals", value: stats.pendingApprovals, icon: <Package size={32} />, color: "amber", sub: "Action Required", trend: <AlertCircle size={14} /> },
          { label: "Blacklisted Records", value: stats.totalBlacklisted, icon: <ShieldAlert size={32} />, color: "red", sub: "Fraud Prevention", trend: <ShieldCheck size={14} /> }
        ].map((stat, i) => (
          <div key={i} className={`glass p-10 rounded-[40px] border-white/5 relative overflow-hidden group hover:bg-white/10 transition-all duration-500 hover:-translate-y-1`}>
            <div className={`absolute top-0 right-0 w-40 h-40 bg-${stat.color}-500/10 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700`}></div>
            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-16 h-16 rounded-[24px] bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 mb-8 border border-${stat.color}-500/20 group-hover:bg-${stat.color}-500 group-hover:text-white transition-all duration-500 shadow-lg shadow-${stat.color}-500/10`}>
                {stat.icon}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-2">{stat.label}</span>
              <h3 className={`text-6xl font-black text-white mb-6 tracking-tighter ${stat.color === 'amber' ? 'text-amber-400' : stat.color === 'red' ? 'text-red-500' : ''}`}>
                {stat.value}
              </h3>
              <div className={`mt-auto flex items-center gap-2 text-${stat.color}-500/80 text-xs font-black uppercase tracking-widest`}>
                {stat.trend} {stat.sub}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Registrations */}
        <div className="lg:col-span-2 glass p-12 rounded-[48px] border-white/5 shadow-3xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-inner">
                <Activity size={28} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tighter">Recent Registrations</h3>
                <p className="text-slate-500 text-sm font-medium tracking-tight">New entities entering the shared database.</p>
              </div>
            </div>
            <Link to="/admin/stores" className="px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all shadow-sm">
              Manage All
            </Link>
          </div>

          <div className="space-y-4">
            {stats.recentStores.map((store, i) => (
              <div key={i} className="flex items-center justify-between p-6 bg-white/2 border border-white/5 rounded-[28px] hover:bg-white/5 transition-all group cursor-pointer">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 font-black text-lg group-hover:bg-indigo-500 group-hover:text-white transition-all border border-white/5 shadow-lg shadow-black/40">
                    {store.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-black text-white text-lg group-hover:text-indigo-400 transition-colors leading-tight">{store.name}</p>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{store.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-white uppercase tracking-widest">{store.plan === 'trial' ? 'Demo Trial' : store.plan}</p>
                    <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest mt-1">Joined {new Date(store.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className={`w-3 h-3 rounded-full ${store.status === 'active' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'} transition-all group-hover:scale-125`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health / Quick Info */}
        <div className="space-y-8">
          <div className="glass p-10 rounded-[40px] border-white/5 bg-linear-to-br from-white/5 to-transparent">
            <h4 className="text-lg font-black text-white mb-6 uppercase tracking-widest flex items-center gap-3">
              <ShieldCheck className="text-indigo-400" size={20} /> System Pulse
            </h4>
            <div className="space-y-6">
              {[
                { label: "Database Latency", val: "14ms", color: "emerald" },
                { label: "API Uptime", val: "99.98%", color: "indigo" },
                { label: "Fraud Detection", val: "Optimal", color: "purple" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{item.label}</span>
                  <span className={`text-xs font-black text-${item.color}-400 uppercase tracking-widest`}>{item.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass p-10 rounded-[40px] border-white/5 bg-linear-to-br from-indigo-500/10 to-transparent relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity size={100} />
            </div>
            <h4 className="text-lg font-black text-white mb-2 uppercase tracking-widest">Network News</h4>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              E-Track PK has successfully mitigated <span className="text-white font-black">2,400+</span> suspicious transactions this month. 
              The ecosystem is growing rapidly with new stores joining every 4 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ChatList = ({ onSelectStore }) => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/stores', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (Array.isArray(data)) setStores(data);
      } catch (e) {}
      setLoading(false);
    };
    fetchStores();
  }, []);

  return (
    <div className="max-w-5xl animate-fade-up">
      <div className="glass p-12 rounded-[56px] border-white/5 shadow-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -mr-64 -mt-64"></div>
        
        <div className="flex flex-wrap items-center justify-between gap-8 mb-12 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[24px] bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-2xl">
              <MessageSquare size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-black text-white tracking-tighter uppercase">Support Terminal</h3>
              <p className="text-slate-500 text-sm font-medium">Real-time communication with network participants.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Network Specialist Active</span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-32">
             <div className="w-14 h-14 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {stores.map(store => (
              <div 
                key={store._id} 
                onClick={() => onSelectStore(store._id)} 
                className="glass bg-white/2 hover:bg-white/5 p-8 rounded-[32px] border border-white/5 hover:border-indigo-500/40 transition-all duration-300 cursor-pointer group flex flex-col gap-6 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center text-indigo-400 text-xl font-black border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-xl">
                      {store.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <p className="font-black text-white text-lg group-hover:text-indigo-400 transition-colors leading-tight">{store.name}</p>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{store.email}</p>
                    </div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-lg shadow-current/30`}></div>
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                   <div className="flex -space-x-2">
                     {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-slate-900 bg-slate-800"></div>)}
                   </div>
                   <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2 group-hover:translate-x-2 transition-transform">
                     Open Terminal <ChevronRight size={14} />
                   </span>
                </div>
              </div>
            ))}
            {stores.length === 0 && (
              <div className="col-span-full p-32 text-center space-y-6">
                <Activity size={80} className="mx-auto text-white/5" />
                <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-xs">No stores registered in system</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
