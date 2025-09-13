import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DatabaseService, type Product } from '../services/databaseService';
import { useCart } from '../contexts/CartContext';
import './ProductPage.css';

export default function ProductPage() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    DatabaseService.getProduct(productId).then((p: Product | null) => {
      setProduct(p || null);
    }).finally(() => setLoading(false));
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="product-page-container">Cargando producto...</div>;
  if (!product) return <div className="product-page-container">Producto no encontrado.</div>;

  return (
    <div className="product-page-container">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <div className="product-meta">
        <span className="product-price">${product.price.toFixed(2)}</span>
        <span className="product-category">{product.category}</span>
        <span className="product-stock">Stock: {product.stock}</span>
      </div>
      <button className="add-to-cart-btn" onClick={handleAddToCart} disabled={added}>
        {added ? 'Agregado!' : 'Agregar al carrito'}
      </button>
    </div>
  );
}
