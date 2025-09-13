// ...existing code...

import { useEffect, useState } from 'react';
import { DatabaseService } from '../../services/databaseService';

export default function CustomersSection() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    DatabaseService.getCustomers().then(list => {
      if (mounted) setCustomers(list);
    }).finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="customers-management">
      <div className="management-header">
        <div className="search-bar">
          <input type="text" placeholder="Buscar clientes..." className="search-input" />
          <button className="search-btn">🔍</button>
        </div>
        <button className="add-customer-btn">➕ Nuevo Cliente</button>
      </div>
      <div className="customers-grid">
        {loading ? (
          <div style={{padding:'2rem',textAlign:'center'}}>Cargando clientes...</div>
        ) : customers.length === 0 ? (
          <div style={{padding:'2rem',textAlign:'center',color:'#888'}}>No hay clientes registrados.</div>
        ) : customers.map(c => (
          <div key={c.uid} className="customer-card">
            <div className="customer-avatar">👤</div>
            <div className="customer-info">
              <h3>{c.name}</h3>
              <p>{c.email}</p>
              <p>UID: {c.uid}</p>
              <div className="customer-stats">
                <span>⭐ {c.points ?? 0} puntos</span>
                {/* <span>📦 pedidos</span> */}
              </div>
            </div>
            <div className="customer-actions">
              <button className="action-btn">👁️ Ver</button>
              <button className="action-btn">✏️ Editar</button>
              <button className="action-btn">📧 Email</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
