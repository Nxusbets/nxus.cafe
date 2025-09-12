import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import OrderPage from './pages/OrderPage';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import CRM from './pages/CRM';
import WaiterPage from './pages/WaiterPage';

function App() {
  return (
    <AuthProvider>
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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
