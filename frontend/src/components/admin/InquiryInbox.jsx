import React, { useState, useEffect } from 'react';
import { Mail, User, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { getApiUrl } from '../../api';

const InquiryInbox = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(getApiUrl('/api/admin/messages'), {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    })
    .then(r => r.json())
    .then(data => {
      if (Array.isArray(data)) setMessages(data);
      setLoading(false);
    })
    .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-20 text-center animate-pulse text-slate-500 font-bold uppercase tracking-widest">Loading Inbox...</div>;

  return (
    <div className="space-y-8 animate-fade-up">
      <div className="flex items-center gap-4 px-2">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
          <Mail size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">Inquiry Inbox</h3>
          <p className="text-slate-400 text-sm">Messages from the landing page contact form.</p>
        </div>
      </div>

      {!messages.length ? (
        <div className="glass p-20 rounded-[40px] border-white/5 text-center space-y-4">
          <MessageSquare size={48} className="mx-auto text-slate-800" />
          <p className="text-slate-500 font-medium">Your inbox is empty.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {messages.map(msg => (
            <div key={msg._id} className="glass p-8 rounded-[32px] border-white/5 hover:border-white/10 transition-all group relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Mail size={64} />
               </div>
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                       <User size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">{msg.name}</h4>
                      <div className="flex items-center gap-3 text-xs font-bold text-indigo-400 uppercase tracking-widest mt-1">
                        <Mail size={12} /> {msg.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
                    <Clock size={12} /> {new Date(msg.createdAt).toLocaleString()}
                  </div>
               </div>

               <div className="mt-8 p-6 rounded-2xl bg-white/2 border border-white/5 text-slate-300 leading-relaxed relative z-10">
                 {msg.message}
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiryInbox;
