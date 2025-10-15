import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function OffersManagement() {
  const [offers, setOffers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountPercentage: '',
    validFrom: '',
    validUntil: '',
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${API_URL}/offers/my-offers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(data.offers);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/offers`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Offer created!');
      setShowForm(false);
      setFormData({ title: '', description: '', discountPercentage: '', validFrom: '', validUntil: '' });
      fetchOffers();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create offer');
    }
  };

  const deleteOffer = async (id) => {
    if (!confirm('Delete this offer?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/offers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Offer deleted!');
      fetchOffers();
    } catch (error) {
      alert('Failed to delete offer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manage Offers</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg"
          >
            {showForm ? 'Cancel' : 'Create Offer'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Offer Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="number"
                placeholder="Discount %"
                value={formData.discountPercentage}
                onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="date"
                value={formData.validUntil}
                onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg">
                Create Offer
              </button>
            </form>
          </div>
        )}

        <div className="grid gap-4">
          {offers.map((offer) => (
            <div key={offer._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{offer.title}</h3>
                  <p className="text-gray-600">{offer.description}</p>
                  <p className="text-green-600 font-semibold">{offer.discountPercentage}% OFF</p>
                  <p className="text-sm text-gray-500">
                    Valid: {new Date(offer.validFrom).toLocaleDateString()} -{' '}
                    {new Date(offer.validUntil).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteOffer(offer._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
