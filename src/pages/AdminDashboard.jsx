import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [pendingRestaurants, setPendingRestaurants] = useState([]);
  const [pendingRiders, setPendingRiders] = useState([]);
  const [activeTab, setActiveTab] = useState('restaurants');

  useEffect(() => {
    fetchPendingRestaurants();
    fetchPendingRiders();
  }, []);

  const fetchPendingRestaurants = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/admin/restaurants/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRestaurants(data.restaurants);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPendingRiders = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/admin/riders/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingRiders(data.riders);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyRestaurant = async (id, approved) => {
    try {
      const token = localStorage.getItem('token');
      const rejectionReason = approved ? null : prompt('Rejection reason:');
      await axios.put(
        `${API_URL}/admin/restaurants/verify/${id}`,
        { approved, rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(approved ? 'Restaurant approved!' : 'Restaurant rejected!');
      fetchPendingRestaurants();
    } catch (error) {
      alert('Failed to verify restaurant');
    }
  };

  const verifyRider = async (id, approved) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${API_URL}/admin/riders/verify/${id}`,
        { approved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(approved ? 'Rider approved!' : 'Rider rejected!');
      fetchPendingRiders();
    } catch (error) {
      alert('Failed to verify rider');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('restaurants')}
            className={`px-6 py-2 rounded-lg ${
              activeTab === 'restaurants' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Restaurants ({pendingRestaurants.length})
          </button>
          <button
            onClick={() => setActiveTab('riders')}
            className={`px-6 py-2 rounded-lg ${
              activeTab === 'riders' ? 'bg-blue-500 text-white' : 'bg-white'
            }`}
          >
            Riders ({pendingRiders.length})
          </button>
        </div>

        {activeTab === 'restaurants' && (
          <div className="space-y-4">
            {pendingRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                <p className="text-sm text-gray-600">Owner: {restaurant.owner?.name}</p>
                <p className="text-sm text-gray-600">FSSAI: {restaurant.fssaiNumber}</p>
                <p className="text-sm text-gray-600">
                  Expiry: {new Date(restaurant.fssaiExpiryDate).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => verifyRestaurant(restaurant._id, true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => verifyRestaurant(restaurant._id, false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'riders' && (
          <div className="space-y-4">
            {pendingRiders.map((rider) => (
              <div key={rider._id} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-bold text-lg">{rider.user?.name}</h3>
                <p className="text-sm text-gray-600">Aadhar: {rider.aadharNumber}</p>
                <p className="text-sm text-gray-600">Vehicle: {rider.vehicleType}</p>
                <p className="text-sm text-gray-600">License: {rider.licenseNumber}</p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => verifyRider(rider._id, true)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => verifyRider(rider._id, false)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
