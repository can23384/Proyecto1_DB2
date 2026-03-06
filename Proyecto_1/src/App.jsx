import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RestaurantDetailPage from './pages/RestaurantDetailPage';
import OrderPage from './pages/OrderPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/restaurante/:id" element={<RestaurantDetailPage />} />
      <Route path="/restaurante/:id/ordenar" element={<OrderPage />} />
    </Routes>
  );
}
