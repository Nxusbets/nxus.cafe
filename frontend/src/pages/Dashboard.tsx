import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <div className="dashboard-container">
      <h2>Panel Principal</h2>

      {user && (
        <div className="user-welcome">
          <p>¡Hola, {user.name}! <a href="#" onClick={() => navigate('/user-dashboard')}>Ir a mi dashboard</a></p>
        </div>
      )}

      {!user && (
        <div className="auth-buttons">
          <button className="auth-link-btn" onClick={() => navigate('/login')}>Iniciar Sesión</button>
          <button className="auth-link-btn register" onClick={() => navigate('/register')}>Crear Cuenta</button>
        </div>
      )}

      <div className="dashboard-options">
        <div className="dashboard-card" onClick={() => navigate('/waiter')}>
          <span role="img" aria-label="Mesero">🍽️</span>
          <h3>Panel de Meseros</h3>
          <p>Escanea códigos QR y gestiona pedidos de mesas.</p>
        </div>
        <div className="dashboard-card" onClick={() => navigate('/crm')}>
          <span role="img" aria-label="CRM">📊</span>
          <h3>CRM Profesional</h3>
          <p>Accede al sistema de gestión de clientes y análisis avanzado.</p>
        </div>
        <a className="dashboard-card" href="#pedidos">
          <span role="img" aria-label="Pedidos">☕</span>
          <h3>Pedidos</h3>
          <p>Gestiona las órdenes de los clientes en tiempo real.</p>
        </a>
        <a className="dashboard-card" href="#inventario">
          <span role="img" aria-label="Inventario">📦</span>
          <h3>Inventario</h3>
          <p>Controla el stock de insumos y productos.</p>
        </a>
        <a className="dashboard-card" href="#clientes">
          <span role="img" aria-label="Clientes">👥</span>
          <h3>Clientes</h3>
          <p>Administra la base de datos de tus clientes frecuentes.</p>
        </a>
        <div className="dashboard-card" onClick={() => navigate('/')}>
          <span role="img" aria-label="Página">🌐</span>
          <h3>Página</h3>
          <p>Accede a la landing page pública de la cafetería.</p>
        </div>
      </div>
    </div>
  );
}
