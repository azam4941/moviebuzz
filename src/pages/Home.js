import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const heroRef = useRef(null);

  useEffect(() => {
    document.title = 'MovieBuzz - Your Ultimate Movie Destination';
    fetchMovies();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      // Pick a random movie as featured
      const randomIndex = Math.floor(Math.random() * Math.min(movies.length, 5));
      setFeaturedMovie(movies[randomIndex]);
    }
  }, [movies]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/movies');
      setMovies(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load movies. Please try again later.');
      console.error('Error fetching movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    const apiUrl = process.env.REACT_APP_API_URL || '';
    return apiUrl ? `${apiUrl}${imagePath}` : imagePath;
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animated statistics
  const stats = [
    { label: 'Movies', value: movies.length, icon: '🎬' },
    { label: 'HD Quality', value: '4K', icon: '✨' },
    { label: 'Free Access', value: '100%', icon: '🎁' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen animated-bg">
        {/* Skeleton Hero */}
        <div className="relative h-[70vh] overflow-hidden">
          <div className="skeleton w-full h-full"></div>
          <div className="absolute inset-0 hero-gradient"></div>
        </div>
        
        {/* Skeleton Grid */}
        <div className="container mx-auto px-4 py-12">
          <div className="skeleton h-12 w-64 rounded-lg mb-8"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen animated-bg flex items-center justify-center">
        <div className="text-center glass rounded-3xl p-12 max-w-md mx-4 animate-fade-in">
          <div className="text-6xl mb-6">😢</div>
          <h2 className="text-2xl font-bold text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button 
            onClick={fetchMovies}
            className="btn-primary text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen animated-bg noise-bg relative">
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: Math.random() * 0.5 + 0.2,
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      {featuredMovie && (
        <section ref={heroRef} className="relative h-[85vh] overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={getImageUrl(featuredMovie.banner || featuredMovie.poster)}
              alt={featuredMovie.title}
              className="w-full h-full object-cover scale-105 animate-pulse-glow"
              style={{ filter: 'brightness(0.4)' }}
            />
            <div className="absolute inset-0 hero-gradient"></div>
            <div className="absolute inset-0 dot-pattern opacity-30"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="animate-fade-in-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
                <span className="inline-flex items-center gap-2 bg-accent-red/20 border border-accent-red/30 text-accent-red px-4 py-2 rounded-full text-sm font-medium mb-6">
                  <span className="animate-pulse">●</span> Featured Movie
                </span>
              </div>

              {/* Title */}
              <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl text-white mb-4 animate-fade-in-up stagger-2 opacity-0" style={{ animationFillMode: 'forwards' }}>
                {featuredMovie.title}
              </h1>

              {/* Year & Description */}
              <div className="flex items-center gap-4 mb-6 animate-fade-in-up stagger-3 opacity-0" style={{ animationFillMode: 'forwards' }}>
                <span className="text-accent-gold font-bold text-xl">{featuredMovie.year}</span>
                <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                <span className="tag">HD</span>
              </div>

              <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-8 line-clamp-3 animate-fade-in-up stagger-4 opacity-0" style={{ animationFillMode: 'forwards' }}>
                {featuredMovie.description}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 animate-fade-in-up stagger-5 opacity-0" style={{ animationFillMode: 'forwards' }}>
                <Link 
                  to={`/movie/${featuredMovie._id}`}
                  className="btn-primary text-white flex items-center gap-2 text-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Watch Now
                </Link>
                <Link 
                  to={`/movie/${featuredMovie._id}`}
                  className="glass px-8 py-3 rounded-full text-white font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  More Info
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-slow">
            <div className="w-8 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
              <div className="w-1 h-3 bg-white/60 rounded-full animate-pulse"></div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="relative z-10 py-8 -mt-20">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-8 grid grid-cols-3 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className={`text-center animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}
              >
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Search & Title Section */}
      <section className="relative z-10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            {/* Section Title */}
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">
                Explore <span className="gradient-text">Movies</span>
              </h2>
              <p className="text-gray-400">
                {movies.length} movies available • Updated daily
              </p>
            </div>

            {/* Search Bar */}
            <div className="search-bar flex items-center gap-3 px-6 py-3 w-full md:w-96">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent flex-1 outline-none text-white placeholder-gray-500"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Movies Grid */}
          {filteredMovies.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="text-8xl mb-6">🎬</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchQuery ? 'No movies found' : 'No movies yet'}
              </h3>
              <p className="text-gray-400 mb-8">
                {searchQuery 
                  ? `No results for "${searchQuery}". Try a different search.`
                  : 'Check back soon for new releases!'}
              </p>
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="btn-primary text-white"
                >
                  Clear Search
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {filteredMovies.map((movie, index) => (
                <div 
                  key={movie._id} 
                  className="animate-fade-in-up opacity-0"
                  style={{ 
                    animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
                    animationFillMode: 'forwards'
                  }}
                >
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="glass rounded-3xl p-12 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 dot-pattern opacity-10"></div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-accent-red/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent-gold/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
                Want to contribute?
              </h3>
              <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                Join our community and help us build the ultimate movie collection. 
                Register now to upload and share movies!
              </p>
              <Link 
                to="/register"
                className="btn-primary text-white text-lg inline-flex items-center gap-2"
              >
                Get Started
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
