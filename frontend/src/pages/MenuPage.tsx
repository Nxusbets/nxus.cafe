import { useEffect, useState } from 'react';
import { DatabaseService, type Product } from '../services/databaseService';
import QRCode from '../components/QRCode';
import './MenuPage.css';

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    DatabaseService.getProducts().then(list => {
      if (mounted) setProducts(list);
    }).finally(() => setLoading(false));
    return () => { mounted = false; };
  }, []);

  return (
    <div className="menu-page-container">
      <h1>Menú Completo</h1>
      <div className="menu-products-grid">
        {loading ? (
          <div style={{padding:'2rem',textAlign:'center'}}>Cargando productos...</div>
        ) : products.length === 0 ? (
          <div style={{padding:'2rem',textAlign:'center',color:'#888'}}>No hay productos registrados.</div>
        ) : products.map(product => (
          <div key={product.id} className="menu-product-card">
            <div className="menu-product-info">
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <div className="menu-product-meta">
                <span className="menu-product-price">${product.price.toFixed(2)}</span>
                <span className="menu-product-category">{product.category}</span>
                <span className="menu-product-stock">Stock: {product.stock}</span>
              </div>
            </div>
            <div className="menu-product-qr">
              <QRCode productId={product.id || ''} productName={product.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
