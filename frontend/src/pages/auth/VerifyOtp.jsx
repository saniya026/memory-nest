import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const emailOrPhone = location.state?.emailOrPhone || localStorage.getItem('tempAuth');

  useEffect(() => {
    if (!emailOrPhone) {
      toast.error('Please login first');
      navigate('/login');
    }
  }, [emailOrPhone, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      toast.error('Enter 6 digit OTP');
      return;
    }
    setLoading(true);
    await verifyOTP(otp);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Verify OTP</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Enter OTP sent to {emailOrPhone}</p>
          <p className="text-sm text-rose-500 mt-1">Use: 123456</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} className="w-full px-4 py-3 text-center text-2xl tracking-widest border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white" placeholder="123456" required />
          <button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50">
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}