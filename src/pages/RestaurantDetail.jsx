import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { restaurantAPI, productAPI } from '../services/api';
import { useCartStore } from '../store/cartStore';
import { FiStar, FiClock, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [restaurantRes, productsRes] = await Promise.all([
        restaurantAPI.getOne(id),
        productAPI.getAll({ restaurant: id }),
      ]);
      setRestaurant(restaurantRes.data.restaurant);
      setProducts(productsRes.data.products);
    } catch (error) {
      toast.error('Failed to load restaurant');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = product => {
    addItem(product, restaurant);
    toast.success('Added to cart!');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary/20 to-secondary/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <div className="w-32 h-32 bg-white rounded-xl shadow-lg flex items-center justify-center text-6xl">
              {restaurant.logo ? <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover rounded-xl" /> : '🍽️'}
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
              <p className="text-gray-700 mb-3">{restaurant.description}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="flex items-center gap-1">
                  <FiStar className="text-accent" />
                  {restaurant.rating || 'New'}
                </span>
                <span className="flex items-center gap-1">
                  <FiClock />
                  {restaurant.deliveryTime}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold mb-6">Menu</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product._id} className="card p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
                  <p className="text-primary font-bold text-xl">₹{product.price}</p>
                </div>
                {product.images?.[0] && (
                  <img src={product.images[0]} alt={product.name} className="w-20 h-20 object-cover rounded-lg ml-3" />
                )}
              </div>
              <button
                onClick={() => handleAddToCart(product)}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                <FiPlus /> Add to Cart
              </button>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-gray-500">No items available</div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetail;
