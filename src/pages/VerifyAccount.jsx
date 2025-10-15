import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const VerifyAccount = () => {
  const [emailOTP, setEmailOTP] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, email, phone } = location.state || {};

  const handleVerify = async () => {
    if (!emailOTP) {
      toast.error('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/verification/verify-email`, {
        userId,
        otp: emailOTP,
      });

      toast.success('Email verified successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resendEmailOTP = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/verification/resend-email-otp`, { userId });
      toast.success('Email OTP sent');
    } catch (error) {
      toast.error('Failed to send OTP');
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center mb-2">Verify Your Account</h2>
        <p className="text-center text-gray-600 mb-8">
          We've sent an OTP to your email
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email OTP</label>
            <input
              type="text"
              maxLength="6"
              className="input-field"
              placeholder="Enter 6-digit OTP"
              value={emailOTP}
              onChange={e => setEmailOTP(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Sent to: {email}</p>
            <button onClick={resendEmailOTP} className="text-primary text-sm mt-1">
              Resend Email OTP
            </button>
          </div>

          <button onClick={handleVerify} disabled={loading} className="btn-primary w-full">
            {loading ? 'Verifying...' : 'Verify Account'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccount;
