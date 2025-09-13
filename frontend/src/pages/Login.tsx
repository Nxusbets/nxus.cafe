import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      // If the logged-in email is the special admin email, redirect to CRM
      if (formData.email && formData.email.trim().toLowerCase() === 'jericho888873@gmail.com') {
        navigate('/crm');
      } else {
        navigate('/user-dashboard');
      }
    } catch (error: any) {
      alert(error.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🍵 Iniciar Sesión</h1>
          <p>Bienvenido de vuelta a Nxus Café</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Tu contraseña"
            />
          </div>

          <button
            type="submit"
            className="auth-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-links">
          <p>¿No tienes cuenta? <a href="#" onClick={() => navigate('/register')}>Regístrate aquí</a></p>
          <p><a href="#" onClick={() => navigate('/forgot-password')}>¿Olvidaste tu contraseña?</a></p>
        </div>

        <div className="auth-footer">
          <button
            className="guest-btn"
            onClick={() => navigate('/order')}
          >
            Continuar como invitado
          </button>
        </div>
      </div>
    </div>
  );
}
