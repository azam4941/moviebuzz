import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
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
            <Link 
              to="/admin" 
              className="text-gray-300 hover:text-white transition"
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

