import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, XCircle, Clock, Truck, Plus, Search, Filter } from 'lucide-react';

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customerPhone: '',
    customerEmail: '',
    orderId: '',
    status: 'Delivered',
    amount: ''
  });
  const [msg, setMsg] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/store/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/store/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.message) {
        setMsg(data.message);
        setShowForm(false);
        setFormData({ customerPhone: '', customerEmail: '', orderId: '', status: 'Delivered', amount: '' });
        fetchOrders();
      }
    } catch (e) {
      setMsg('Error logging order status');
    }
  };

  return (
    <div className="max-w-6xl animate-fade-up space-y-8 pb-20">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Delivery Intelligence</h2>
          <p className="text-slate-400 font-medium">Track and log successful deliveries to build network trust.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? <Clock size={18} /> : <Plus size={18} />}
          {showForm ? 'View History' : 'Log New Delivery'}
        </button>
      </div>

      {showForm ? (
        <div className="glass p-10 rounded-[40px] border-white/5 shadow-2xl relative overflow-hidden animate-fade-up">
           <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/5 blur-3xl rounded-full -mr-40 -mt-40"></div>
           
           <form onSubmit={handleSubmit} className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Customer Phone</label>
                <input 
                  type="text" required placeholder="03XXXXXXXXX"
                  className="input-field"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData({...formData, customerPhone: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Customer Email</label>
                <input 
                  type="email" required placeholder="customer@email.com"
                  className="input-field"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({...formData, customerEmail: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Order ID</label>
                <input 
                  type="text" required placeholder="ORD-12345"
                  className="input-field"
                  value={formData.orderId}
                  onChange={(e) => setFormData({...formData, orderId: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Delivery Status</label>
                <select 
                  className="input-field appearance-none cursor-pointer"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="Delivered">Delivered</option>
                  <option value="Returned">Returned</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Order Amount (PKR)</label>
                <input 
                  type="number" placeholder="2500"
                  className="input-field"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                />
              </div>
              <div className="md:col-span-2 pt-4">
                <button type="submit" className="btn-primary w-full py-4 text-lg">
                  Submit Delivery Record
                </button>
              </div>
           </form>
        </div>
      ) : (
        <div className="glass-heavy rounded-[40px] overflow-hidden border-white/5 shadow-3xl">
          <div className="p-8 border-b border-white/5 flex flex-wrap items-center justify-between gap-4 bg-white/2">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Truck size={24} />
              </div>
              <h3 className="text-xl font-black text-white tracking-tight">Recent Deliveries</h3>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
              <Search size={14} className="text-slate-500" />
              <input type="text" placeholder="Search orders..." className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-40" />
            </div>
          </div>

          {loading ? (
            <div className="p-32 flex justify-center">
              <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/20">
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">Order ID</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">Customer</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">Status</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5">Amount</th>
                    <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-white/5 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {orders.map((order, i) => (
                    <tr key={i} className="hover:bg-white/2 transition-colors group">
                      <td className="px-8 py-6 font-mono text-xs font-bold text-indigo-400">{order.orderId}</td>
                      <td className="px-8 py-6">
                        <div>
                          <p className="text-sm font-black text-white leading-tight">{order.customerPhone}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                          order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          order.status === 'Returned' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          order.status === 'Cancelled' ? 'bg-slate-500/10 text-slate-400 border-slate-500/20' :
                          'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {order.status === 'Delivered' && <CheckCircle size={10} />}
                          {order.status === 'Returned' && <XCircle size={10} />}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-white text-sm">Rs. {order.amount?.toLocaleString()}</td>
                      <td className="px-8 py-6 text-right">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          {new Date(order.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-32 text-center space-y-6">
              <Package size={80} className="mx-auto text-white/5" />
              <div className="space-y-2">
                <p className="text-lg font-black text-white">No delivery records found</p>
                <p className="text-sm text-slate-500 max-w-xs mx-auto font-medium">Start logging your deliveries to contribute to the network intelligence.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {msg && (
        <div className="fixed bottom-10 right-10 glass p-6 rounded-3xl border-indigo-500/50 shadow-2xl animate-fade-in flex items-center gap-4 z-50">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
            <CheckCircle size={20} />
          </div>
          <p className="text-sm font-black text-white pr-4 uppercase tracking-tight">{msg}</p>
          <button onClick={() => setMsg('')} className="text-slate-500 hover:text-white transition-colors">
            <XCircle size={20} />
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderStatus;
