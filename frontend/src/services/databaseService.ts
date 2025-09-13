import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  paymentMethod: 'cash' | 'card' | 'points';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export class DatabaseService {
  // Obtener todos los clientes/usuarios registrados
  static async getCustomers(): Promise<any[]> {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.docs.map(doc => ({
        ...doc.data(),
        uid: doc.id,
        createdAt: doc.data().createdAt?.toDate?.() || new Date(),
        lastLogin: doc.data().lastLogin?.toDate?.() || new Date(),
      }));
    } catch (error) {
      console.error('Error getting customers:', error);
      return [];
    }
  }
  // Products CRUD operations
  static async getProducts(): Promise<Product[]> {
    try {
      const productsRef = collection(db, 'products');
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Product[];
    } catch (error) {
      console.error('Error getting products:', error);
      return [];
    }
  }

  static async getProduct(id: string): Promise<Product | null> {
    try {
      const docRef = doc(db, 'products', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Product;
      }
      return null;
    } catch (error) {
      console.error('Error getting product:', error);
      return null;
    }
  }

  static async addProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const productData = {
        ...product,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'products'), productData);
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Error al agregar producto');
    }
  }

  static async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Error al actualizar producto');
    }
  }

  static async deleteProduct(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Error al eliminar producto');
    }
  }

  // Orders CRUD operations
  static async getOrders(): Promise<Order[]> {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(ordersRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      })) as Order[];
    } catch (error) {
      console.error('Error getting orders:', error);
      return [];
    }
  }

  static async getUserOrders(userId: string): Promise<Order[]> {
    try {
      const ordersRef = collection(db, 'orders');
      // Simplificamos la consulta para que funcione sin índice compuesto
      const q = query(
        ordersRef,
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      // Ordenamos los resultados en el cliente
      return querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate()
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) as Order[];
    } catch (error) {
      console.error('Error getting user orders:', error);
      return [];
    }
  }

  static async getOrder(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
          createdAt: docSnap.data().createdAt?.toDate(),
          updatedAt: docSnap.data().updatedAt?.toDate()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  static async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const now = new Date();
      const orderData = {
        ...order,
        createdAt: now,
        updatedAt: now
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new Error('Error al crear pedido');
    }
  }

  static async updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, {
        status,
        updatedAt: new Date()
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw new Error('Error al actualizar estado del pedido');
    }
  }

  // Analytics methods
  static async getTotalSales(): Promise<number> {
    try {
      const orders = await this.getOrders();
      return orders
        .filter(order => order.status !== 'cancelled')
        .reduce((total, order) => total + order.total, 0);
    } catch (error) {
      console.error('Error getting total sales:', error);
      return 0;
    }
  }

  static async getTotalOrders(): Promise<number> {
    try {
      const orders = await this.getOrders();
      return orders.length;
    } catch (error) {
      console.error('Error getting total orders:', error);
      return 0;
    }
  }

  static async getTotalCustomers(): Promise<number> {
    try {
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting total customers:', error);
      return 0;
    }
  }

  // Points History
  static async getPointsHistory(userId: string): Promise<Array<{
    id: string;
    date: Date;
    description: string;
    points: number;
    type: 'earn' | 'redeem';
  }>> {
    try {
      const pointsRef = collection(db, 'pointsHistory');
      const q = query(
        pointsRef,
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs
        .map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            date: data.date?.toDate() || new Date(),
            description: data.description || '',
            points: data.points || 0,
            type: data.type as 'earn' | 'redeem',
          };
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime());
    } catch (error) {
      console.error('Error getting points history:', error);
      return [];
    }
  }
}
