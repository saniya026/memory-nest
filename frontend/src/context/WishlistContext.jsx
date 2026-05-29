import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext();
const STORAGE_KEY = 'mn_wishlist';

export const WishlistProvider = ({ children }) => {
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

  const isWishlisted = (serviceId) => items.some((s) => s._id === serviceId);

  const toggleWishlist = (service) => {
    setItems((prev) => {
      const exists = prev.some((s) => s._id === service._id);
      if (exists) return prev.filter((s) => s._id !== service._id);
      return [...prev, { _id: service._id, title: service.title, price: service.price, image: service.image, description: service.description }];
    });
  };

  const removeFromWishlist = (serviceId) => {
    setItems((prev) => prev.filter((s) => s._id !== serviceId));
  };

  return (
    <WishlistContext.Provider
      value={{ items, toggleWishlist, isWishlisted, removeFromWishlist, count: items.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
