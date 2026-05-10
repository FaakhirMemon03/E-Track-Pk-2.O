import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { Send, MessageCircle, User, Clock } from 'lucide-react';
import logo from '../assets/logo.png';

const Chat = ({ user, role }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef();
  const chatEndRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    const roomId = role === 'store' ? user.id : user.currentChatStoreId;
    socketRef.current.emit('join', roomId);

    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/chat/${roomId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setMessages(data);
    };
    if (roomId) fetchHistory();

    socketRef.current.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socketRef.current.disconnect();
  }, [user.id, user.currentChatStoreId, role]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const roomId = role === 'store' ? user.id : user.currentChatStoreId;
    const msgData = {
      room: roomId,
      senderId: user.id,
      senderModel: role === 'admin' ? 'Admin' : 'Store',
      receiverId: role === 'store' ? 'ADMIN_ID' : roomId,
      receiverModel: role === 'store' ? 'Admin' : 'Store',
      text: inputText,
      createdAt: new Date()
    };

    socketRef.current.emit('sendMessage', msgData);
    
    const token = localStorage.getItem('token');
    await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(msgData)
    });

    setInputText('');
  };

  return (
    <div className="max-w-4xl mx-auto h-[700px] flex flex-col glass rounded-[40px] border-white/5 overflow-hidden shadow-2xl animate-fade-up">
      {/* Chat Header */}
      <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
            <MessageCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight">Live Support</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Network Specialist Online
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/5">
            Store ID: {user.id?.slice(-6)}
          </span>
        </div>
      </div>
      
      {/* Chat Body */}
      <div className="flex-1 p-8 overflow-y-auto space-y-6 custom-scrollbar bg-slate-950/20">
        {messages.map((msg, i) => {
          const isMe = (msg.senderModel === 'Admin' && role === 'admin') || (msg.senderModel === 'Store' && role === 'store');
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`flex flex-col gap-2 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`flex items-center gap-2 mb-1`}>
                   {!isMe && <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center p-0.5 border border-white/10 shadow-sm overflow-hidden">
                     <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                   </div>}
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{isMe ? 'You' : 'Support Agent'}</span>
                   {isMe && <div className="w-5 h-5 rounded-md bg-slate-800 flex items-center justify-center text-[8px] font-black text-slate-400"><User size={10} /></div>}
                </div>
                <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-lg ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'glass bg-white/5 text-slate-200 rounded-tl-none border border-white/5'}`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 text-[9px] font-black text-slate-600 uppercase tracking-tighter mt-1">
                  <Clock size={10} /> {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Chat Footer */}
      <form onSubmit={sendMessage} className="p-8 bg-white/2 border-t border-white/5">
        <div className="flex gap-4 p-2 bg-slate-900/50 border border-white/5 rounded-3xl focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/5 transition-all">
          <input 
            type="text" 
            placeholder="Describe your issue..." 
            className="flex-1 bg-transparent border-none outline-none px-4 text-sm text-white placeholder:text-slate-600"
            value={inputText} 
            onChange={e => setInputText(e.target.value)} 
          />
          <button 
            type="submit" 
            className="w-12 h-12 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl shadow-indigo-500/20"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
