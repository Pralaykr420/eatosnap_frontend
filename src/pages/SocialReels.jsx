import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function SocialReels() {
  const [reels, setReels] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    restaurant: '',
  });

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/reels`);
      setReels(data.reels);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLike = async (reelId) => {
    if (!isAuthenticated) {
      toast.error('Please login to like reels');
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/reels/${reelId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReels();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (reelId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save reels');
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/reels/${reelId}/save`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Reel saved!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async (reelId) => {
    // Share works without login
    try {
      await axios.post(`${API_URL}/reels/${reelId}/share`);
      const shareUrl = `${window.location.origin}/social-reels?reel=${reelId}`;
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this food reel!',
          url: shareUrl,
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      }
      fetchReels();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollow = async (userId) => {
    if (!isAuthenticated) {
      toast.error('Please login to follow users');
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/social/follow/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Followed!');
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please login to post reels');
      navigate('/login');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/reels`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Reel created!');
      setShowCreateForm(false);
      setFormData({ title: '', description: '', videoUrl: '', restaurant: '' });
      fetchReels();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create reel');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Food Reels</h1>
          {isAuthenticated ? (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg"
            >
              {showCreateForm ? 'Cancel' : 'Create Reel'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg"
            >
              Login to Post Reels
            </button>
          )}
        </div>

        {showCreateForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
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
                type="url"
                placeholder="Video URL"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <input
                type="text"
                placeholder="Restaurant ID (tag a restaurant)"
                value={formData.restaurant}
                onChange={(e) => setFormData({ ...formData, restaurant: e.target.value })}
                className="w-full border rounded-lg px-4 py-2"
                required
              />
              <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-lg">
                Post Reel
              </button>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {reels.map((reel) => (
            <div key={reel._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <p className="font-semibold">{reel.creator?.name || 'Anonymous'}</p>
                    <p className="text-sm text-gray-500">@{reel.restaurant?.name}</p>
                  </div>
                </div>
                {isAuthenticated && (
                  <button
                    onClick={() => handleFollow(reel.creator?._id)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-lg text-sm"
                  >
                    Follow
                  </button>
                )}
              </div>

              <video src={reel.videoUrl} controls className="w-full" />

              <div className="p-4">
                <h3 className="font-bold">{reel.title}</h3>
                <p className="text-gray-600 text-sm">{reel.description}</p>

                {reel.restaurant && (
                  <button
                    onClick={() => window.location.href = `/restaurants/${reel.restaurant._id}`}
                    className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 flex items-center gap-2"
                  >
                    🏪 Visit {reel.restaurant.name}
                  </button>
                )}

                <div className="flex gap-6 mt-4">
                  <button onClick={() => handleLike(reel._id)} className="flex items-center gap-2">
                    ❤️ {reel.likes?.length || 0}
                  </button>
                  <button onClick={() => handleSave(reel._id)} className="flex items-center gap-2">
                    🔖 Save
                  </button>
                  <button onClick={() => handleShare(reel._id)} className="flex items-center gap-2">
                    📤 {reel.shares || 0}
                  </button>
                  <span className="text-gray-500">👁️ {reel.views || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
