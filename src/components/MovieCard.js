import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, use relative path (proxy handles it) or construct URL
    const apiUrl = process.env.REACT_APP_API_URL || '';
    return apiUrl ? `${apiUrl}${imagePath}` : imagePath;
  };

  const posterUrl = getImageUrl(movie.poster);

  return (
    <Link to={`/movie/${movie._id}`} className="group">
      <div className="relative overflow-hidden rounded-lg bg-dark-card hover:bg-dark-hover transition-all duration-300 transform hover:scale-105">
        <div className="aspect-[2/3] relative">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%231a1a1a" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="Arial" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-white font-semibold text-lg mb-1">{movie.title}</h3>
              <p className="text-gray-300 text-sm">{movie.year}</p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-white font-semibold text-lg mb-1 group-hover:text-red-500 transition">
            {movie.title}
          </h3>
          <p className="text-gray-400 text-sm">{movie.year}</p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;

