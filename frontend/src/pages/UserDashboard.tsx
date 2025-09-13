import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService, type Order as RealOrder } from '../services/databaseService';
import './UserDashboard.css';

type PointsHistoryEntry = {
  id?: string;
  date?: string;
  description?: string;
  points: number;
  type: 'earn' | 'redeem' | string;
};



export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('perfil');
  const navigate = useNavigate();
  const { user, logout } = useAuth();


  const [orders, setOrders] = useState<RealOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    console.log('Fetching orders for user:', user.id);
    setOrdersLoading(true);
    DatabaseService.getUserOrders(user.id)
      .then(fetchedOrders => {
        console.log('Fetched orders:', fetchedOrders);
        setOrders(fetchedOrders);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      })
      .finally(() => setOrdersLoading(false));
  }, [user]);

  const [pointsHistory, setPointsHistory] = useState<PointsHistoryEntry[]>([]);
  const [pointsLoading, setPointsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setPointsLoading(true);
    const fetchPointsHistory: (id: string) => Promise<PointsHistoryEntry[]> =
      (DatabaseService as any).getPointsHistory
        ? (DatabaseService as any).getPointsHistory.bind(DatabaseService)
        : () => Promise.resolve([]);
    fetchPointsHistory(user.id).then(setPointsHistory).finally(() => setPointsLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'preparing': return '#ff9800';
      case 'ready': return '#4caf50';
      case 'delivered': return '#2196f3';
      case 'cancelled': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Pendiente';
      case 'preparing': return '👨‍🍳 Preparando';
      case 'ready': return '✅ Listo para recoger';
      case 'delivered': return '🚶‍♂️ Entregado';
      case 'cancelled': return '❌ Cancelado';
      default: return status;
    }
  };

  if (!user) return <div>Cargando...</div>;

  return (
    <div className="user-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>🍵 Hola, {user.name}!</h1>
          <div className="header-actions-right">
            <div className="user-points">
              <span className="points-badge">⭐ {user.points} puntos</span>
            </div>
            <button className="primary-btn" onClick={() => navigate('/order')}>Realizar Pedido</button>
            <button className="logout-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button className={`nav-tab ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>Perfil</button>
        <button className={`nav-tab ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => setActiveTab('pedidos')}>Pedidos</button>
        <button className={`nav-tab ${activeTab === 'puntos' ? 'active' : ''}`} onClick={() => setActiveTab('puntos')}>Puntos</button>
        <button className={`nav-tab ${activeTab === 'promociones' ? 'active' : ''}`} onClick={() => setActiveTab('promociones')}>Promociones</button>
      </nav>

      {/* Dropdown visible on mobile (kept outside .dashboard-nav) */}
      <div className="dropdown" aria-hidden={false}>
        <select
          className="dropdown-select"
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          aria-label="Navegación del usuario"
        >
          <option value="perfil">Perfil</option>
          <option value="pedidos">Pedidos</option>
          <option value="puntos">Puntos</option>
          <option value="promociones">Promociones</option>
        </select>
      </div>

      <main className="dashboard-content">
        {activeTab === 'perfil' && (
          <div className="profile-section">
            <h2>Mi Perfil</h2>
            <div className="profile-card">
              <div className="profile-avatar">
                <span>👤</span>
              </div>
              <div className="profile-info">
                <h3>{user.name}</h3>
                <p>📧 {user.email}</p>
                {user.phone && <p>📱 {user.phone}</p>}
                {user.birthDate && <p>🎂 {new Date(user.birthDate).toLocaleDateString('es-ES')}</p>}
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Pedidos</h4>
                <span className="stat-number">{orders.length}</span>
              </div>
              <div className="stat-card">
                <h4>Puntos Acumulados</h4>
                <span className="stat-number">{user.points}</span>
              </div>
              <div className="stat-card">
                <h4>Próximo Cumpleaños</h4>
                <span className="stat-number">
                  {user.birthDate ? Math.ceil((new Date(user.birthDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0} días
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pedidos' && (
          <div className="orders-section">
            <h2>Mis Pedidos</h2>
            {ordersLoading ? (
              <div style={{padding:'2rem',textAlign:'center'}}>Cargando pedidos...</div>
            ) : (
              <div className="orders-list">
                {!orders ? (
                  <div style={{padding:'2rem',textAlign:'center',color:'#888'}}>Error al cargar pedidos.</div>
                ) : orders.length === 0 ? (
                  <div style={{padding:'2rem',textAlign:'center',color:'#888'}}>No tienes pedidos aún.</div>
                ) : orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <span className="order-id">Pedido #{order.id?.slice(-6) || ''}</span>
                      <span
                        className="order-status"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="order-details">
                      <p>📅 {order.createdAt ? new Date(order.createdAt).toLocaleDateString('es-ES') : ''}</p>
                      <p>🛒 {order.items.map(i => i.productName).join(', ')}</p>
                      <p>💰 ${order.total}</p>
                    </div>
                    {order.status === 'ready' && (
                      <button className="pickup-btn">
                        Confirmar Recogida
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'puntos' && (
          <div className="points-section">
            <h2>Mis Puntos</h2>
            <div className="points-summary">
              <div className="points-card">
                <h3>Puntos Actuales</h3>
                <span className="points-number">{user.points}</span>
                <p>Equivalen a ${(user.points / 10).toFixed(0)} de descuento</p>
              </div>
            </div>

            <div className="points-history">
              <h3>Historial de Puntos</h3>
              <div className="history-list">
                {pointsLoading ? (
                  <div style={{padding:'2rem',textAlign:'center'}}>Cargando historial...</div>
                ) : pointsHistory.length === 0 ? (
                  <div style={{padding:'2rem',textAlign:'center',color:'#888'}}>No hay movimientos de puntos.</div>
                ) : pointsHistory.map((entry, index) => (
                  <div key={entry.id || index} className="history-item">
                    <div className="history-info">
                      <span className="history-date">{entry.date ? new Date(entry.date).toLocaleDateString('es-ES') : ''}</span>
                      <span className="history-description">{entry.description}</span>
                    </div>
                    <span className="history-points" style={{color: entry.type === 'redeem' ? '#e74c3c' : '#4caf50'}}>
                      {entry.type === 'redeem' ? '-' : '+'}{entry.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="redeem-section">
              <h3>Canjear Puntos</h3>
              <div className="redeem-options">
                <div className="redeem-card">
                  <h4>Café Gratis</h4>
                  <p>500 puntos</p>
                  <button className="redeem-btn" disabled={user.points < 500}>
                    Canjear
                  </button>
                </div>
                <div className="redeem-card">
                  <h4>$10 de descuento</h4>
                  <p>100 puntos</p>
                  <button className="redeem-btn" disabled={user.points < 100}>
                    Canjear
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'promociones' && (
          <div className="promotions-section">
            <h2>Promociones Especiales</h2>
            <div className="promotion-card birthday">
              <h3>🎂 ¡Feliz Cumpleaños!</h3>
              <p>Recibe un café gratis en tu cumpleaños</p>
              <span className="promotion-date">
                {user.birthDate ? new Date(user.birthDate).toLocaleDateString('es-ES', { month: 'long', day: 'numeric' }) : 'No especificada'}
              </span>
            </div>

            <div className="promotion-card">
              <h3>⭐ Programa de Puntos</h3>
              <p>Gana 1 punto por cada $10 gastados</p>
              <ul>
                <li>500 puntos = Café gratis</li>
                <li>100 puntos = $10 descuento</li>
                <li>Puntos dobles en cumpleaños</li>
              </ul>
            </div>

            <div className="promotion-card">
              <h3>👥 Invita a tus amigos</h3>
              <p>Gana 50 puntos por cada amigo que se registre</p>
              <button className="share-btn">Compartir código</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
