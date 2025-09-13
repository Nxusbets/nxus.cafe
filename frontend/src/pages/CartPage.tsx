import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="cart-page-container">
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link to="/menu" className="cart-back-menu">Ver menú</Link>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <h1>Carrito</h1>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.map(item => (
            <tr key={item.product.id}>
              <td>{item.product.name}</td>
              <td>${item.product.price.toFixed(2)}</td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateQuantity(item.product.id || '', Math.max(1, Number(e.target.value)))}
                  className="cart-qty-input"
                />
              </td>
              <td>${(item.product.price * item.quantity).toFixed(2)}</td>
              <td>
                <button className="cart-remove-btn" onClick={() => removeFromCart(item.product.id || '')}>
                  Quitar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-total-row">
        <span>Total:</span>
        <span className="cart-total">${total.toFixed(2)}</span>
      </div>
      <div className="cart-actions">
        <button className="cart-clear-btn" onClick={clearCart}>Vaciar carrito</button>
        <button className="cart-checkout-btn" disabled>Finalizar compra</button>
      </div>
      <Link to="/menu" className="cart-back-menu">Seguir comprando</Link>
    </div>
  );
}
