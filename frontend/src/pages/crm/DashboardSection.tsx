
import { useNavigate } from 'react-router-dom';
import './DashboardSection.css';

export default function DashboardSection({ metrics, recentOrders, loadingOrders, getStatusColor, getStatusText, formatTimeAgo, updateOrderStatus }: any) {
  const navigate = useNavigate();
  return (
    <div className="dashboard-content">
      {/* Metrics Grid */}
      <div className="metrics-grid">
        {metrics.map((metric: any, index: number) => (
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
            recentOrders.map((order: any) => (
            <div key={order.id} className="table-row">
              <span className="customer-name">{order.userName || order.userEmail}</span>
              <span className="order-items">
                {order.items && order.items.length > 0
                  ? order.items.map((item: any, idx: number) => (
                      <span key={idx} style={{display: 'block'}}>{item.productName} x{item.quantity}</span>
                    ))
                  : null}
              </span>
              <span className="order-total">${order.total}</span>
              <span className="order-status" style={{ backgroundColor: getStatusColor(order.status), fontSize: '0.85rem', padding: '2px 10px', borderRadius: 12, minWidth: 60, display: 'inline-block' }}>{getStatusText(order.status)}</span>
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
          <button className="quick-action-btn">➕ Nuevo Pedido</button>
          <button className="quick-action-btn">👥 Nuevo Cliente</button>
          <button className="quick-action-btn">☕ Nuevo Producto</button>
          <button className="quick-action-btn">📊 Generar Reporte</button>
          <button className="quick-action-btn">🎁 Crear Promoción</button>
          <button className="quick-action-btn">📧 Enviar Newsletter</button>
        </div>
      </div>
    </div>
  );
}
