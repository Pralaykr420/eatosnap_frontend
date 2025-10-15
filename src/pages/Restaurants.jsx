import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import { FiStar, FiClock, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, [search]);

  const fetchRestaurants = async () => {
    try {
      const { data } = await restaurantAPI.getAll({ search });
      setRestaurants(data.restaurants);
    } catch (error) {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Restaurants Near You</h1>
          <input
            type="text"
            placeholder="Search restaurants or cuisines..."
            className="input-field max-w-md"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map(restaurant => (
              <Link key={restaurant._id} to={`/restaurants/${restaurant._id}`}>
                <div className="card overflow-hidden hover:scale-105 transition-transform">
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    {restaurant.banner ? (
                      <img
                        src={restaurant.banner}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-6xl">🍽️</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{restaurant.name}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {restaurant.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FiStar className="text-accent" />
                        {restaurant.rating || 'New'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FiClock />
                        {restaurant.deliveryTime}
                      </span>
                    </div>
                    {restaurant.cuisine?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {restaurant.cuisine.slice(0, 3).map((c, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && restaurants.length === 0 && (
          <div className="text-center py-20 text-gray-500">No restaurants found</div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
