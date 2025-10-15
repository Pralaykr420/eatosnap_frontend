import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { orderAPI } from '../services/api';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useState } from 'react';

const Cart = () => {
  const { items, restaurant, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    setLoading(true);
    try {
      const orderData = {
        restaurant: restaurant._id,
        items: items.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal: getTotal(),
        deliveryFee: 40,
        tax: getTotal() * 0.05,
        total: getTotal() + 40 + getTotal() * 0.05,
        paymentMethod: 'cod',
        orderType: 'delivery',
      };

      await orderAPI.create(orderData);
      clearCart();
      toast.success('Order placed successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-500 mb-4">Your cart is empty</p>
          <button onClick={() => navigate('/restaurants')} className="btn-primary">
            Browse Restaurants
          </button>
        </div>
      </div>
    );
  }

  const subtotal = getTotal();
  const deliveryFee = 40;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">From {restaurant?.name}</h2>
          {items.map(item => (
            <div key={item._id} className="flex items-center justify-between py-4 border-b">
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-primary font-bold">₹{item.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                    <FiMinus />
                  </button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    <FiPlus />
                  </button>
                </div>
                <button onClick={() => removeItem(item._id)} className="text-red-500">
                  <FiTrash2 />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Bill Details</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹{deliveryFee}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>
          <button onClick={handleCheckout} disabled={loading} className="btn-primary w-full">
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
