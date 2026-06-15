import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Load addresses from localStorage ya API
  useEffect(() => {
    const saved = localStorage.getItem(`addresses_${user?.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      setAddresses(parsed);
      setSelectedAddress(parsed.find(a => a.isDefault) || parsed[0]);
    }
  }, [user?.id]);

  const saveAddress = (address) => {
    const newAddress = {
      id: Date.now(),
      ...address,
      isDefault: addresses.length === 0,
    };
    const updated = [...addresses, newAddress];
    setAddresses(updated);
    localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(updated));
    setSelectedAddress(newAddress);
  };

  const deleteAddress = (id) => {
    const updated = addresses.filter(a => a.id!== id);
    setAddresses(updated);
    localStorage.setItem(`addresses_${user?.id}`, JSON.stringify(updated));
    if (selectedAddress?.id === id) {
      setSelectedAddress(updated[0] || null);
    }
  };

  const selectAddress = (id) => {
    setSelectedAddress(addresses.find(a => a.id === id));
  };

  return (
    <AddressContext.Provider value={{ 
      addresses, 
      selectedAddress, 
      saveAddress, 
      deleteAddress, 
      selectAddress 
    }}>
      {children}
    </AddressContext.Provider>
  );
};