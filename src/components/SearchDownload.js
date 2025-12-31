import React, { useState } from 'react';
import axios from 'axios';

const SearchDownload = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim() || query.trim().length < 2) {
      setError('Please enter a valid movie name (at least 2 characters)');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const response = await axios.get(`/api/search/movies?query=${encodeURIComponent(query.trim())}`);
      setResults(response.data);
      
      // Log rejected requests for compliance
      if (!response.data.isPublicDomain) {
        axios.post('/api/search/log-rejected', {
          query: query,
          reason: 'Copyrighted content - directed to streaming platforms'
        }).catch(() => {}); // Silent fail for logging
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Input Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl border border-gray-700">
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            🔍 Search & Download
          </h2>
          <p className="text-gray-400 text-sm">
            Search for public domain movies from Internet Archive
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter movie name..."
              className="w-full px-5 py-4 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all text-lg"
              disabled={loading}
            />
            {query && (
              <button
                onClick={() => { setQuery(''); setResults(null); setError(''); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
              >
                ✕
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            disabled={loading || !query.trim()}
            className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[180px]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Searching...
              </>
            ) : (
              <>
                🔍 Search & Download
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-center">
            ⚠️ {error}
          </div>
        )}

        <p className="text-xs text-gray-500 mt-4 text-center">
          ⚖️ Only public domain and legally free content available for download
        </p>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-6 space-y-6">
          {/* Public Domain Results */}
          {results.isPublicDomain && results.results?.length > 0 && (
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">✅</span>
                <h3 className="text-xl font-bold text-green-400">
                  Public Domain Movies Found!
                </h3>
              </div>
              <p className="text-gray-300 mb-6">{results.message}</p>
              
              <div className="space-y-6">
                {results.results.map((movie) => (
                  <div key={movie.id} className="bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Thumbnail */}
                      <div className="w-full md:w-48 flex-shrink-0">
                        <img
                          src={movie.thumbnail}
                          alt={movie.title}
                          className="w-full h-auto rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="300"%3E%3Crect fill="%231a1a1a" width="200" height="300"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23666" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">{movie.title}</h4>
                        <p className="text-gray-400 text-sm mb-1">📅 Year: {movie.year}</p>
                        <p className="text-gray-400 text-sm mb-3">🎬 Creator: {movie.creator}</p>
                        <p className="text-gray-300 text-sm mb-4 line-clamp-3">{movie.description}</p>
                        
                        {/* Download Options */}
                        <div className="space-y-2">
                          <p className="text-green-400 font-semibold text-sm">📥 Download Options:</p>
                          <div className="flex flex-wrap gap-2">
                            {movie.downloads.map((file, idx) => (
                              <a
                                key={idx}
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                              >
                                ⬇️ {file.format} ({file.size})
                              </a>
                            ))}
                          </div>
                        </div>
                        
                        {/* Archive Link */}
                        <a
                          href={movie.archiveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 mt-4 text-blue-400 hover:text-blue-300 text-sm transition"
                        >
                          🌐 View on Internet Archive →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Copyrighted Content - Show Streaming Options */}
          {!results.isPublicDomain && (
            <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-6 border border-yellow-700">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">⚠️</span>
                <h3 className="text-xl font-bold text-yellow-400">
                  {results.message}
                </h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                "{results.query}" appears to be copyrighted content. Please use official streaming platforms:
              </p>

              {/* Streaming Platforms */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                {results.streamingPlatforms?.map((platform, idx) => (
                  <a
                    key={idx}
                    href={platform.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-lg text-white text-sm font-medium transition-colors"
                  >
                    <span>{platform.icon}</span>
                    {platform.name}
                  </a>
                ))}
              </div>

              {/* Trailer Button */}
              {results.trailerUrl && (
                <a
                  href={results.trailerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
                >
                  ▶️ Watch Trailer on YouTube
                </a>
              )}

              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <p className="text-gray-400 text-sm">
                  💡 <strong>Why can't I download this?</strong><br />
                  This movie is protected by copyright. Downloading copyrighted content without permission is illegal. 
                  Please support creators by using official streaming services.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchDownload;

