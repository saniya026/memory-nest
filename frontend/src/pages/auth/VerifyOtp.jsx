import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOTP } = useAuth();
  const location = useLocation();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length!== 6) return;
    setLoading(true);
    await verifyOTP(otp);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose/5 to-lavender/5 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <h2 className="text-center text-3xl font-bold">Enter OTP</h2>
        <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
          We sent a code. Use: 123456
        </p>
        
        <form onSubmit={handleVerify} className="mt-8 space-y-5">
          <input
            type="text"
            maxLength="6"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-center text-2xl tracking-[1rem] focus:border-rose focus:outline-none dark:border-gray-600 dark:bg-gray-700"
          />
          <button 
            type="submit" 
            disabled={loading || otp.length!== 6}
            className="btn-primary w-full py-3 disabled:opacity-50"
          >
            {loading? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}