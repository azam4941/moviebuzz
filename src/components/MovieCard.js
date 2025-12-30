import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const apiUrl = process.env.REACT_APP_API_URL || '';
    return apiUrl ? `${apiUrl}${imagePath}` : imagePath;
  };

  const posterUrl = getImageUrl(movie.poster);

  return (
    <Link 
      to={`/movie/${movie._id}`} 
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="movie-card relative overflow-hidden rounded-2xl bg-gradient-to-b from-dark-card to-dark-bg">
        {/* Animated Border Glow */}
        <div 
          className={`absolute inset-0 rounded-2xl transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(45deg, #e50914, #ffd700, #e50914)',
            backgroundSize: '200% 200%',
            animation: isHovered ? 'gradient-x 2s ease infinite' : 'none',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* Poster Container */}
        <div className="aspect-[2/3] relative overflow-hidden">
          {/* Loading Skeleton */}
          {!isLoaded && (
            <div className="absolute inset-0 skeleton"></div>
          )}

          {/* Poster Image */}
          <img
            src={posterUrl}
            alt={movie.title}
            className={`w-full h-full object-cover transition-all duration-700 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-110 brightness-75' : 'scale-100'}`}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Cdefs%3E%3ClinearGradient id="g" x1="0%25" y1="0%25" x2="0%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%230f0f0f"%3E%3C/stop%3E%3Cstop offset="100%25" style="stop-color:%231a1a1a"%3E%3C/stop%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill="url(%23g)" width="300" height="450"/%3E%3Ctext x="50%25" y="45%25" text-anchor="middle" fill="%23444" font-family="Arial" font-size="40"%3E🎬%3C/text%3E%3Ctext x="50%25" y="55%25" text-anchor="middle" fill="%23666" font-family="Arial" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
              setIsLoaded(true);
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 poster-overlay"></div>

          {/* Year Badge */}
          <div className={`absolute top-3 left-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <span className="bg-accent-red/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full">
              {movie.year}
            </span>
          </div>

          {/* HD Badge */}
          <div className={`absolute top-3 right-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
            <span className="bg-accent-gold/90 backdrop-blur-sm text-black text-xs font-bold px-2 py-1 rounded-full">
              HD
            </span>
          </div>

          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative">
              {/* Pulse Ring */}
              <div className={`absolute inset-0 bg-accent-red/30 rounded-full ${isHovered ? 'animate-ping' : ''}`}></div>
              
              {/* Play Button */}
              <div className="relative w-16 h-16 bg-accent-red rounded-full flex items-center justify-center transform transition-transform duration-300 hover:scale-110 glow-red">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Bottom Info Overlay (visible on hover) */}
          <div className={`absolute bottom-0 left-0 right-0 p-4 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="flex items-center gap-2 text-gray-300 text-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>View Details</span>
            </div>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4 relative">
          {/* Title */}
          <h3 className={`font-semibold text-lg leading-tight mb-1 transition-colors duration-300 line-clamp-1 ${
            isHovered ? 'text-accent-red' : 'text-white'
          }`}>
            {movie.title}
          </h3>
          
          {/* Year & Meta */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">{movie.year}</span>
            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
            <span className="text-gray-500 text-xs">Movie</span>
          </div>

          {/* Hover indicator line */}
          <div className={`absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-accent-red to-accent-gold rounded-full transition-all duration-300 ${
            isHovered ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}></div>
        </div>

        {/* Shine Effect on Hover */}
        <div 
          className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          style={{
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 55%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: isHovered ? 'shimmer 1.5s ease-out' : 'none',
          }}
        />
      </div>
    </Link>
  );
};

export default MovieCard;
