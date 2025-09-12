import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

export const sampleProducts = [
  {
    name: 'Espresso Clásico',
    description: 'Café espresso intenso y aromático, preparado con granos 100% arábica premium de origen único.',
    price: 35,
    category: 'Café',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400',
    available: true,
    stock: 50
  },
  {
    name: 'Americano',
    description: 'Espresso diluido con agua caliente, perfecto para un boost de energía matutino.',
    price: 30,
    category: 'Café',
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=400',
    available: true,
    stock: 60
  },
  {
    name: 'Latte Vainilla',
    description: 'Delicioso latte con leche vaporizada y sirope de vainilla natural casero.',
    price: 45,
    category: 'Café con Leche',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400',
    available: true,
    stock: 40
  },
  {
    name: 'Cappuccino Italiano',
    description: 'Clásico cappuccino italiano con leche espumosa y cacao en polvo.',
    price: 42,
    category: 'Café con Leche',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400',
    available: true,
    stock: 45
  },
  {
    name: 'Frappé de Caramelo',
    description: 'Bebida fría con café, hielo, leche y delicioso caramelo salado.',
    price: 55,
    category: 'Bebidas Frías',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400',
    available: true,
    stock: 35
  },
  {
    name: 'Cheesecake de Fresa',
    description: 'Delicioso cheesecake con fresas frescas de temporada y base de galleta crujiente.',
    price: 65,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400',
    available: true,
    stock: 20
  },
  {
    name: 'Red Velvet Cake',
    description: 'Bizcocho rojo con frosting de queso crema, una delicia irresistible.',
    price: 58,
    category: 'Postres',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400',
    available: true,
    stock: 15
  },
  {
    name: 'Croissant de Almendras',
    description: 'Croissant artesanal relleno de almendras y bañado en azúcar glass.',
    price: 38,
    category: 'Repostería',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
    available: true,
    stock: 25
  },
  {
    name: 'Té Verde Matcha',
    description: 'Té verde matcha premium con leche de almendras y miel orgánica.',
    price: 48,
    category: 'Tés Especiales',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400',
    available: true,
    stock: 30
  },
  {
    name: 'Smoothie de Mango',
    description: 'Smoothie refrescante con mango fresco, yogurt griego natural y miel.',
    price: 52,
    category: 'Bebidas Saludables',
    image: 'https://images.unsplash.com/photo-1553909489-ec217ac8f3a5?w=400',
    available: true,
    stock: 28
  },
  {
    name: 'Muffin de Chocolate',
    description: 'Muffin esponjoso con chips de chocolate belga y nueces caramelizadas.',
    price: 32,
    category: 'Repostería',
    image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400',
    available: true,
    stock: 22
  },
  {
    name: 'Café Mocha',
    description: 'Latte con chocolate intenso y crema batida, perfecto para los amantes del chocolate.',
    price: 50,
    category: 'Café con Leche',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    available: true,
    stock: 38
  }
];

export const populateProducts = async () => {
  try {
    console.log('🌱 Poblando productos en Firebase...');

    // Verificar si ya existen productos
    const existingProducts = await fetchExistingProducts();
    if (existingProducts.length > 0) {
      console.log(`⚠️ Ya existen ${existingProducts.length} productos. ¿Deseas continuar?`);
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    for (const product of sampleProducts) {
      try {
        const productData = {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        await addDoc(collection(db, 'products'), productData);
        successCount++;
        console.log(`✅ ${product.name} agregado`);
      } catch (error) {
        errorCount++;
        console.error(`❌ Error agregando ${product.name}:`, error);
      }
    }

    console.log(`\n🎉 Proceso completado:`);
    console.log(`✅ Productos agregados: ${successCount}`);
    console.log(`❌ Errores: ${errorCount}`);
    console.log(`📊 Total productos disponibles: ${sampleProducts.length}`);

  } catch (error) {
    console.error('❌ Error general:', error);
  }
};

const fetchExistingProducts = async () => {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const querySnapshot = await getDocs(collection(db, 'products'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error verificando productos existentes:', error);
    return [];
  }
};

// Función para ejecutar desde la consola del navegador
if (typeof window !== 'undefined') {
  (window as any).populateProducts = populateProducts;
  console.log('🚀 Función populateProducts() disponible en la consola');
  console.log('💡 Ejecuta: populateProducts() para poblar la base de datos');
  console.log('📝 Productos disponibles:', sampleProducts.length);
}
