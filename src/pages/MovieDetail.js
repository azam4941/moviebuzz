import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMovie();
  }, [id]);

  useEffect(() => {
    if (movie) {
      document.title = `${movie.title} (${movie.year}) - MovieBuzz`;
    } else {
      document.title = 'Movie Details - MovieBuzz';
    }
  }, [movie]);

  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/movies/${id}`);
      setMovie(response.data);
      setError(null);
    } catch (err) {
      setError('Movie not found');
      console.error('Error fetching movie:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
            <p className="text-gray-400">Loading movie details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error || 'Movie not found'}</p>
          <Link to="/" className="text-red-600 hover:text-red-500">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, use relative path (proxy handles it) or construct URL
    const apiUrl = process.env.REACT_APP_API_URL || '';
    return apiUrl ? `${apiUrl}${imagePath}` : imagePath;
  };

  const bannerUrl = getImageUrl(movie.banner || movie.poster);

  return (
    <div className="min-h-screen">
      {/* Banner Section */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={bannerUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"%3E%3Crect fill="%230a0a0a" width="1920" height="1080"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="Arial" font-size="24"%3EImage not found%3C/text%3E%3C/svg%3E';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              {movie.title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300">{movie.year}</p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          {movie.downloadLink && (
            <a
              href={movie.downloadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Download Movie
            </a>
          )}
          {movie.streamingLink && (
            <a
              href={movie.streamingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200 transform hover:scale-105"
            >
              Watch Online
            </a>
          )}
          <Link
            to="/"
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
          >
            ← Back to Home
          </Link>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Description</h2>
          <p className="text-gray-300 text-lg leading-relaxed whitespace-pre-line">
            {movie.description}
          </p>
        </div>

        {/* Gallery */}
        {movie.gallery && movie.gallery.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Gallery</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.gallery.map((image, index) => (
                <div
                  key={index}
                  className="relative aspect-[2/3] overflow-hidden rounded-lg bg-dark-card hover:bg-dark-hover transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <img
                    src={getImageUrl(image)}
                    alt={`${movie.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="450"%3E%3Crect fill="%231a1a1a" width="300" height="450"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-family="Arial" font-size="14"%3EImage not found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieDetail;

