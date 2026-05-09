import React, { useState, useEffect } from 'react';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);

  const fetchStores = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/admin/stores', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (Array.isArray(data)) setStores(data);
  };

  useEffect(() => { fetchStores(); }, []);

  const updateStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/admin/stores/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    fetchStores();
  };

  const activatePlan = async (id) => {
    const plan = prompt('Enter plan name (1month, 6month, 1year):', '1month');
    const months = parseInt(prompt('Enter duration in months:', '1'));
    if (!plan || isNaN(months)) return;

    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/admin/stores/${id}/activate`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ plan, durationMonths: months })
    });
    fetchStores();
  };

  return (
    <div className="glass animate-fade" style={{ padding: '30px' }}>
      <h3>Manage Registered Stores</h3>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
            <th style={{ padding: '15px' }}>Store Name</th>
            <th style={{ padding: '15px' }}>Email</th>
            <th style={{ padding: '15px' }}>Plan</th>
            <th style={{ padding: '15px' }}>Status</th>
            <th style={{ padding: '15px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
              <td style={{ padding: '15px' }}>{store.name}</td>
              <td style={{ padding: '15px' }}>{store.email}</td>
              <td style={{ padding: '15px' }}>{store.plan.toUpperCase()}</td>
              <td style={{ padding: '15px', color: store.status === 'active' ? 'var(--success)' : 'var(--danger)' }}>{store.status}</td>
              <td style={{ padding: '15px', display: 'flex', gap: '10px' }}>
                <button onClick={() => activatePlan(store._id)} className="btn-primary" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>Activate</button>
                <button onClick={() => updateStatus(store._id, store.status === 'active' ? 'banned' : 'active')} className="btn-outline" style={{ padding: '5px 10px', fontSize: '0.8rem', color: store.status === 'active' ? 'var(--danger)' : 'var(--success)' }}>
                  {store.status === 'active' ? 'Block' : 'Unblock'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StoreManagement;
