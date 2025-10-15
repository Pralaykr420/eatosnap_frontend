import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [riderLocation, setRiderLocation] = useState(null);

  useEffect(() => {
    fetchOrder();

    const socket = io(SOCKET_URL);
    socket.emit('join-order', orderId);

    socket.on('order-status-changed', (data) => {
      if (data.orderId === orderId) {
        setOrder((prev) => ({ ...prev, orderStatus: data.status }));
      }
    });

    socket.on('rider-location-changed', (data) => {
      if (data.orderId === orderId) {
        setRiderLocation(data.location);
      }
    });

    return () => socket.disconnect();
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

  if (!order) return <div className="p-8">Loading...</div>;

  const statusSteps = ['pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'delivered'];
  const currentStep = statusSteps.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Track Order #{order._id.slice(-6)}</h1>

          <div className="flex justify-between mb-8">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-green-500 text-white' : 'bg-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <p className="text-xs mt-2 capitalize">{step.replace('_', ' ')}</p>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Order Details</h2>
            <p className="text-sm text-gray-600">Restaurant: {order.restaurant?.name}</p>
            <p className="text-sm text-gray-600">Total: ₹{order.totalAmount}</p>
            <p className="text-sm text-gray-600">Payment: {order.paymentMethod}</p>
          </div>

          {order.rider && (
            <div className="border-t pt-4 mt-4">
              <h2 className="font-semibold mb-2">Delivery Partner</h2>
              <p className="text-sm text-gray-600">Vehicle: {order.rider.vehicleType}</p>
              {riderLocation && (
                <p className="text-sm text-green-600">
                  Live Location: {riderLocation.lat.toFixed(4)}, {riderLocation.lng.toFixed(4)}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
