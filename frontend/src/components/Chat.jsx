import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const Chat = ({ user, role }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const socketRef = useRef();
  const chatEndRef = useRef();

  useEffect(() => {
    socketRef.current = io('http://localhost:5000');
    
    // Join room (if store, room is their ID. if admin, they join specific store rooms)
    const roomId = role === 'store' ? user.id : user.currentChatStoreId;
    socketRef.current.emit('join', roomId);

    // Fetch History
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
  }, [user.id, role]);

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
      receiverId: role === 'store' ? 'ADMIN_ID' : roomId, // Simplified
      receiverModel: role === 'store' ? 'Admin' : 'Store',
      text: inputText,
      createdAt: new Date()
    };

    socketRef.current.emit('sendMessage', msgData);
    
    // Persist to DB
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
    <div className="glass animate-fade" style={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)' }}>
        <h3>Live Support {role === 'admin' && `- Chatting with Store`}</h3>
      </div>
      
      <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            alignSelf: (msg.senderModel === 'Admin' && role === 'admin') || (msg.senderModel === 'Store' && role === 'store') ? 'flex-end' : 'flex-start',
            background: (msg.senderModel === 'Admin' && role === 'admin') || (msg.senderModel === 'Store' && role === 'store') ? 'var(--primary)' : 'var(--secondary)',
            padding: '10px 15px',
            borderRadius: '12px',
            maxWidth: '70%'
          }}>
            {msg.text}
            <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '5px' }}>
              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={sendMessage} style={{ padding: '20px', display: 'flex', gap: '10px' }}>
        <input type="text" placeholder="Type your message..." value={inputText} onChange={e => setInputText(e.target.value)} style={{ marginBottom: 0 }} />
        <button type="submit" className="btn-primary">Send</button>
      </form>
    </div>
  );
};

export default Chat;
