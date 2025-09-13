import React, { useState, useEffect } from 'react';

export default function NewProductForm({ onSave, onCancel, initialData }: { onSave: (product: any) => void, onCancel: () => void, initialData?: any }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [image, setImage] = useState(initialData?.image || '');
  const [stock, setStock] = useState(initialData?.stock?.toString() || '');
  const [available, setAvailable] = useState(initialData?.available ?? true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initialData?.name || '');
    setDescription(initialData?.description || '');
    setPrice(initialData?.price?.toString() || '');
    setCategory(initialData?.category || '');
    setImage(initialData?.image || '');
    setStock(initialData?.stock?.toString() || '');
    setAvailable(initialData?.available ?? true);
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSave({
      name,
      description,
      price: Number(price),
      category,
      image,
      available,
      stock: Number(stock)
    });
    setLoading(false);
  };

  return (
    <form className="new-product-form" onSubmit={handleSubmit} style={{background:'#fff',padding:'2rem',borderRadius:'1rem',boxShadow:'0 4px 16px rgba(44,62,80,0.08)',maxWidth:400,margin:'2rem auto'}}>
      <h2>{initialData ? 'Editar Producto' : 'Agregar Nuevo Producto'}</h2>
      <div style={{marginBottom:'1rem'}}>
        <label style={{color:'#222'}}>Nombre</label>
        <input value={name} onChange={e=>setName(e.target.value)} required style={{width:'100%',color:'#222',background:'#fff'}} />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label style={{color:'#222'}}>Descripción</label>
        <input value={description} onChange={e=>setDescription(e.target.value)} style={{width:'100%',color:'#222',background:'#fff'}} />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label style={{color:'#222'}}>Precio</label>
        <input type="number" value={price} onChange={e=>setPrice(e.target.value)} required min={0} style={{width:'100%',color:'#222',background:'#fff'}} />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label style={{color:'#222'}}>Categoría</label>
        <input value={category} onChange={e=>setCategory(e.target.value)} required style={{width:'100%',color:'#222',background:'#fff'}} />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label style={{color:'#222'}}>Imagen (URL)</label>
        <input value={image} onChange={e=>setImage(e.target.value)} style={{width:'100%',color:'#222',background:'#fff'}} />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label style={{color:'#222'}}>Stock</label>
        <input type="number" value={stock} onChange={e=>setStock(e.target.value)} required min={0} style={{width:'100%',color:'#222',background:'#fff'}} />
      </div>
      <div style={{marginBottom:'1rem'}}>
        <label style={{color:'#222'}}>
          <input type="checkbox" checked={available} onChange={e=>setAvailable(e.target.checked)} /> Disponible
        </label>
      </div>
      <div style={{display:'flex',gap:'1rem',justifyContent:'flex-end'}}>
        <button type="button" onClick={onCancel} style={{background:'#eee',border:'none',padding:'0.5rem 1rem',borderRadius:'0.5rem',color:'#222'}}>Cancelar</button>
        <button type="submit" disabled={loading} style={{background:'#27ae60',color:'#fff',border:'none',padding:'0.5rem 1.5rem',borderRadius:'0.5rem',fontWeight:600}}>{loading ? 'Guardando...' : (initialData ? 'Guardar Cambios' : 'Guardar')}</button>
      </div>
    </form>
  );
}
