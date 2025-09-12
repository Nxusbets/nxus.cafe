import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DatabaseService, type Product as FirebaseProduct } from '../services/databaseService';
import QRCodeComponent from '../components/QRCode';
import QRScanner from '../components/QRScanner';
import './OrderPage.css';

interface CartItem {
  product: FirebaseProduct;
  quantity: number;
}

export default function OrderPage() {
  const [products, setProducts] = useState<FirebaseProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, updateUser } = useAuth();

  useEffect(() => {
    loadProducts();
  }, []);

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

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const addToCart = (product: FirebaseProduct) => {
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
  };

  const addToCartById = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      addToCart(product);
    }
  };

  const handleQRScan = (productData: any) => {
    if (productData.productId) {
      addToCartById(productData.productId);
      // Mostrar notificación de éxito
      alert(`✅ ${productData.productName} agregado al carrito`);
    }
  };

  const handleQRScanError = (error: string) => {
    console.error('Error scanning QR:', error);
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

  const handleCheckout = async () => {
    if (!isAuthenticated || !user) {
      alert('Debes iniciar sesión para realizar un pedido');
      navigate('/login');
      return;
    }

    if (cart.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    setCheckoutLoading(true);

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
        userName: user.name,
        userEmail: user.email,
        items: orderItems,
        total,
        status: 'pending' as const,
        paymentMethod: 'cash' as const,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const orderId = await DatabaseService.createOrder(orderData);

      // Award points (1 point per $10 spent)
      const pointsEarned = Math.floor(total / 10);
      if (pointsEarned > 0 && updateUser) {
        await updateUser({ points: user.points + pointsEarned });
      }

      alert(`¡Pedido creado exitosamente! ID: ${orderId}\nPuntos ganados: ${pointsEarned}`);
      setCart([]);
      navigate('/user-dashboard');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error al crear el pedido. Inténtalo de nuevo.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (loading) {
    return <div className="order-page"><div className="loading">Cargando productos...</div></div>;
  }

  return (
    <div className="order-page">
      <header className="order-header">
        <div className="header-content">
          <h1>🍵 Menú Nxus Café</h1>
          <p>Selecciona tus productos favoritos</p>
        </div>
        <div className="header-actions">
          <button
            className="qr-scan-btn"
            onClick={() => setShowQRScanner(!showQRScanner)}
          >
            📱 {showQRScanner ? 'Ocultar Escáner' : 'Escanear QR'}
          </button>
        </div>
      </header>

      <div className="order-content">
        <div className="products-section">
          <div className="category-filter">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">${product.price}</p>
                </div>
                <div className="product-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(product)}
                    disabled={!product.available || product.stock <= 0}
                  >
                    {product.available && product.stock > 0 ? 'Agregar' : 'Agotado'}
                  </button>
                  {product.id && (
                    <QRCodeComponent
                      productId={product.id}
                      productName={product.name}
                      size={80}
                      className="product-qr"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {showQRScanner && (
          <div className="qr-scanner-section">
            <QRScanner
              onScanSuccess={handleQRScan}
              onScanError={handleQRScanError}
            />
          </div>
        )}

        <div className="cart-section">
          <h2>🛒 Tu Pedido</h2>
          {cart.length === 0 ? (
            <p className="empty-cart">Tu carrito está vacío</p>
          ) : (
            <>
              <div className="cart-items">
                {cart.map(item => (
                  <div key={item.product.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.product.name}</h4>
                      <p>${item.product.price} x {item.quantity}</p>
                    </div>
                    <div className="cart-item-controls">
                      <button
                        className="quantity-btn"
                        onClick={() => item.product.id && updateQuantity(item.product.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="quantity-btn"
                        onClick={() => item.product.id && updateQuantity(item.product.id, item.quantity + 1)}
                      >
                        +
                      </button>
                      <button
                        className="remove-btn"
                        onClick={() => item.product.id && removeFromCart(item.product.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="cart-total">
                <h3>Total: ${total}</h3>
                <button
                  className="checkout-btn"
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cart.length === 0}
                >
                  {checkoutLoading ? 'Procesando...' : 'Confirmar Pedido'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
