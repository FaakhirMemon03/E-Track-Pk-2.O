import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, UserPlus, FileSpreadsheet, Search, Filter, Mail, Phone, MapPin, MoreVertical, Trash2, Upload, CheckCircle, ShieldAlert } from 'lucide-react';

const MyCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedForReport, setSelectedForReport] = useState(null);
  const [reportReason, setReportReason] = useState('');
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', email: '', address: '', notes: '', category: 'Regular' });
  const [bulkFile, setBulkFile] = useState(null);
  const [status, setStatus] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/my-customers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setCustomers(data);
    } catch (e) {}
    setLoading(false);
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Are you sure you want to remove this customer from your database?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/store/my-customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCustomers();
    } catch (e) {}
  };

  const handleReportToNetwork = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/store/report', {
        phone: selectedForReport.phone,
        email: selectedForReport.email || 'N/A',
        address: selectedForReport.address || 'N/A',
        reason: reportReason
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 201) {
        alert('Customer successfully reported to the global network!');
        setShowReportModal(false);
        setReportReason('');
      }
      alert(e.response?.data?.error || 'Failed to report customer');
    }
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/store/my-customers', newCustomer, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 201) {
        fetchCustomers();
        setShowAddModal(false);
        setNewCustomer({ name: '', phone: '', email: '', address: '', notes: '', category: 'Regular' });
      }
    } catch (e) {}
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/store/my-customers/bulk', formData, {
        headers: { 
          'Authorization': `Bearer ${token}`
          // Note: DO NOT set 'Content-Type': 'multipart/form-data' manually. 
          // Axios/Browser will set it with the correct boundary.
        }
      });
      
      if (res.status === 201) {
        fetchCustomers();
        setShowBulkModal(false);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Import failed. Check file format.';
      alert(errorMsg);
    }
    setLoading(false);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Customer Management</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Your Private Database</p>
        </div>
        <div className="flex flex-wrap gap-4">
          <button 
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 text-xs font-black text-indigo-400 uppercase tracking-widest hover:bg-white/10 transition-all shadow-xl"
          >
            <FileSpreadsheet size={16} /> Bulk Import
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-500 text-white text-xs font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20"
          >
            <UserPlus size={16} /> Add Customer
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-[32px] border-white/5 flex flex-col md:flex-row gap-6 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="input-field pl-12 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 border border-white/5 text-slate-400 text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-white/10 transition-all">
          <Filter size={16} /> All Categories
        </div>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="glass p-20 text-center rounded-[40px] border-white/5">
            <Users size={48} className="mx-auto text-slate-700 mb-6" />
            <h3 className="text-xl font-bold text-white mb-2">No Customers Found</h3>
            <p className="text-slate-500">Start building your database by adding your first customer.</p>
          </div>
        ) : (
          filteredCustomers.map(customer => (
            <div key={customer._id} className="glass p-6 rounded-[32px] border-white/5 hover:border-indigo-500/30 transition-all group flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5 w-full md:w-auto">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-xl border border-indigo-500/20 shadow-lg group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-black text-white">{customer.name}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-2">
                    <Phone size={10} /> {customer.phone}
                  </p>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 flex-1 justify-center md:justify-start">
                {customer.email && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400 font-bold">
                    <Mail size={12} className="text-indigo-400" /> {customer.email}
                  </div>
                )}
                {customer.address && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400 font-bold truncate max-w-[200px]">
                    <MapPin size={12} className="text-emerald-400" /> {customer.address}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <button 
                  onClick={() => { setSelectedForReport(customer); setShowReportModal(true); }}
                  className="px-4 py-2 rounded-xl bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                >
                  Report Fraud
                </button>
                <div className="px-4 py-2 rounded-xl bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest border border-indigo-500/20">
                  {customer.category}
                </div>
                <button 
                  onClick={() => deleteCustomer(customer._id)}
                  className="p-3 rounded-xl bg-white/5 border border-white/5 text-slate-500 hover:text-white hover:bg-red-500 transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
          <div className="glass p-10 rounded-[40px] w-full max-w-lg border-red-500/20 animate-fade-up">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20">
                <ShieldAlert size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black text-white">Report to Shared Network</h3>
                <p className="text-xs text-slate-500">Flagging {selectedForReport?.name}</p>
              </div>
            </div>
            
            <form onSubmit={handleReportToNetwork} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Reason for Blacklist</label>
                <textarea 
                  placeholder="e.g. Returned parcel after 3 attempts..." 
                  className="input-field min-h-[120px] py-4"
                  required
                  value={reportReason}
                  onChange={e => setReportReason(e.target.value)}
                ></textarea>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setShowReportModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all">Report & Blacklist</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="glass p-10 rounded-[40px] w-full max-w-lg border-white/5 animate-fade-up">
            <h3 className="text-2xl font-black text-white mb-8">Add New Customer</h3>
            <form onSubmit={handleAddCustomer} className="space-y-6">
              <input 
                type="text" 
                placeholder="Full Name" 
                className="input-field" 
                required 
                value={newCustomer.name} 
                onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} 
              />
              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Phone" 
                  className="input-field" 
                  required 
                  value={newCustomer.phone} 
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} 
                />
                <input 
                  type="email" 
                  placeholder="Email (Optional)" 
                  className="input-field" 
                  value={newCustomer.email} 
                  onChange={e => setNewCustomer({...newCustomer, email: e.target.value})} 
                />
              </div>
              <input 
                type="text" 
                placeholder="Address" 
                className="input-field" 
                value={newCustomer.address} 
                onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} 
              />
              <textarea 
                placeholder="Notes..." 
                className="input-field min-h-[100px] py-4"
                value={newCustomer.notes} 
                onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})} 
              ></textarea>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 rounded-2xl bg-indigo-500 text-white font-black shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all">Save Customer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div className="glass p-10 rounded-[40px] w-full max-w-lg border-white/5 animate-fade-up text-center">
            <FileSpreadsheet size={48} className="mx-auto text-indigo-400 mb-6" />
            <h3 className="text-2xl font-black text-white mb-2">Bulk Customer Import</h3>
            <p className="text-slate-500 text-sm mb-10">Upload an Excel or CSV file to import your entire customer list at once.</p>
            
            <div className="space-y-6">
              <label className="block p-10 border-2 border-dashed border-white/10 rounded-[32px] bg-white/2 hover:border-indigo-500/50 transition-all cursor-pointer">
                <input type="file" className="hidden" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
                {loading ? (
                   <div className="flex flex-col items-center gap-4">
                     <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                     <p className="text-xs font-black text-indigo-400 uppercase tracking-widest">Processing Data...</p>
                   </div>
                ) : (
                  <>
                    <Upload size={32} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-xs font-bold text-slate-400">Click to select Excel file</p>
                  </>
                )}
              </label>

              <button onClick={() => setShowBulkModal(false)} className="w-full py-4 rounded-2xl bg-white/5 text-slate-400 font-bold hover:bg-white/10 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCustomers;
