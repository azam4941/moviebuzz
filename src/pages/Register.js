import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register, isAuthenticated, isVerified, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Register - MovieBuzz';
  }, []);

  // Redirect if already authenticated and verified
  useEffect(() => {
    if (!authLoading && isAuthenticated && isVerified) {
      navigate('/admin');
    }
  }, [isAuthenticated, isVerified, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!username.trim() || !password.trim() || !mobile.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate mobile (10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      setError('Please enter a valid 10-digit mobile number');
      setLoading(false);
      return;
    }

    const result = await register(username, password, mobile);
    
    if (result.success) {
      // Navigate to OTP verification with mobile number and OTP
      navigate('/verify-otp', { state: { mobile, otp: result.otp } });
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
          <h1 className="text-4xl font-bold text-white mb-2">📝 Create Account</h1>
          <p className="text-gray-400">
            Register to upload movies to MovieBuzz
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card rounded-lg p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-700">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-white font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                placeholder="Choose a username"
                autoComplete="username"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Mobile Number
              </label>
              <div className="flex">
                <span className="px-4 py-3 bg-gray-700 border border-r-0 border-gray-700 rounded-l-lg text-gray-400">
                  +91
                </span>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-r-lg text-white focus:outline-none focus:border-red-600 transition"
                  placeholder="10-digit mobile number"
                  autoComplete="tel"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">We'll send a verification code to this number</p>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                placeholder="Create a password (min 6 characters)"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                placeholder="Confirm your password"
                autoComplete="new-password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading ? 'Creating Account...' : 'Register & Verify Mobile'}
            </button>
          </div>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-red-500 hover:text-red-400">
              Sign In
            </Link>
          </p>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          By registering, you agree to our terms and conditions.
        </p>
      </div>
    </div>
  );
};

export default Register;

