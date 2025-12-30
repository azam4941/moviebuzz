import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, setupAdmin, setupRequired, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = setupRequired ? 'Setup Admin - MovieBuzz' : 'Admin Login - MovieBuzz';
  }, [setupRequired]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (setupRequired) {
      // Setup mode - creating first admin
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const result = await setupAdmin(username, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error);
      }
    } else {
      // Normal login
      const result = await login(username, password);
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error);
      }
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
          <h1 className="text-4xl font-bold text-white mb-2">
            {setupRequired ? '🔧 Initial Setup' : '🔐 Admin Login'}
          </h1>
          <p className="text-gray-400">
            {setupRequired 
              ? 'Create your first admin account to get started'
              : 'Sign in to access the admin panel'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-dark-card rounded-lg p-8 shadow-xl">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-900/50 text-red-300 border border-red-700">
              {error}
            </div>
          )}

          {setupRequired && (
            <div className="mb-6 p-4 rounded-lg bg-blue-900/50 text-blue-300 border border-blue-700">
              <p className="font-semibold mb-1">👋 Welcome to MovieBuzz!</p>
              <p className="text-sm">No admin account exists yet. Create one now to start managing your movie gallery.</p>
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
                placeholder="Enter username"
                autoComplete="username"
                disabled={loading}
              />
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
                placeholder="Enter password"
                autoComplete={setupRequired ? 'new-password' : 'current-password'}
                disabled={loading}
              />
            </div>

            {setupRequired && (
              <div>
                <label className="block text-white font-semibold mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
                  placeholder="Confirm password"
                  autoComplete="new-password"
                  disabled={loading}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
            >
              {loading 
                ? (setupRequired ? 'Creating Admin...' : 'Signing In...') 
                : (setupRequired ? 'Create Admin Account' : 'Sign In')
              }
            </button>
          </div>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Only authorized administrators can access this area.
        </p>
      </div>
    </div>
  );
};

export default Login;

