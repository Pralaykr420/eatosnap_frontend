import { useState, useEffect } from 'react';
import { restaurantAPI, productAPI, orderAPI } from '../services/api';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState('restaurants');
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [restaurantsRes, productsRes, ordersRes] = await Promise.all([
        restaurantAPI.getAll(),
        productAPI.getAll(),
        orderAPI.getAll(),
      ]);
      setRestaurants(restaurantsRes.data.restaurants);
      setProducts(productsRes.data.products);
      setOrders(ordersRes.data.orders);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'restaurants', label: 'My Restaurants' },
    { id: 'products', label: 'Menu Items' },
    { id: 'orders', label: 'Orders' },
  ];

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Seller Dashboard</h1>

        <div className="flex gap-4 mb-6 border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 font-semibold transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'restaurants' && (
          <div>
            <button className="btn-primary mb-6 flex items-center gap-2">
              <FiPlus /> Add Restaurant
            </button>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {restaurants.map(restaurant => (
                <div key={restaurant._id} className="card p-4">
                  <h3 className="font-bold text-lg mb-2">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
                  <div className="flex gap-2">
                    <button className="btn-outline flex-1 flex items-center justify-center gap-1">
                      <FiEdit /> Edit
                    </button>
                    <button className="text-red-500 px-4">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {restaurants.length === 0 && (
              <div className="text-center py-20 text-gray-500">No restaurants yet</div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <button className="btn-primary mb-6 flex items-center gap-2">
              <FiPlus /> Add Menu Item
            </button>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map(product => (
                <div key={product._id} className="card p-4">
                  <h3 className="font-bold mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <p className="text-primary font-bold mb-3">₹{product.price}</p>
                  <div className="flex gap-2">
                    <button className="btn-outline flex-1 flex items-center justify-center gap-1">
                      <FiEdit /> Edit
                    </button>
                    <button className="text-red-500 px-4">
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {products.length === 0 && (
              <div className="text-center py-20 text-gray-500">No menu items yet</div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold">Order #{order._id.slice(-6)}</h3>
                    <p className="text-sm text-gray-600">{order.user?.name}</p>
                  </div>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                    {order.orderStatus}
                  </span>
                </div>
                <div className="space-y-1 mb-3">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      {item.name} x {item.quantity}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="font-bold">₹{order.total}</span>
                  <button className="btn-primary">Update Status</button>
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <div className="text-center py-20 text-gray-500">No orders yet</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
