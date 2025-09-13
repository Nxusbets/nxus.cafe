// ...existing code...

export default function Header({ activeSection }: { activeSection: string }) {
  return (
    <header className="crm-header">
      <h1>
        {activeSection === 'dashboard' && 'Dashboard Administrativo'}
        {activeSection === 'orders' && 'Gestión de Pedidos'}
        {activeSection === 'customers' && 'Gestión de Clientes'}
        {activeSection === 'products' && 'Gestión de Productos'}
        {activeSection === 'inventory' && 'Gestión de Inventario'}
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
  );
}
