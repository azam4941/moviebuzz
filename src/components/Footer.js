import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative mt-auto overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-t from-black to-dark-bg"></div>
      <div className="absolute inset-0 dot-pattern opacity-5"></div>
      
      {/* Glow Effect */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-40 bg-accent-red/10 blur-3xl rounded-full"></div>

      <div className="relative z-10">
        {/* Main Footer */}
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4 group">
                <span className="text-3xl">🎬</span>
                <span className="font-display text-2xl font-bold">
                  <span className="text-white">Movie</span>
                  <span className="gradient-text-red">Buzz</span>
                </span>
              </Link>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
                Your ultimate destination for discovering and enjoying movies. 
                Browse our collection, find your favorites, and enjoy high-quality content.
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <SocialLink href="#" icon="github" />
                <SocialLink href="#" icon="twitter" />
                <SocialLink href="#" icon="instagram" />
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <FooterLink to="/">Home</FooterLink>
                <FooterLink to="/login">Sign In</FooterLink>
                <FooterLink to="/register">Register</FooterLink>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <FooterLink to="#">Help Center</FooterLink>
                <FooterLink to="#">Terms of Service</FooterLink>
                <FooterLink to="#">Privacy Policy</FooterLink>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
              <p>© {currentYear} MovieBuzz. All rights reserved.</p>
              <p className="flex items-center gap-2">
                Made with <span className="text-accent-red animate-pulse">❤</span> for movie lovers
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Footer Link Component
const FooterLink = ({ to, children }) => (
  <li>
    <Link 
      to={to} 
      className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 group"
    >
      <span className="w-0 group-hover:w-2 h-0.5 bg-accent-red transition-all duration-300"></span>
      {children}
    </Link>
  </li>
);

// Social Link Component
const SocialLink = ({ href, icon }) => {
  const icons = {
    github: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
    twitter: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
      </svg>
    ),
    instagram: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    ),
  };

  return (
    <a 
      href={href} 
      className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent-red/20 border border-white/10 hover:border-accent-red/30 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300"
    >
      {icons[icon]}
    </a>
  );
};

export default Footer;
