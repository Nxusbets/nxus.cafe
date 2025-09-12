import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService, type Product as FirebaseProduct } from '../services/databaseService';
import QRScanner from '../components/QRScanner';
import './WaiterPage.css';

interface CartItem {
  product: FirebaseProduct;
  quantity: number;
}

export default function WaiterPage() {
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    loadProducts();
  }, [isAuthenticated, navigate]);

  const loadProducts = async () => {
    try {
      const productsData = await DatabaseService.getProducts();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCartById = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setCart(prevCart => {
        const existing = prevCart.find(item => item.product.id === product.id);
        if (existing) {
          return prevCart.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prevCart, { product, quantity: 1 }];
      });
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleQRScan = (productData: any) => {
    if (productData.productId) {
      addToCartById(productData.productId);
      // Mostrar notificación de éxito
      showNotification(`✅ ${productData.productName} agregado al pedido`, 'success');
    }
  };

  const handleQRScanError = (error: string) => {
    showNotification(`❌ Error: ${error}`, 'error');
  };

  const showNotification = (message: string, type: 'success' | 'error') => {
    // Crear notificación temporal
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  const handleCreateOrder = async () => {
    if (!user) return;

    if (cart.length === 0) {
      showNotification('❌ El pedido está vacío', 'error');
      return;
    }

    if (!customerName.trim()) {
      showNotification('❌ Ingresa el nombre del cliente', 'error');
      return;
    }

    if (!tableNumber.trim()) {
      showNotification('❌ Ingresa el número de mesa', 'error');
      return;
    }

    try {
      const orderItems = cart.map(item => ({
        productId: item.product.id!,
        productName: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        subtotal: item.product.price * item.quantity
      }));

      const total = orderItems.reduce((sum, item) => sum + item.subtotal, 0);

      const orderData = {
        userId: user.id,
        userName: customerName,
        userEmail: user.email,
        items: orderItems,
        total,
        status: 'pending' as const,
        paymentMethod: 'cash' as const,
        notes: `Mesa ${tableNumber}${orderNotes ? ` - ${orderNotes}` : ''}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const orderId = await DatabaseService.createOrder(orderData);

      showNotification(`✅ Pedido creado exitosamente - ID: ${orderId}`, 'success');

      // Limpiar formulario
      setCart([]);
      setCustomerName('');
      setTableNumber('');
      setOrderNotes('');

    } catch (error) {
      console.error('Error creating order:', error);
      showNotification('❌ Error al crear el pedido', 'error');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) {
    return <div className="waiter-page"><div className="loading">Cargando productos...</div></div>;
  }

  return (
    <div className="waiter-page">
      <header className="waiter-header">
        <div className="header-content">
          <h1>🍽️ Panel de Meseros</h1>
          <p>Nxus Café - Gestión de Pedidos</p>
        </div>
        <div className="header-info">
          <span className="user-info">👤 {user?.name}</span>
          <button
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            ← Volver al Dashboard
          </button>
        </div>
      </header>

      <div className="waiter-content">
        <div className="scanner-section">
          <h2>📱 Escáner QR</h2>
          <p>Escanea el código QR del producto para agregarlo al pedido</p>
          <QRScanner
            onScanSuccess={handleQRScan}
            onScanError={handleQRScanError}
          />
        </div>

        <div className="order-section">
          <div className="customer-info">
            <h3>👥 Información del Cliente</h3>
            <div className="info-fields">
              <div className="field-group">
                <label htmlFor="customerName">Nombre del Cliente:</label>
                <input
                  type="text"
                  id="customerName"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div className="field-group">
                <label htmlFor="tableNumber">Número de Mesa:</label>
                <input
                  type="text"
                  id="tableNumber"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ej: 5"
                  required
                />
              </div>
              <div className="field-group">
                <label htmlFor="orderNotes">Notas del Pedido:</label>
                <textarea
                  id="orderNotes"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  placeholder="Ej: Sin azúcar, extra crema..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="current-order">
            <h3>📋 Pedido Actual</h3>
            {cart.length === 0 ? (
              <div className="empty-order">
                <p>🛒 No hay productos en el pedido</p>
                <small>Escanea códigos QR para agregar productos</small>
              </div>
            ) : (
              <>
                <div className="order-items">
                  {cart.map(item => (
                    <div key={item.product.id} className="order-item">
                      <div className="item-info">
                        <h4>{item.product.name}</h4>
                        <p>${item.product.price} c/u</p>
                      </div>
                      <div className="item-controls">
                        <button
                          className="qty-btn"
                          onClick={() => item.product.id && updateQuantity(item.product.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => item.product.id && updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <button
                          className="remove-item-btn"
                          onClick={() => item.product.id && removeFromCart(item.product.id)}
                        >
                          🗑️
                        </button>
                      </div>
                      <div className="item-total">
                        <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total-row">
                    <span><strong>Total:</strong></span>
                    <span><strong>${total.toFixed(2)}</strong></span>
                  </div>
                </div>

                <button
                  className="create-order-btn"
                  onClick={handleCreateOrder}
                  disabled={cart.length === 0 || !customerName.trim() || !tableNumber.trim()}
                >
                  ✅ Crear Pedido
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
