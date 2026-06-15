import { X } from 'lucide-react';
import { useState } from 'react';
import { useAddress } from '../../context/AddressContext';

export default function AddressModal({ open, onClose }) {
  const { saveAddress } = useAddress();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    pincode: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
  });

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    saveAddress(form);
    onClose();
    setForm({ name: '', phone: '', pincode: '', address: '', city: '', state: '', landmark: '' });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-gray-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Add New Address</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            required
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          />
          <input
            required
            placeholder="Phone Number"
            type="tel"
            maxLength="10"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value})}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="Pincode"
              maxLength="6"
              value={form.pincode}
              onChange={(e) => setForm({...form, pincode: e.target.value})}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({...form, city: e.target.value})}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
          </div>
          <textarea
            required
            placeholder="Address (House No, Building, Street)"
            value={form.address}
            onChange={(e) => setForm({...form, address: e.target.value})}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            rows="2"
          />
          <input
            required
            placeholder="State"
            value={form.state}
            onChange={(e) => setForm({...form, state: e.target.value})}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          />
          <input
            placeholder="Landmark (Optional)"
            value={form.landmark}
            onChange={(e) => setForm({...form, landmark: e.target.value})}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          />
          <button
            type="submit"
            className="w-full rounded-full bg-rose py-2.5 font-semibold text-white hover:bg-rose-600"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}