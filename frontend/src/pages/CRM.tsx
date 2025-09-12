import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CRM.css';
import { DatabaseService, type Order as DBOrder } from '../services/databaseService';

interface Metric {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

export default function CRM() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');

  const metrics: Metric[] = [
    {
      title: 'Ventas del Día',
      value: '$2,450',
      change: '+12.5%',
      icon: '💰',
      color: '#4caf50'
    },
    {
      title: 'Pedidos Hoy',
      value: '47',
      change: '+8.2%',
      icon: '📦',
      color: '#2196f3'
    },
    {
      title: 'Clientes Activos',
      value: '1,234',
      change: '+15.3%',
      icon: '👥',
      color: '#ff9800'
    },
    {
      title: 'Productos Vendidos',
      value: '89',
      change: '+5.7%',
      icon: '☕',
      color: '#9c27b0'
    }
  ];

  const [recentOrders, setRecentOrders] = useState<DBOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingOrders(true);
      try {
        const orders = await DatabaseService.getOrders();
        if (mounted) setRecentOrders(orders as DBOrder[]);
      } catch (err) {
        console.error('Error loading orders for CRM:', err);
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    };

    load();

    // simple polling every 10s to keep orders fresh
    const interval = setInterval(load, 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

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
      case 'preparing': return '⏳ Preparando';
      case 'ready': return '✅ Listo';
      case 'delivered': return '🚶‍♂️ Entregado';
      case 'cancelled': return '🚫 Cancelado';
      default: return status;
    }
  };

  const updateOrderStatus = async (orderId: string | undefined, status: DBOrder['status']) => {
    if (!orderId) return;
    try {
      await DatabaseService.updateOrderStatus(orderId, status);
      // optimistic refresh
      setRecentOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('No se pudo actualizar el estado del pedido');
    }
  };

  const formatItems = (items: DBOrder['items']) => {
    if (!items || items.length === 0) return '';
    return items.map(i => `${i.productName} x${i.quantity}`).join(', ');
  };

  const formatTimeAgo = (date?: Date) => {
    if (!date) return '';
    const diff = (new Date().getTime() - new Date(date).getTime()) / 1000; // seconds
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="crm-container">
      {/* Sidebar */}
      <aside className="crm-sidebar">
        <div className="sidebar-header">
          <h2>🍵 NxuSSoft CRM</h2>
          <p>Panel Administrativo</p>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveSection('orders')}
          >
            📦 Pedidos
          </button>
          <button
            className={`nav-item ${activeSection === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveSection('customers')}
          >
            👥 Clientes
          </button>
          <button
            className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
            onClick={() => setActiveSection('products')}
          >
            ☕ Productos
          </button>
          <button
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            📈 Analytics
          </button>
          <button
            className={`nav-item ${activeSection === 'promotions' ? 'active' : ''}`}
            onClick={() => setActiveSection('promotions')}
          >
            🎁 Promociones
          </button>
          <button
            className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            ⚙️ Configuración
          </button>
        </nav>

        <div className="sidebar-footer">
          <button
            className="back-to-app-btn"
            onClick={() => navigate('/')}
          >
            ← Volver a la App
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="crm-main">
        <header className="crm-header">
          <h1>
            {activeSection === 'dashboard' && 'Dashboard Administrativo'}
            {activeSection === 'orders' && 'Gestión de Pedidos'}
            {activeSection === 'customers' && 'Gestión de Clientes'}
            {activeSection === 'products' && 'Gestión de Productos'}
            {activeSection === 'analytics' && 'Analytics y Reportes'}
            {activeSection === 'promotions' && 'Promociones y Puntos'}
            {activeSection === 'settings' && 'Configuración del Sistema'}
          </h1>
          <div className="header-actions">
            <button className="notification-btn">🔔</button>
            <div className="admin-profile">
              <span>👨‍💼 Admin</span>
            </div>
          </div>
        </header>

        <div className="crm-content">
          {activeSection === 'dashboard' && (
            <div className="dashboard-content">
              {/* Metrics Grid */}
              <div className="metrics-grid">
                {metrics.map((metric, index) => (
                  <div key={index} className="metric-card">
                    <div className="metric-icon" style={{ backgroundColor: metric.color }}>
                      {metric.icon}
                    </div>
                    <div className="metric-info">
                      <h3>{metric.value}</h3>
                      <p>{metric.title}</p>
                      <span className={`metric-change ${metric.change.startsWith('+') ? 'positive' : 'negative'}`}>
                        {metric.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="recent-orders">
                <div className="section-header">
                  <h2>Pedidos Recientes</h2>
                  <button className="view-all-btn">Ver Todos</button>
                </div>
                <div className="orders-table">
                  <div className="table-header">
                    <span>ID</span>
                    <span>Cliente</span>
                    <span>Productos</span>
                    <span>Total</span>
                    <span>Estado</span>
                    <span>Tiempo</span>
                    <span>Acciones</span>
                  </div>
                  {loadingOrders ? (
                    <div className="loading">Cargando pedidos...</div>
                  ) : (
                    recentOrders.map(order => (
                      <div key={order.id} className="table-row">
                        <span className="order-id">#{order.id}</span>
                        <span className="customer-name">{order.userName || order.userEmail}</span>
                        <span className="order-items">{formatItems(order.items)}</span>
                        <span className="order-total">${order.total}</span>
                        <span
                          className="order-status"
                          style={{ backgroundColor: getStatusColor(order.status) }}
                        >
                          {getStatusText(order.status)}
                        </span>
                        <span className="order-time">{formatTimeAgo(order.createdAt)}</span>
                        <div className="order-actions">
                          <button className="action-btn view" onClick={() => navigate(`/crm/orders/${order.id}`)}>👁️</button>
                          <button className="action-btn edit" onClick={() => navigate(`/crm/orders/${order.id}/edit`)}>✏️</button>
                          <button className="action-btn update" onClick={() => updateOrderStatus(order.id, 'preparing')}>🔄 Preparar</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h2>Acciones Rápidas</h2>
                <div className="actions-grid">
                  <button className="quick-action-btn">
                    ➕ Nuevo Pedido
                  </button>
                  <button className="quick-action-btn">
                    👥 Nuevo Cliente
                  </button>
                  <button className="quick-action-btn">
                    ☕ Nuevo Producto
                  </button>
                  <button className="quick-action-btn">
                    📊 Generar Reporte
                  </button>
                  <button className="quick-action-btn">
                    🎁 Crear Promoción
                  </button>
                  <button className="quick-action-btn">
                    📧 Enviar Newsletter
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'orders' && (
            <div className="orders-management">
              <div className="management-header">
                <div className="filters">
                  <select className="filter-select">
                    <option>Todos los estados</option>
                    <option>Preparando</option>
                    <option>Listo</option>
                    <option>Entregado</option>
                  </select>
                  <input
                    type="date"
                    className="filter-input"
                    placeholder="Fecha"
                  />
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Buscar cliente..."
                  />
                </div>
                <button className="export-btn">📊 Exportar</button>
              </div>

              <div className="orders-list">
                {recentOrders.map(order => (
                  <div key={order.id} className="order-card-admin">
                    <div className="order-card-header">
                      <h3>Pedido #{order.id}</h3>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(order.status) }}
                      >
                        {getStatusText(order.status)}
                      </span>
                    </div>
                    <div className="order-card-body">
                      <div className="order-details">
                        <p><strong>Cliente:</strong> {order.userName || order.userEmail}</p>
                        <p><strong>Productos:</strong> {formatItems(order.items)}</p>
                        <p><strong>Total:</strong> ${order.total}</p>
                        <p><strong>Hora:</strong> {formatTimeAgo(order.createdAt)} atrás</p>
                      </div>
                      <div className="order-actions-admin">
                        <button className="status-btn preparing" onClick={() => updateOrderStatus(order.id, 'preparing')}>⏳ Preparando</button>
                        <button className="status-btn ready" onClick={() => updateOrderStatus(order.id, 'ready')}>✅ Listo</button>
                        <button className="status-btn delivered" onClick={() => updateOrderStatus(order.id, 'delivered')}>🚶‍♂️ Entregado</button>
                        <button className="edit-btn" onClick={() => navigate(`/crm/orders/${order.id}/edit`)}>✏️ Editar</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'customers' && (
            <div className="customers-management">
              <div className="management-header">
                <div className="search-bar">
                  <input
                    type="text"
                    placeholder="Buscar clientes..."
                    className="search-input"
                  />
                  <button className="search-btn">🔍</button>
                </div>
                <button className="add-customer-btn">➕ Nuevo Cliente</button>
              </div>

              <div className="customers-grid">
                <div className="customer-card">
                  <div className="customer-avatar">👤</div>
                  <div className="customer-info">
                    <h3>María González</h3>
                    <p>maria@email.com</p>
                    <p>📱 +52 55 1234 5678</p>
                    <div className="customer-stats">
                      <span>⭐ 150 puntos</span>
                      <span>📦 12 pedidos</span>
                    </div>
                  </div>
                  <div className="customer-actions">
                    <button className="action-btn">👁️ Ver</button>
                    <button className="action-btn">✏️ Editar</button>
                    <button className="action-btn">📧 Email</button>
                  </div>
                </div>

                <div className="customer-card">
                  <div className="customer-avatar">👤</div>
                  <div className="customer-info">
                    <h3>Carlos Rodríguez</h3>
                    <p>carlos@email.com</p>
                    <p>📱 +52 55 8765 4321</p>
                    <div className="customer-stats">
                      <span>⭐ 89 puntos</span>
                      <span>📦 8 pedidos</span>
                    </div>
                  </div>
                  <div className="customer-actions">
                    <button className="action-btn">👁️ Ver</button>
                    <button className="action-btn">✏️ Editar</button>
                    <button className="action-btn">📧 Email</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'products' && (
            <div className="products-management">
              <div className="management-header">
                <button className="add-product-btn">➕ Nuevo Producto</button>
                <button className="inventory-btn">📦 Inventario</button>
              </div>

              <div className="products-grid">
                <div className="product-card-admin">
                  <div className="product-image">☕</div>
                  <div className="product-info">
                    <h3>Espresso</h3>
                    <p>$25.00</p>
                    <span className="stock-badge">Stock: 45</span>
                  </div>
                  <div className="product-actions">
                    <button className="action-btn">✏️ Editar</button>
                    <button className="action-btn">📊 Ventas</button>
                  </div>
                </div>

                <div className="product-card-admin">
                  <div className="product-image">🧁</div>
                  <div className="product-info">
                    <h3>Cheesecake</h3>
                    <p>$60.00</p>
                    <span className="stock-badge low">Stock: 3</span>
                  </div>
                  <div className="product-actions">
                    <button className="action-btn">✏️ Editar</button>
                    <button className="action-btn">📊 Ventas</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'analytics' && (
            <div className="analytics-content">
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Ventas por Día</h3>
                  <div className="chart-placeholder">
                    📊 Gráfico de ventas
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>Productos Más Vendidos</h3>
                  <div className="chart-placeholder">
                    🥧 Gráfico de productos
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>Clientes por Mes</h3>
                  <div className="chart-placeholder">
                    📈 Gráfico de clientes
                  </div>
                </div>
                <div className="analytics-card">
                  <h3>Ingresos Mensuales</h3>
                  <div className="chart-placeholder">
                    💰 Gráfico de ingresos
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'promotions' && (
            <div className="promotions-management">
              <div className="management-header">
                <button className="add-promotion-btn">➕ Nueva Promoción</button>
                <button className="points-btn">⭐ Gestionar Puntos</button>
              </div>

              <div className="promotions-grid">
                <div className="promotion-card-admin">
                  <div className="promotion-header">
                    <h3>Cumpleaños Especial</h3>
                    <span className="promotion-status active">Activa</span>
                  </div>
                  <p>Café gratis en cumpleaños</p>
                  <div className="promotion-stats">
                    <span>👥 45 clientes elegibles</span>
                    <span>📅 Próximos 7 días</span>
                  </div>
                  <div className="promotion-actions">
                    <button className="action-btn">✏️ Editar</button>
                    <button className="action-btn">📧 Enviar</button>
                  </div>
                </div>

                <div className="promotion-card-admin">
                  <div className="promotion-header">
                    <h3>Programa de Puntos</h3>
                    <span className="promotion-status active">Activa</span>
                  </div>
                  <p>1 punto por cada $10 gastados</p>
                  <div className="promotion-stats">
                    <span>⭐ 12,450 puntos activos</span>
                    <span>🎁 89 canjes este mes</span>
                  </div>
                  <div className="promotion-actions">
                    <button className="action-btn">⚙️ Configurar</button>
                    <button className="action-btn">📊 Reporte</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div className="settings-content">
              <div className="settings-grid">
                <div className="settings-card">
                  <h3>⚙️ Configuración General</h3>
                  <div className="setting-item">
                    <label>Nombre de la Cafetería</label>
                    <input type="text" defaultValue="Nxus Café" />
                  </div>
                  <div className="setting-item">
                    <label>Horario de Atención</label>
                    <input type="text" defaultValue="7:00 AM - 8:00 PM" />
                  </div>
                  <div className="setting-item">
                    <label>Dirección</label>
                    <input type="text" defaultValue="Calle Principal 123" />
                  </div>
                </div>

                <div className="settings-card">
                  <h3>💰 Configuración de Precios</h3>
                  <div className="setting-item">
                    <label>IVA (%)</label>
                    <input type="number" defaultValue="16" />
                  </div>
                  <div className="setting-item">
                    <label>Moneda</label>
                    <select defaultValue="MXN">
                      <option value="MXN">MXN - Peso Mexicano</option>
                      <option value="USD">USD - Dólar</option>
                    </select>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>📧 Notificaciones</h3>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Email de confirmación de pedidos
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" defaultChecked />
                      Recordatorios de cumpleaños
                    </label>
                  </div>
                  <div className="setting-item">
                    <label>
                      <input type="checkbox" />
                      Reportes diarios
                    </label>
                  </div>
                </div>

                <div className="settings-card">
                  <h3>🔒 Seguridad</h3>
                  <div className="setting-item">
                    <label>Tiempo de sesión (minutos)</label>
                    <input type="number" defaultValue="60" />
                  </div>
                  <button className="save-settings-btn">💾 Guardar Configuración</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
