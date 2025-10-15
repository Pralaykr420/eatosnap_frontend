import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold">
              <span className="text-primary">EATO</span>
              <span className="text-secondary">SNAP</span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link to="/restaurants" className="text-dark hover:text-primary transition">
              Restaurants
            </Link>
            <Link to="/reels" className="text-dark hover:text-primary transition">
              Reels
            </Link>
            {isAuthenticated && user?.role === 'seller' && (
              <Link to="/seller/dashboard" className="text-dark hover:text-primary transition">
                Dashboard
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'user' && (
                  <Link to="/cart" className="relative">
                    <FiShoppingCart className="text-2xl text-dark hover:text-primary transition" />
                    {items.length > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {items.length}
                      </span>
                    )}
                  </Link>
                )}
                <Link to="/orders">
                  <FiUser className="text-2xl text-dark hover:text-primary transition" />
                </Link>
                <button onClick={handleLogout}>
                  <FiLogOut className="text-2xl text-dark hover:text-primary transition" />
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-dark hover:text-primary transition font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
