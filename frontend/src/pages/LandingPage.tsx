import './LandingPage.css';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';


export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showGuestModal, setShowGuestModal] = useState(false);


  const handleOrderClick = () => {
    if (isAuthenticated) {
      navigate('/order');
    } else {
      setShowGuestModal(true);
    }
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>¡Bienvenido a Nxus Café!</h1>
          <p>El aroma del mejor café en cada taza. Disfruta de una experiencia única en nuestro acogedor espacio.</p>
          <button className="hero-btn" onClick={handleOrderClick}>Ordenar Ahora</button>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" alt="Cafetería Nxus" />
        </div>
      </section>

      {/* Modal para usuarios no autenticados */}
      {showGuestModal && (
        <div className="modal-overlay">
          <div className="modal guest-modal">
            <h2>¿Quieres disfrutar de todos los beneficios?</h2>
            <p>Para acumular puntos, ver tu historial y recibir promociones, crea una cuenta o inicia sesión.</p>
            <div className="modal-actions">
              <button className="cta-btn" onClick={() => navigate('/register')}>Crear Cuenta</button>
              <button className="cta-btn secondary" onClick={() => navigate('/login')}>Iniciar Sesión</button>
              <button className="cta-btn ghost" onClick={() => { setShowGuestModal(false); navigate('/order'); }}>Continuar como Invitado</button>
            </div>
            <p className="guest-warning">Si continúas como invitado <b>no acumularás puntos</b> ni podrás ver tu historial de pedidos.</p>
            <button className="modal-close" onClick={() => setShowGuestModal(false)}>×</button>
          </div>
        </div>
      )}

      {/* Menú Section */}
      <section className="menu-section">
        <h2>Nuestro Menú</h2>
        <div className="menu-preview">
          <div className="menu-category">
            <h3>☕ Cafés Especiales</h3>
            <ul>
              <li>Espresso - $25</li>
              <li>Latte - $40</li>
              <li>Cappuccino - $45</li>
              <li>Mocha - $50</li>
            </ul>
          </div>
          <div className="menu-category">
            <h3>🍨 Frappés</h3>
            <ul>
              <li>Vainilla - $55</li>
              <li>Chocolate - $55</li>
              <li>Caramelo - $55</li>
              <li>Fresa - $55</li>
            </ul>
          </div>
          <div className="menu-category">
            <h3>🍰 Pasteles</h3>
            <ul>
              <li>Cheesecake - $60</li>
              <li>Chocolate - $55</li>
              <li>Red Velvet - $58</li>
              <li>Limón - $52</li>
            </ul>
          </div>
        </div>
  <button className="menu-btn" onClick={() => navigate('/menu')}>Ver Menú Completo</button>
      </section>

      {/* Características */}
      <section className="features">
        <h2>¿Por qué elegir Nxus Café?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">📱</span>
            <h3>Ordena en Línea</h3>
            <p>Elige tu café favorito desde tu teléfono y recógelo sin esperas.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔔</span>
            <h3>Notificación Instantánea</h3>
            <p>Te avisamos cuando tu pedido esté listo para recoger.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⭐</span>
            <h3>Sistema de Puntos</h3>
            <p>Acumula puntos con cada compra y obtén descuentos exclusivos.</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">☕</span>
            <h3>Café Artesanal</h3>
            <p>Granos seleccionados y tostados a la perfección por expertos baristas.</p>
          </div>
        </div>
      </section>

      {/* Cómo Funciona */}
      <section className="how-it-works">
        <h2>Cómo Funciona</h2>
        <div className="steps">
          <div className="step">
            <span className="step-number">1</span>
            <h3>Elige tu Café</h3>
            <p>Selecciona de nuestro menú variado de cafés especiales.</p>
          </div>
          <div className="step">
            <span className="step-number">2</span>
            <h3>Ordena en Línea</h3>
            <p>Realiza tu pedido desde nuestra app o sitio web.</p>
          </div>
          <div className="step">
            <span className="step-number">3</span>
            <h3>Recoge y Disfruta</h3>
            <p>Te notificamos cuando esté listo. ¡Pasa y disfruta!</p>
          </div>
        </div>
      </section>


      {/* Llamado a la Acción */}
      <section className="cta-section">
        <h2>¡Empieza tu Experiencia Cafetera!</h2>
        <p>Únete a nuestra comunidad de amantes del café.</p>
        <div className="cta-actions">
          <button className="cta-btn" onClick={() => navigate('/order')}>Crear Cuenta y Ordenar</button>
          <button className="cta-btn secondary" onClick={() => navigate('/login')}>Iniciar Sesión</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 Nxus Café. Todos los derechos reservados.</p>
        <div className="footer-content">
          <div className="social-links">
            <a href="#">Facebook</a>
            <a href="#">Instagram</a>
            <a href="#">Twitter</a>
          </div>
          <button className="admin-btn" onClick={() => navigate('/login')}>Admin</button>
        </div>
      </footer>
    </div>
  );
}
