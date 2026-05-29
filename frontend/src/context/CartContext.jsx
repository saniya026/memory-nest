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
      const exists = prev.find((i) => i.service?._id === service._id && !orderDraft);
      if (exists && !orderDraft) return prev;
      return [...prev, { service, orderDraft, id: Date.now().toString() }];
    });
  };

  const updateItem = (id, updates) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, i) => sum + (i.service?.price || i.orderDraft?.amount || 0), 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateItem, removeFromCart, clearCart, total, count: items.length }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
