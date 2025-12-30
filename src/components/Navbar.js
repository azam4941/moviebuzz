import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-dark-card border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-red-600 hover:text-red-500 transition">
            MovieBuzz
          </Link>
          <div className="flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-300 hover:text-white transition"
            >
              Home
            </Link>
            
            {isAuthenticated && isAdmin ? (
              <>
                <Link 
                  to="/admin" 
                  className="text-gray-300 hover:text-white transition"
                >
                  Admin Panel
                </Link>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-sm hidden sm:inline">
                    👤 {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
