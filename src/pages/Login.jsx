import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.setAuth);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authAPI.login(formData);
      setAuth(data.user, data.token);
      toast.success('Welcome back!');
      
      // Role-based redirect
      if (data.user.role === 'seller') {
        navigate('/seller/dashboard');
      } else if (data.user.role === 'rider') {
        navigate('/rider/dashboard');
      } else if (data.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/restaurants');
      }
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.userId) {
        toast.error(errorData.message);
        navigate('/verify-account', { 
          state: { 
            userId: errorData.userId,
            email: formData.email,
            phone: ''
          } 
        });
      } else {
        toast.error(errorData?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-8">
          Welcome to <span className="text-primary">EATOSNAP</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="input-field"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              className="input-field"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
