import './MobileNav.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function MobileNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Only show on mobile
  // You can use CSS media queries to hide/show this component

  return (
    <nav className="mobile-nav">
      <button
        className={location.pathname === '/' ? 'active' : ''}
        onClick={() => navigate('/')}
        aria-label="Inicio"
      >
        <span>🏠</span>
        <span className="nav-label">Inicio</span>
      </button>
      <button
        className={location.pathname === '/menu' ? 'active' : ''}
        onClick={() => navigate('/menu')}
        aria-label="Menú"
      >
        <span>📋</span>
        <span className="nav-label">Menú</span>
      </button>
      <button
        className={location.pathname === '/order' ? 'active' : ''}
        onClick={() => navigate('/order')}
        aria-label="Ordenar"
      >
        <span>🛒</span>
        <span className="nav-label">Ordenar</span>
      </button>
      <button
        className={location.pathname === '/user-dashboard' ? 'active' : ''}
        onClick={() => isAuthenticated ? navigate('/user-dashboard') : navigate('/login')}
        aria-label="Mi Perfil"
      >
        <span>👤</span>
        <span className="nav-label">Mi Perfil</span>
      </button>
    </nav>
  );
}
