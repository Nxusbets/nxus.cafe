import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CRM.css';
import { DatabaseService, type Order as DBOrder, type Product } from '../services/databaseService';
import DashboardSection from './crm/DashboardSection';
import OrdersSection from './crm/OrdersSection';
import CustomersSection from './crm/CustomersSection';
import ProductsSection from './crm/ProductsSection';
import InventorySection from './crm/InventorySection';
import AnalyticsSection from './crm/AnalyticsSection';
import PromotionsSection from './crm/PromotionsSection';
import SettingsSection from './crm/SettingsSection';
import NewProductForm from './crm/NewProductForm';
import Sidebar from '../components/crm/Sidebar';
import Header from '../components/crm/Header';
export default function CRM() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');


  // Estado para productos y formulario
  const [products, setProducts] = useState<Product[]>([]);
  const [showNewProduct, setShowNewProduct] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Cargar productos al entrar a la sección
  useEffect(() => {
    if (activeSection !== 'products') return;
    let mounted = true;
    setLoadingProducts(true);
    DatabaseService.getProducts().then(list => {
      if (mounted) setProducts(list);
    }).finally(() => { if (mounted) setLoadingProducts(false); });
    return () => { mounted = false; };
  }, [activeSection]);

  // Guardar o editar producto en base de datos y actualizar lista
  const handleSaveProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, idToEdit?: string) => {
    try {
      if (idToEdit) {
        await DatabaseService.updateProduct(idToEdit, product);
        setProducts(prev => prev.map(p => p.id === idToEdit ? { ...p, ...product, updatedAt: new Date() } : p));
      } else {
        const id = await DatabaseService.addProduct(product);
        setProducts(prev => [{ ...product, id, createdAt: new Date(), updatedAt: new Date() }, ...prev]);
      }
      setShowNewProduct(false);
    } catch (err) {
      alert('Error al guardar producto');
    }
  };


interface Metric {
  title: string;
  value: string;
  change: string;
  icon: string;
  color: string;
}

const [metrics, setMetrics] = useState<Metric[]>([{
  title: 'Ventas del Día', value: '...', change: '', icon: '💰', color: '#4caf50'
}, {
  title: 'Pedidos Hoy', value: '...', change: '', icon: '📦', color: '#2196f3'
}, {
  title: 'Clientes Activos', value: '...', change: '', icon: '👥', color: '#ff9800'
}, {
  title: 'Productos Vendidos', value: '...', change: '', icon: '☕', color: '#9c27b0'
}]);

// Cargar métricas reales
useEffect(() => {
  let mounted = true;
  async function loadMetrics() {
    // Ventas del día
    const today = new Date();
    today.setHours(0,0,0,0);
    const orders = await DatabaseService.getOrders();
    const todayOrders = orders.filter(o => o.createdAt && o.createdAt >= today);
    const ventasDia = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    // Pedidos hoy
    const pedidosHoy = todayOrders.length;
    // Clientes activos (con pedidos hoy)
    const clientesHoy = new Set(todayOrders.map(o => o.userId)).size;
    // Productos vendidos hoy
    const productosVendidos = todayOrders.reduce((sum, o) => sum + (o.items ? o.items.reduce((s, i) => s + (i.quantity || 0), 0) : 0), 0);

    if (mounted) setMetrics([
      {
        title: 'Ventas del Día',
        value: `$${ventasDia}`,
        change: '',
        icon: '💰',
        color: '#4caf50'
      },
      {
        title: 'Pedidos Hoy',
        value: `${pedidosHoy}`,
        change: '',
        icon: '📦',
        color: '#2196f3'
      },
      {
        title: 'Clientes Activos',
        value: `${clientesHoy}`,
        change: '',
        icon: '👥',
        color: '#ff9800'
      },
      {
        title: 'Productos Vendidos',
        value: `${productosVendidos}`,
        change: '',
        icon: '☕',
        color: '#9c27b0'
      }
    ]);
  }
  loadMetrics();
  // refrescar cada 10s igual que pedidos
  const interval = setInterval(loadMetrics, 10000);
  return () => { mounted = false; clearInterval(interval); };
}, []);

  const [recentOrders, setRecentOrders] = useState<DBOrder[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingOrders(true);
      try {
        const orders = await DatabaseService.getOrders();
        if (mounted) setRecentOrders(orders as DBOrder[]);
      } catch (err) {
        console.error('Error loading orders for CRM:', err);
      } finally {
        if (mounted) setLoadingOrders(false);
      }
    };

    load();

    // simple polling every 10s to keep orders fresh
    const interval = setInterval(load, 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#ff9800';
      case 'preparing': return '#ff9800';
      case 'ready': return '#4caf50';
      case 'delivered': return '#2196f3';
      case 'cancelled': return '#9e9e9e';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '⏳ Pendiente';
      case 'preparing': return '⏳ Preparando';
      case 'ready': return '✅ Listo';
      case 'delivered': return '🚶‍♂️ Entregado';
      case 'cancelled': return '🚫 Cancelado';
      default: return status;
    }
  };

  const updateOrderStatus = async (orderId: string | undefined, status: DBOrder['status']) => {
    if (!orderId) return;
    try {
      await DatabaseService.updateOrderStatus(orderId, status);
      // optimistic refresh
      setRecentOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status } : o)));
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('No se pudo actualizar el estado del pedido');
    }
  };

  const formatItems = (items: DBOrder['items']) => {
    if (!items || items.length === 0) return '';
    return items.map(i => `${i.productName} x${i.quantity}`).join(', ');
  };

  const formatTimeAgo = (date?: Date) => {
    if (!date) return '';
    const diff = (new Date().getTime() - new Date(date).getTime()) / 1000; // seconds
    if (diff < 60) return `${Math.floor(diff)}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  return (
    <div className="crm-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} navigate={navigate} />
      <main className="crm-main">
        <Header activeSection={activeSection} />
        <div className="crm-content">
          {activeSection === 'dashboard' && (
            <DashboardSection
              metrics={metrics}
              recentOrders={recentOrders}
              loadingOrders={loadingOrders}
              formatItems={formatItems}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatTimeAgo={formatTimeAgo}
              updateOrderStatus={updateOrderStatus}
            />
          )}

          {activeSection === 'orders' && (
            <OrdersSection
              recentOrders={recentOrders}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              formatItems={formatItems}
              formatTimeAgo={formatTimeAgo}
              updateOrderStatus={updateOrderStatus}
            />
          )}

          {activeSection === 'customers' && <CustomersSection />}

          {activeSection === 'products' && (
            <ProductsSection
              products={products}
              loadingProducts={loadingProducts}
              showNewProduct={showNewProduct}
              setShowNewProduct={setShowNewProduct}
              NewProductForm={NewProductForm}
              handleSaveProduct={handleSaveProduct}
            />
          )}
          {activeSection === 'inventory' && <InventorySection />}

          {activeSection === 'analytics' && <AnalyticsSection />}

          {activeSection === 'promotions' && <PromotionsSection />}

          {activeSection === 'settings' && <SettingsSection />}
        </div>
      </main>
    </div>
  );
}
