// ...existing code...

export default function Sidebar({ activeSection, setActiveSection, navigate }: any) {
  return (
    <aside className="crm-sidebar">
      <div className="sidebar-header">
        <h2>🍵 NxuSSoft CRM</h2>
        <p>Panel Administrativo</p>
      </div>
      <nav className="sidebar-nav">
        <button className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>📊 Dashboard</button>
        <button className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`} onClick={() => setActiveSection('orders')}>📦 Pedidos</button>
        <button className={`nav-item ${activeSection === 'customers' ? 'active' : ''}`} onClick={() => setActiveSection('customers')}>👥 Clientes</button>
        <button className={`nav-item ${activeSection === 'products' ? 'active' : ''}`} onClick={() => setActiveSection('products')}>☕ Productos</button>
        <button className={`nav-item ${activeSection === 'inventory' ? 'active' : ''}`} onClick={() => setActiveSection('inventory')}>📦 Inventario</button>
        <button className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`} onClick={() => setActiveSection('analytics')}>📈 Analytics</button>
        <button className={`nav-item ${activeSection === 'promotions' ? 'active' : ''}`} onClick={() => setActiveSection('promotions')}>🎁 Promociones</button>
        <button className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`} onClick={() => setActiveSection('settings')}>⚙️ Configuración</button>
      </nav>
      <div className="sidebar-footer">
        <button className="back-to-app-btn" onClick={() => navigate('/')}>← Volver a la App</button>
      </div>
    </aside>
  );
}
