import { useState, useEffect } from 'react';
import { reelAPI } from '../services/api';
import { FiHeart, FiMessageCircle, FiSend } from 'react-icons/fi';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      const { data } = await reelAPI.getAll();
      setReels(data.reels);
    } catch (error) {
      toast.error('Failed to load reels');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async reelId => {
    if (!isAuthenticated) {
      toast.error('Please login to like reels');
      return;
    }
    try {
      await reelAPI.like(reelId);
      setReels(reels.map(r => (r._id === reelId ? { ...r, likes: r.likes + 1 } : r)));
    } catch (error) {
      toast.error('Failed to like reel');
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-md mx-auto">
        {reels.length === 0 ? (
          <div className="text-center py-20 text-white">No reels available</div>
        ) : (
          <div className="space-y-4 py-4">
            {reels.map(reel => (
              <div key={reel._id} className="relative bg-gray-900 rounded-xl overflow-hidden">
                <div className="aspect-[9/16] bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                  {reel.thumbnail ? (
                    <img src={reel.thumbnail} alt="Reel" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl">🎬</span>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      {reel.restaurant?.logo ? (
                        <img src={reel.restaurant.logo} alt="" className="w-full h-full rounded-full" />
                      ) : (
                        '🍽️'
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{reel.restaurant?.name}</p>
                      <p className="text-xs text-gray-300">{reel.creator?.name}</p>
                    </div>
                  </div>
                  <p className="text-sm mb-2">{reel.caption}</p>
                  <div className="flex gap-4">
                    <button onClick={() => handleLike(reel._id)} className="flex items-center gap-1">
                      <FiHeart className="text-xl" />
                      <span>{reel.likes?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-1">
                      <FiMessageCircle className="text-xl" />
                      <span>{reel.comments?.length || 0}</span>
                    </button>
                    <button className="flex items-center gap-1">
                      <FiSend className="text-xl" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;
