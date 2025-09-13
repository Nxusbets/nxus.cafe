// ...existing code...
import { useNavigate } from 'react-router-dom';

export default function OrdersSection({ recentOrders, getStatusColor, getStatusText, formatItems, formatTimeAgo, updateOrderStatus }: any) {
  const navigate = useNavigate();
  return (
    <div className="orders-management">
      <div className="management-header">
        <div className="filters">
          <select className="filter-select">
            <option>Todos los estados</option>
            <option>Preparando</option>
            <option>Listo</option>
            <option>Entregado</option>
          </select>
          <input type="date" className="filter-input" placeholder="Fecha" />
          <input type="text" className="filter-input" placeholder="Buscar cliente..." />
        </div>
        <button className="export-btn">📊 Exportar</button>
      </div>
      <div className="orders-list">
        {recentOrders.map((order: any) => (
          <div key={order.id} className="order-card-admin">
            <div className="order-card-header">
              <h3>Pedido #{order.id}</h3>
              <span className="status-badge" style={{ backgroundColor: getStatusColor(order.status) }}>{getStatusText(order.status)}</span>
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
  );
}
