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
    if (!emailOrPhone) navigate('/login');
  }, [emailOrPhone, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await verifyOTP(otp);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full p-8">
        <h1 className="text-3xl font-bold text-center mb-8">Verify OTP</h1>
        <p className="text-center mb-4">Use: 123456</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="text" maxLength="6" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-3 border rounded-lg text-center text-2xl" placeholder="123456" required />
          <button type="submit" disabled={loading} className="w-full bg-rose-500 text-white py-3 rounded-lg">{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
      </div>
    </div>
  );
}