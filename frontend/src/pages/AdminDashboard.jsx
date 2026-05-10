import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, ShieldCheck, Settings, MessageSquare, LogOut, 
  Shield, Bell, LayoutGrid, Activity, ChevronRight, UserCircle,
  TrendingUp, AlertCircle, CheckCircle, Package
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
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden text-slate-200">
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900/80 backdrop-blur-2xl border-r border-white/5 flex flex-col p-6 hidden lg:flex">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Shield size={22} fill="white" />
          </div>
          <span className="text-xl font-black bg-linear-to-r from-white to-slate-400 bg-clip-text text-transparent uppercase tracking-tight">E-Track Admin</span>
        </div>

        <nav className="flex-1 space-y-2">
          {adminNavItems.map((item, i) => {
            const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/');
            return (
              <Link
                key={i}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform`}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-white/5 mt-auto">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 bg-red-500/5 border border-red-500/10 hover:bg-red-500/15 transition-all">
            <LogOut size={18} /> <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 px-8 flex items-center justify-between bg-slate-950/50 backdrop-blur-md border-b border-white/5 z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-white tracking-tight animate-fade-in uppercase tracking-widest">{activeLabel}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/5 rounded-xl">
              <UserCircle size={18} className="text-indigo-400" />
              <span className="text-xs font-bold text-white tracking-tight">{admin.email}</span>
            </div>
            <button className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-slate-400 hover:text-white transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-slate-950"></span>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <Routes>
            <Route path="/" element={<AdminOverview />} />
            <Route path="/stores" element={<StoreManagement />} />
            <Route path="/monitor" element={<BlacklistMonitor />} />
            <Route path="/chats" element={<ChatList onSelectStore={(id) => navigate(`chats/${id}`)} />} />
            <Route path="/chats/:storeId" element={<Chat user={{ ...admin, currentChatStoreId: window.location.pathname.split('/').pop() }} role="admin" />} />
            <Route path="/settings" element={<AdminProfile admin={admin} setAdmin={setAdmin} />} />
          </Routes>
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
          recentStores: stores.slice(-4).reverse()
        });
      } catch (e) {}
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-6xl space-y-10 animate-fade-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Total Network Stores</span>
            <h3 className="text-5xl font-black text-white mb-2">{stats.totalStores}</h3>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold">
              <TrendingUp size={14} /> Ecosystem Growth
            </div>
          </div>
          <Users size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-indigo-500/10 transition-colors" />
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group border-amber-500/20">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Pending Approvals</span>
            <h3 className="text-5xl font-black text-amber-400 mb-2">{stats.pendingApprovals}</h3>
            <div className="flex items-center gap-2 text-amber-500/80 text-xs font-bold">
              <AlertCircle size={14} /> Activation Required
            </div>
          </div>
          <Package size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-amber-500/10 transition-colors" />
        </div>

        <div className="glass p-8 rounded-[32px] border-white/5 relative overflow-hidden group border-red-500/20">
          <div className="relative z-10">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-4">Blacklisted Records</span>
            <h3 className="text-5xl font-black text-red-500 mb-2">{stats.totalBlacklisted}</h3>
            <div className="flex items-center gap-2 text-red-400 text-xs font-bold">
              <ShieldCheck size={14} /> Security Active
            </div>
          </div>
          <ShieldAlert size={80} className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-red-500/10 transition-colors" />
        </div>
      </div>

      <div className="glass p-10 rounded-[40px] border-white/5 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Recent Registrations</h3>
              <p className="text-slate-400 text-sm">New stores joining the E-Track PK ecosystem.</p>
            </div>
          </div>
          <Link to="/admin/stores" className="text-xs font-black text-indigo-400 uppercase tracking-widest hover:text-white transition-colors">
            View All Stores
          </Link>
        </div>

        <div className="space-y-4">
          {stats.recentStores.map((store, i) => (
            <div key={i} className="flex items-center justify-between p-6 bg-white/2 border border-white/5 rounded-2xl hover:bg-white/5 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-black group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  {store.name?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{store.name}</p>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">{store.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs font-black text-white uppercase tracking-widest">{store.plan}</p>
                  <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest mt-0.5">Joined {new Date(store.createdAt).toLocaleDateString()}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${store.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500'} shadow-lg shadow-current/20`}></div>
              </div>
            </div>
          ))}
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
    <div className="max-w-4xl animate-fade-up">
      <div className="glass p-10 rounded-[40px] border-white/5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl rounded-full -mr-40 -mt-40"></div>
        
        <div className="flex items-center gap-4 mb-10 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <MessageSquare size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight">Active Conversations</h3>
            <p className="text-slate-400 text-sm">Select a store to provide real-time support.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-20">
             <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4 relative z-10">
            {stores.map(store => (
              <div 
                key={store._id} 
                onClick={() => onSelectStore(store._id)} 
                className="glass bg-white/2 hover:bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer group flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 text-sm font-black border border-white/5 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    {store.name?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-bold text-white group-hover:text-indigo-400 transition-colors">{store.name}</p>
                    <p className="text-xs text-slate-500 font-medium tracking-tight uppercase">{store.email}</p>
                  </div>
                </div>
                <button className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-black uppercase tracking-widest border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  Open Chat <ChevronRight size={14} />
                </button>
              </div>
            ))}
            {stores.length === 0 && (
              <div className="p-20 text-center space-y-4">
                <Activity size={64} className="mx-auto text-white/5" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No stores registered yet</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
