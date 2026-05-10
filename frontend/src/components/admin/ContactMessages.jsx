import React, { useState, useEffect } from 'react';
import { Mail, User, Clock, MessageSquare, Trash2, CheckCircle } from 'lucide-react';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Contact Inquiries</h2>
          <p className="text-slate-400 mt-1 uppercase text-[10px] font-black tracking-[0.2em]">Landing Page Leads</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
        </div>
      ) : messages.length === 0 ? (
        <div className="glass p-20 text-center rounded-[40px] border-white/5">
          <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-600">
            <Mail size={40} />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Inquiries Found</h3>
          <p className="text-slate-500">When someone contacts you from the landing page, it will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map((msg) => (
            <div key={msg._id} className="glass p-8 rounded-[32px] border-white/5 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <MessageSquare size={80} />
              </div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 shadow-lg group-hover:scale-110 transition-transform">
                    <User size={28} />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-white">{msg.name}</h4>
                    <div className="flex flex-wrap gap-4 items-center">
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-slate-300 font-bold">
                        <Mail size={14} className="text-indigo-400" /> {msg.email}
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400 font-bold">
                        <Clock size={14} /> {new Date(msg.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 max-w-xl">
                  <div className="p-6 rounded-2xl bg-black/40 border border-white/5 text-slate-300 text-sm leading-relaxed">
                    "{msg.message}"
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   <button className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/5">
                     <CheckCircle size={20} />
                   </button>
                   <button className="p-4 rounded-2xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all shadow-lg shadow-red-500/5">
                     <Trash2 size={20} />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
