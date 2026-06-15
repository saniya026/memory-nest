import { X, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useAddress } from '../../context/AddressContext';
import toast from 'react-hot-toast';

export default function AddressModal({ open, onClose }) {
  const { saveAddress } = useAddress();
  const [loading, setLoading] = useState(false);
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

  // ✅ Pincode API se City/State fetch
  const handlePincodeChange = async (pincode) => {
    setForm({...form, pincode });

    // Sirf 6 digit pe API call
    if (pincode.length === 6 && /^\d{6}$/.test(pincode)) {
      setLoading(true);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await res.json();

        if (data[0].Status === 'Success' && data[0].PostOffice.length > 0) {
          const postOffice = data[0].PostOffice[0];
          setForm(prev => ({
           ...prev,
            city: postOffice.District,
            state: postOffice.State
          }));
        } else {
          toast.error('Invalid Pincode');
          setForm(prev => ({...prev, city: '', state: '' }));
        }
      } catch (err) {
        toast.error('Failed to fetch pincode details');
      } finally {
        setLoading(false);
      }
    } else {
      setForm(prev => ({...prev, city: '', state: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (form.phone.length!== 10) {
      toast.error('Phone number must be 10 digits');
      return;
    }
    if (form.pincode.length!== 6) {
      toast.error('Pincode must be 6 digits');
      return;
    }

    saveAddress(form);
    onClose();
    setForm({ name: '', phone: '', pincode: '', address: '', city: '', state: '', landmark: '' });
    toast.success('Address saved');
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
            onChange={(e) => setForm({...form, name: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          />

          <input
            required
            placeholder="Phone Number"
            type="tel"
            maxLength="10"
            value={form.phone}
            onChange={(e) => setForm({...form, phone: e.target.value.replace(/\D/g, '') })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          />

          <div className="relative">
            <input
              required
              placeholder="Pincode"
              maxLength="6"
              value={form.pincode}
              onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            />
            {loading && (
              <Loader2 className="absolute right-3 top-2.5 h-5 w-5 animate-spin text-gray-400" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="City"
              value={form.city}
              onChange={(e) => setForm({...form, city: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 disabled:bg-gray-100 disabled:dark:bg-gray-800"
              disabled={!!form.city &&!loading}
            />
            <input
              required
              placeholder="State"
              value={form.state}
              onChange={(e) => setForm({...form, state: e.target.value })}
              className="rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800 disabled:bg-gray-100 disabled:dark:bg-gray-800"
              disabled={!!form.state &&!loading}
            />
          </div>

          <textarea
            required
            placeholder="Address (House No, Building, Street)"
            value={form.address}
            onChange={(e) => setForm({...form, address: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
            rows="2"
          />

          <input
            placeholder="Landmark (Optional)"
            value={form.landmark}
            onChange={(e) => setForm({...form, landmark: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-800"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-rose py-2.5 font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
          >
            Save Address
          </button>
        </form>
      </div>
    </div>
  );
}