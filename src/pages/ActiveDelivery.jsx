import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import locationService from '../services/locationService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ActiveDelivery() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  useEffect(() => {
    fetchOrder();
    return () => locationService.stopTracking();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(data.order);
    } catch (error) {
      console.error(error);
    }
  };

  const startTracking = () => {
    locationService.startTracking(orderId);
    setIsTracking(true);
  };

  const stopTracking = () => {
    locationService.stopTracking();
    setIsTracking(false);
  };

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/riders/update-delivery-status/${orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Status updated to ${status}`);
      fetchOrder();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (!order) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Active Delivery</h1>
          
          <div className="space-y-2">
            <p><span className="font-semibold">Order ID:</span> #{order._id.slice(-6)}</p>
            <p><span className="font-semibold">Restaurant:</span> {order.restaurant?.name}</p>
            <p><span className="font-semibold">Customer:</span> {order.user?.name}</p>
            <p><span className="font-semibold">Amount:</span> ₹{order.totalAmount}</p>
            <p><span className="font-semibold">Your Earning:</span> ₹{order.riderEarnings}</p>
            <p><span className="font-semibold">Status:</span> {order.riderStatus}</p>
          </div>

          <div className="mt-6 space-y-3">
            {!isTracking ? (
              <button
                onClick={startTracking}
                className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold"
              >
                Start Live Tracking
              </button>
            ) : (
              <button
                onClick={stopTracking}
                className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold"
              >
                Stop Tracking
              </button>
            )}

            {order.riderStatus === 'accepted' && (
              <button
                onClick={() => updateStatus('picked_up')}
                className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold"
              >
                Mark as Picked Up
              </button>
            )}

            {order.riderStatus === 'picked_up' && (
              <button
                onClick={() => updateStatus('delivered')}
                className="w-full bg-purple-500 text-white py-3 rounded-lg font-semibold"
              >
                Mark as Delivered
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-bold mb-4">Delivery Address</h2>
          <p className="text-gray-600">{order.deliveryAddress?.street}</p>
          <p className="text-gray-600">
            {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
          </p>
        </div>
      </div>
    </div>
  );
}
