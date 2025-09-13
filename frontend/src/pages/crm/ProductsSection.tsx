
import { useState } from 'react';

export default function ProductsSection({ products, loadingProducts, showNewProduct, setShowNewProduct, NewProductForm, handleSaveProduct }: any) {
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  return (
    <div className="products-management">
      <div className="management-header">
        <button className="add-product-btn" onClick={() => { setShowNewProduct(true); setEditingProduct(null); }}>➕ Nuevo Producto</button>
      </div>
      {(showNewProduct || editingProduct) && (
        <NewProductForm
          onSave={(product: any) => {
            handleSaveProduct(product, editingProduct?.id);
            setEditingProduct(null);
            setShowNewProduct(false);
          }}
          onCancel={() => { setShowNewProduct(false); setEditingProduct(null); }}
          initialData={editingProduct}
        />
      )}
      <div className="products-grid">
        {loadingProducts ? (
          <div style={{padding:'2rem',textAlign:'center'}}>Cargando productos...</div>
        ) : products.length === 0 ? (
          <div style={{padding:'2rem',textAlign:'center',color:'#888'}}>No hay productos registrados.</div>
        ) : products.map((product: any) => (
          <div key={product.id} className="product-card-admin">
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} style={{width:48,height:48,objectFit:'cover',borderRadius:'0.5rem'}} />
              ) : '☕'}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <span className={`stock-badge${product.stock <= 5 ? ' low' : ''}`}>Stock: {product.stock}</span>
            </div>
            <div className="product-actions">
              <button className="action-btn" onClick={() => { setEditingProduct(product); setShowNewProduct(false); }}>✏️ Editar</button>
              <button className="action-btn">📊 Ventas</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
