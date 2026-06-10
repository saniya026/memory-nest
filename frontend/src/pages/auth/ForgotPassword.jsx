import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState('');
  const [otp, setOtp] = useState('');
  const [newPass, setNewPass] = useState('');
  const { sendOTP, verifyOTP, resetPassword } = useAuth();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    await sendOTP(input);
    setStep(2);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === '123456') setStep(3);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    await resetPassword(newPass);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose/5 to-lavender/5 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <h2 className="text-center text-3xl font-bold">Reset Password</h2>
        
        {step === 1 && (
          <form onSubmit={handleSendOTP} className="mt-8 space-y-5">
            <input
              type="text"
              placeholder="Email or Phone"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:bg-gray-700"
            />
            <button className="btn-primary w-full py-3">Send OTP</button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP} className="mt-8 space-y-5">
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP: 123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 text-center text-2xl dark:bg-gray-700"
            />
            <button className="btn-primary w-full py-3">Verify OTP</button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleReset} className="mt-8 space-y-5">
            <input
              type="password"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full rounded-xl border px-4 py-3 dark:bg-gray-700"
            />
            <button className="btn-primary w-full py-3">Update Password</button>
          </form>
        )}
      </div>
    </div>
  );
}