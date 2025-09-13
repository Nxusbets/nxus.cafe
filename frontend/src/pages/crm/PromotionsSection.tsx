// ...existing code...

export default function PromotionsSection() {
  return (
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
  );
}
