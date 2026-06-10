import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();

const STORAGE_KEY = 'mn_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (service, orderDraft = null) => {
    setItems((prev) => {
      // Custom design ya service with draft - hamesha naya add karo
      if (orderDraft ||!service?._id) {
        return [...prev, { service, orderDraft, id: Date.now().toString() + Math.random() }];
      }

      // Normal service without draft - duplicate check karo
      const exists = prev.find((i) => i.service?._id === service._id &&!i.orderDraft);
      if (exists) return prev;

      return [...prev, { service, orderDraft, id: Date.now().toString() + Math.random() }];
    });
  };

  const updateItem = (id, updates) => {
    setItems((prev) => prev.map((i) => (i.id === id? {...i,...updates } : i)));
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => i.id!== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => {
    const price = i.service?.price || i.orderDraft?.amount || 0;
    return sum + price;
  }, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateItem, removeFromCart, clearCart, total, count: items.length }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);