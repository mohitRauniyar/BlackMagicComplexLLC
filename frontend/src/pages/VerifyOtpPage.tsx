import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import React from 'react';

const VerifyOtpPage = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  
  const { verifyOtp, email, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
    
    // Countdown for resend button
    let timer: number;
    if (resendDisabled && countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [email, navigate, resendDisabled, countdown]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      setError('Please enter the verification code');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await verifyOtp(otp);
      navigate('/');
    } catch (error) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      await login(email);
      setResendDisabled(true);
      setCountdown(30);
      setError('');
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  return (
    <div className="py-12">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto bg-primary-900 rounded-lg overflow-hidden"
        >
          <div className="p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 bg-primary-800 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-accent-500" />
              </div>
            </div>
            
            <h1 className="text-2xl font-serif font-bold text-center mb-2">Verify Your Email</h1>
            <p className="text-primary-300 text-center mb-2">
              We've sent a verification code to
            </p>
            <p className="text-white font-medium text-center mb-8">
              {email}
            </p>
            
            {error && (
              <div className="mb-6 p-3 bg-accent-900/30 border border-accent-800 rounded-lg flex items-center text-accent-400">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label htmlFor="otp" className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Enter code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-field text-center text-xl tracking-widest"
                  autoComplete="one-time-code"
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full flex items-center justify-center"
              >
                {loading ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Verifying...
                  </span>
                ) : (
                  'Verify'
                )}
              </button>
              
              <div className="text-center mt-6">
                <p className="text-primary-300 text-sm mb-2">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendDisabled}
                  className={`text-accent-500 ${resendDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-accent-400'}`}
                >
                  {resendDisabled ? `Resend in ${countdown}s` : 'Resend Code'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;