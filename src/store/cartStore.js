import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      restaurant: null,
      addItem: (item, restaurant) => {
        const { items, restaurant: currentRestaurant } = get();
        if (currentRestaurant && currentRestaurant._id !== restaurant._id) {
          if (!confirm('Replace cart with items from different restaurant?')) return;
          set({ items: [item], restaurant });
          return;
        }
        const existingIndex = items.findIndex(i => i._id === item._id);
        if (existingIndex > -1) {
          const updated = [...items];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }], restaurant });
        }
      },
      removeItem: id => set({ items: get().items.filter(i => i._id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        const updated = get().items.map(i => (i._id === id ? { ...i, quantity } : i));
        set({ items: updated });
      },
      clearCart: () => set({ items: [], restaurant: null }),
      getTotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'eatosnap-cart' }
  )
);
