import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import OrderPage from './pages/OrderPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OwnerPage from './pages/OwnerPage';
import AddRestaurantPage from './pages/AddRestaurantPage';
import RestaurantOrdersPage from './pages/RestaurantOrdersPage';
import RestaurantMenuPage from './pages/RestaurantMenuPage';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/iniciar-sesion" element={<LoginPage />} />
      <Route path="/registrarse" element={<RegisterPage />} />

      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={['usuario', 'cliente']}>
            <HomePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/restaurante/:id"
        element={
          <ProtectedRoute allowedRoles={['usuario', 'cliente']}>
            <RestaurantDetailPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/restaurante/:id/ordenar"
        element={
          <ProtectedRoute allowedRoles={['usuario', 'cliente']}>
            <OrderPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/nuevo-restaurante"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <AddRestaurantPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/restaurante/:id/ordenes"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <RestaurantOrdersPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/owner/restaurante/:id/menu"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <RestaurantMenuPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}