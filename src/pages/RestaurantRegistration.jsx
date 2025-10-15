import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function RestaurantRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    fssaiNumber: '',
    fssaiCertificate: '',
    fssaiExpiryDate: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    cuisine: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        cuisine: formData.cuisine.split(',').map(c => c.trim()),
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
      };

      await axios.post(`${API_URL}/restaurants`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Restaurant registered! FSSAI verification pending.');
      navigate('/seller/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Register Your Restaurant</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Restaurant Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-bold mb-4">FSSAI Details (Required)</h2>
            
            <div>
              <label className="block text-sm font-semibold mb-2">FSSAI License Number *</label>
              <input
                type="text"
                value={formData.fssaiNumber}
                onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="14-digit FSSAI number"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">FSSAI Certificate URL *</label>
              <input
                type="url"
                value={formData.fssaiCertificate}
                onChange={(e) => setFormData({ ...formData, fssaiCertificate: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Upload to Cloudinary and paste URL"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">FSSAI Expiry Date *</label>
              <input
                type="date"
                value={formData.fssaiExpiryDate}
                onChange={(e) => setFormData({ ...formData, fssaiExpiryDate: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="font-bold mb-4">Address</h2>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Street *</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-semibold mb-2">City *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">State *</label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Pincode *</label>
                <input
                  type="text"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Cuisine Types (comma-separated) *</label>
            <input
              type="text"
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., Indian, Chinese, Italian"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Register Restaurant
          </button>

          <p className="text-sm text-gray-600 text-center">
            Your restaurant will be reviewed by admin after FSSAI verification
          </p>
        </form>
      </div>
    </div>
  );
}
