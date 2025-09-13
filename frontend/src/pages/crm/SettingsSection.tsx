// ...existing code...

export default function SettingsSection() {
  return (
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
  );
}
