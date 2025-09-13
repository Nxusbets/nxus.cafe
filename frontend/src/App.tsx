import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import OrderPage from './pages/OrderPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import CRM from './pages/CRM';
import WaiterPage from './pages/WaiterPage';
import MenuPage from './pages/MenuPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import MobileNav from './components/MobileNav';


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/order" element={<OrderPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/crm" element={<CRM />} />
            <Route path="/waiter" element={<WaiterPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/product/:productId" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
          <MobileNav />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
