import React, { useState } from 'react';
import { ShieldAlert, CheckCircle, Phone, Mail, MapPin, MessageSquare, AlertTriangle, FileSpreadsheet, Upload, Download } from 'lucide-react';

const BlacklistReport = () => {
  const [activeTab, setActiveTab] = useState('single');
  const [formData, setFormData] = useState({ phone: '', email: '', address: '', reason: '' });
  const [bulkFile, setBulkFile] = useState(null);
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ text: '', type: '' });
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: 'Customer successfully blacklisted. Thank you for protecting the community!', type: 'success' });
        setFormData({ phone: '', email: '', address: '', reason: '' });
      } else {
        setMsg({ text: data.error || 'Failed to report customer', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Error connecting to server. Please try again.', type: 'error' });
    }
    setLoading(false);
  };

  const handleBulkSubmit = async (e) => {
    e.preventDefault();
    if (!bulkFile) return setMsg({ text: 'Please select a file first', type: 'error' });
    
    setMsg({ text: '', type: '' });
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', bulkFile);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/store/bulk-report', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: data.message, type: 'success' });
        setBulkFile(null);
      } else {
        setMsg({ text: data.error || 'Bulk upload failed', type: 'error' });
      }
    } catch (err) {
      setMsg({ text: 'Error uploading file.', type: 'error' });
    }
    setLoading(false);
  };

  const reasons = [
    'Refused Delivery',
    'Fake Order / Address',
    'Payment Reversal',
    'Abusive Behavior',
    'Multiple Cancellations',
    'Other'
  ];

  return (
    <div className="max-w-4xl mx-auto animate-fade-up space-y-8">
      {/* Tab Switcher */}
      <div className="flex p-1.5 bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-[24px] w-fit mx-auto lg:mx-0">
        <button 
          onClick={() => setActiveTab('single')}
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'single' ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'text-slate-500 hover:text-white'}`}
        >
          Single Report
        </button>
        <button 
          onClick={() => setActiveTab('bulk')}
          className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'bulk' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
        >
          Bulk Upload (Excel)
        </button>
      </div>

      <div className="glass p-10 lg:p-12 rounded-[40px] border-white/5 relative overflow-hidden shadow-2xl">
        <div className={`absolute top-0 right-0 w-80 h-80 ${activeTab === 'single' ? 'bg-red-500/5' : 'bg-indigo-500/5'} blur-3xl rounded-full -mr-40 -mt-40 transition-colors duration-500`}></div>
        
        <div className="flex items-center gap-5 mb-10 relative z-10">
          <div className={`w-14 h-14 rounded-2xl ${activeTab === 'single' ? 'bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-500/5'} flex items-center justify-center border shadow-lg transition-all duration-500`}>
            {activeTab === 'single' ? <ShieldAlert size={28} /> : <FileSpreadsheet size={28} />}
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight leading-tight">
              {activeTab === 'single' ? 'Blacklist a Customer' : 'Bulk Data Import'}
            </h3>
            <p className="text-slate-400 text-sm">
              {activeTab === 'single' ? 'Contribute by flagging individual fraudulent activity.' : 'Upload an Excel or CSV file to update your database in bulk.'}
            </p>
          </div>
        </div>

        {msg.text && (
          <div className={`p-6 rounded-2xl mb-10 flex items-start gap-4 text-sm font-medium animate-fade-in ${msg.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
            {msg.type === 'success' ? <CheckCircle className="mt-0.5 flex-shrink-0" size={18} /> : <AlertTriangle className="mt-0.5 flex-shrink-0" size={18} />}
            {msg.text}
          </div>
        )}

        {activeTab === 'single' ? (
          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Phone size={12} /> Phone Number *
                </label>
                <input
                  type="text"
                  placeholder="03001234567"
                  className="input-field"
                  value={formData.phone}
                  required
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Mail size={12} /> Email Address *
                </label>
                <input
                  type="email"
                  placeholder="customer@email.com"
                  className="input-field"
                  value={formData.email}
                  required
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MapPin size={12} /> Full Address *
              </label>
              <input
                type="text"
                placeholder="Street, City, Area"
                className="input-field"
                value={formData.address}
                required
                onChange={e => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Quick Select Reason</label>
              <div className="flex flex-wrap gap-3">
                {reasons.map(r => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setFormData({ ...formData, reason: r })}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${formData.reason === r ? 'bg-red-500 text-white border-red-500' : 'bg-white/5 text-slate-400 border-white/5 hover:border-red-500/50 hover:text-red-400'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                <MessageSquare size={12} /> Detailed Reason *
              </label>
              <textarea
                placeholder="Provide context for other sellers"
                className="input-field min-h-[120px] resize-none py-4"
                value={formData.reason}
                required
                onChange={e => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>

            <button 
              type="submit" 
              className="w-full h-16 rounded-[20px] bg-red-500 hover:bg-red-600 text-white font-black text-lg shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group" 
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <ShieldAlert size={20} className="group-hover:scale-110 transition-transform" />
                  Confirm Blacklist
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-8 relative z-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-10 border-2 border-dashed border-white/10 rounded-[32px] bg-white/2 flex flex-col items-center text-center group hover:border-indigo-500/50 transition-all">
                <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
                  <Upload size={40} />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Upload Data Sheet</h4>
                <p className="text-xs text-slate-500 mb-8 max-w-[200px]">Supports .xlsx, .csv files with phone, email, and reason columns.</p>
                
                <label className="w-full">
                  <input 
                    type="file" 
                    className="hidden" 
                    accept=".xlsx, .xls, .csv" 
                    onChange={e => setBulkFile(e.target.files[0])}
                  />
                  <div className="w-full py-4 rounded-2xl bg-indigo-500 text-white font-black text-sm cursor-pointer hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">
                    {bulkFile ? bulkFile.name : 'Select File'}
                  </div>
                </label>
              </div>

              <div className="p-10 bg-white/5 rounded-[32px] border border-white/5 flex flex-col">
                 <h4 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                   <Download size={20} className="text-emerald-400" /> Format Guide
                 </h4>
                 <p className="text-xs text-slate-400 mb-8 leading-relaxed">
                   To ensure successful import, your Excel sheet must contain the following columns exactly:
                 </p>
                 <div className="space-y-3 flex-1">
                   {['phone (Required)', 'email (Required)', 'address', 'reason'].map(col => (
                     <div key={col} className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-white/5 text-[10px] font-black text-slate-300 uppercase tracking-widest">
                       <CheckCircle size={12} className="text-emerald-500" /> {col}
                     </div>
                   ))}
                 </div>
              </div>
            </div>

            <button 
              onClick={handleBulkSubmit}
              className="w-full h-16 rounded-[20px] bg-indigo-500 hover:bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 group" 
              disabled={loading || !bulkFile}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Upload size={20} className="group-hover:-translate-y-1 transition-transform" />
                  Start Bulk Processing
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlacklistReport;
