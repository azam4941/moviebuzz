import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VerifyOtp = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [displayOtp, setDisplayOtp] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  
  const inputRefs = useRef([]);
  const { verifyOtp, sendOtp, isAuthenticated, isVerified, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email;
  const initialOtp = location.state?.otp;
  const demoMode = location.state?.demoMode;

  useEffect(() => {
    document.title = 'Verify Email - MovieBuzz';
    // Set the initial OTP from registration (only in demo mode)
    if (initialOtp) {
      setDisplayOtp(initialOtp);
      setIsDemoMode(true);
    }
    if (demoMode) {
      setIsDemoMode(true);
    }
  }, [initialOtp, demoMode]);

  // Redirect if no email or already verified
  useEffect(() => {
    if (!authLoading) {
      if (!email) {
        navigate('/register');
        return;
      }
      if (isAuthenticated && isVerified) {
        navigate('/admin');
      }
    }
  }, [email, isAuthenticated, isVerified, authLoading, navigate]);

  // Resend timer countdown
  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtp(newOtp);
      // Focus last filled input or last input
      const lastIndex = Math.min(pastedData.length, 5);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      setLoading(false);
      return;
    }

    const result = await verifyOtp(email, otpString);
    
    if (result.success) {
      setSuccess('Email verified successfully! Redirecting...');
      setTimeout(() => navigate('/admin'), 1500);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    setLoading(true);
    setError('');
    
    const result = await sendOtp(email);
    
    if (result.success) {
      setSuccess('New verification code generated!');
      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      
      // Update displayed OTP
      if (result.otp) {
        setDisplayOtp(result.otp);
      }
      
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🔒 Verify Your Account</h1>
          <p className="text-gray-400">
            Enter the 6-digit verification code to continue
          </p>
          <p className="text-red-500 font-semibold text-lg mt-2">{email}</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card rounded-lg p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-700">
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-900/50 text-green-300 border border-green-700">
              {success}
            </div>
          )}

          {/* OTP Display - Self-contained OTP System */}
          {displayOtp && (
            <div className="mb-6 p-5 rounded-xl bg-gradient-to-br from-emerald-900/60 to-teal-900/60 border-2 border-emerald-500/50 text-center shadow-lg shadow-emerald-500/20">
              <p className="text-sm text-emerald-400 mb-3 font-medium">🔐 Your Verification Code</p>
              <div className="bg-black/40 rounded-lg py-4 px-6 inline-block">
                <p className="text-4xl font-mono font-bold tracking-[0.6em] text-white drop-shadow-lg">{displayOtp}</p>
              </div>
              <p className="text-xs text-emerald-300/70 mt-3">Enter this code in the boxes below</p>
            </div>
          )}

          {/* Loading state when OTP not yet received */}
          {!displayOtp && (
            <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-blue-900/50 to-indigo-900/50 text-blue-300 border border-blue-700 text-center">
              <p className="text-sm text-blue-400 mb-2">⏳ Generating OTP...</p>
              <p className="text-sm text-gray-300">Please wait while we generate your verification code.</p>
            </div>
          )}

          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                  disabled={loading}
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading || otp.join('').length !== 6}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Didn't receive the code?{' '}
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={loading}
                  className="text-red-500 hover:text-red-400 font-semibold"
                >
                  Resend OTP
                </button>
              ) : (
                <span className="text-gray-500">
                  Wait {resendTimer}s
                </span>
              )}
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/register" className="text-gray-400 hover:text-white text-sm">
              ← Back to Registration
            </Link>
          </div>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Enter the 6-digit code shown above to verify your account.
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
