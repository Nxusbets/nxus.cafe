// ...existing code...

export default function AnalyticsSection() {
  return (
    <div className="analytics-content">
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Ventas por Día</h3>
          <div className="chart-placeholder">📊 Gráfico de ventas</div>
        </div>
        <div className="analytics-card">
          <h3>Productos Más Vendidos</h3>
          <div className="chart-placeholder">🥧 Gráfico de productos</div>
        </div>
        <div className="analytics-card">
          <h3>Clientes por Mes</h3>
          <div className="chart-placeholder">📈 Gráfico de clientes</div>
        </div>
        <div className="analytics-card">
          <h3>Ingresos Mensuales</h3>
          <div className="chart-placeholder">💰 Gráfico de ingresos</div>
        </div>
      </div>
    </div>
  );
}
