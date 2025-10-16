import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function RiderDashboard() {
  const [rider, setRider] = useState(null);
  const [orders, setOrders] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiderProfile();
    fetchAvailableOrders();
  }, []);

  const fetchRiderProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/riders/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRider(data.rider);
      setIsActive(data.rider.isActive);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const fetchAvailableOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/riders/available-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data.orders);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleActive = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.put(
        `${API_URL}/riders/toggle-active`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsActive(data.rider.isActive);
      alert(data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to toggle status');
    }
  };

  const acceptOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/riders/accept-order/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order accepted!');
      fetchAvailableOrders();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to accept order');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Rider Dashboard</h1>
              <p className="text-gray-600">Total Earnings: ₹{rider?.totalEarnings || 0}</p>
              <p className="text-gray-600">Completed: {rider?.completedDeliveries || 0} deliveries</p>
            </div>
            <button
              onClick={toggleActive}
              className={`px-6 py-2 rounded-lg font-semibold ${
                isActive ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
              }`}
            >
              {isActive ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Available Orders</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500">No orders available</p>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-semibold">Order #{order._id.slice(-6)}</p>
                      <p className="text-sm text-gray-600">Restaurant: {order.restaurant?.name}</p>
                      <p className="text-sm text-gray-600">Restaurant Phone: {order.restaurant?.phone}</p>
                      <p className="text-sm text-gray-600">Customer: {order.user?.name}</p>
                      <p className="text-sm text-gray-600">Customer Phone: {order.user?.phone}</p>
                      <p className="text-sm text-gray-600">Amount: ₹{order.totalAmount}</p>
                      <p className="text-sm text-green-600 font-semibold">Your Earning: ₹{order.riderEarnings}</p>
                    </div>
                    <button
                      onClick={() => acceptOrder(order._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
