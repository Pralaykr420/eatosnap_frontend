import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyAccount from './pages/VerifyAccount';
import Restaurants from './pages/Restaurants';
import RestaurantDetail from './pages/RestaurantDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Reels from './pages/Reels';
import SellerDashboard from './pages/SellerDashboard';
import RiderDashboard from './pages/RiderDashboard';
import OrderTracking from './pages/OrderTracking';
import OffersManagement from './pages/OffersManagement';
import AdminDashboard from './pages/AdminDashboard';
import SocialReels from './pages/SocialReels';
import RestaurantRegistration from './pages/RestaurantRegistration';
import RiderRegistration from './pages/RiderRegistration';
import ActiveDelivery from './pages/ActiveDelivery';

const ProtectedRoute = ({ children, sellerOnly = false, riderOnly = false, adminOnly = false }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (sellerOnly && user?.role !== 'seller') return <Navigate to="/" />;
  if (riderOnly && user?.role !== 'rider') return <Navigate to="/" />;
  if (adminOnly && user?.role !== 'admin') return <Navigate to="/" />;

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-account" element={<VerifyAccount />} />
        <Route path="/restaurants" element={<Restaurants />} />
        <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        <Route path="/reels" element={<Reels />} />
        <Route path="/social-reels" element={<SocialReels />} />
        <Route
          path="/seller/register-restaurant"
          element={
            <ProtectedRoute sellerOnly>
              <RestaurantRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rider/register"
          element={
            <ProtectedRoute riderOnly>
              <RiderRegistration />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rider/delivery/:orderId"
          element={
            <ProtectedRoute riderOnly>
              <ActiveDelivery />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/dashboard"
          element={
            <ProtectedRoute sellerOnly>
              <SellerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rider/dashboard"
          element={
            <ProtectedRoute riderOnly>
              <RiderDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:orderId/track"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/offers"
          element={
            <ProtectedRoute sellerOnly>
              <OffersManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
