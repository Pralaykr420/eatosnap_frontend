import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function RiderRegistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aadharNumber: '',
    dateOfBirth: '',
    vehicleType: 'bike',
    vehicleNumber: '',
    licenseNumber: '',
    bankAccountNumber: '',
    ifscCode: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/riders/register`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert('Rider registration submitted! Admin verification pending.');
      navigate('/rider/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold mb-6">Register as Delivery Partner</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Aadhar Number * (Must be 18+)</label>
            <input
              type="text"
              value={formData.aadharNumber}
              onChange={(e) => setFormData({ ...formData, aadharNumber: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="12-digit Aadhar number"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date of Birth *</label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Vehicle Type *</label>
            <select
              value={formData.vehicleType}
              onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              required
            >
              <option value="bike">Bike</option>
              <option value="scooter">Scooter</option>
              <option value="bicycle">Bicycle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Vehicle Number *</label>
            <input
              type="text"
              value={formData.vehicleNumber}
              onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              placeholder="e.g., DL01AB1234"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Driving License Number *</label>
            <input
              type="text"
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full border rounded-lg px-4 py-2"
              required
            />
          </div>

          <div className="border-t pt-4">
            <h2 className="font-bold mb-4">Bank Details</h2>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Bank Account Number *</label>
              <input
                type="text"
                value={formData.bankAccountNumber}
                onChange={(e) => setFormData({ ...formData, bankAccountNumber: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold mb-2">IFSC Code *</label>
              <input
                type="text"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            Submit Registration
          </button>

          <p className="text-sm text-gray-600 text-center">
            You must be 18+ years old. Maximum 12 hours work per day allowed.
          </p>
        </form>
      </div>
    </div>
  );
}
