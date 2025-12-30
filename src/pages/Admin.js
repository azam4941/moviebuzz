import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const { isAuthenticated, isAdmin, user, logout, getAuthHeader, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Admin Panel - MovieBuzz';
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      navigate('/login');
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate]);

  const [formData, setFormData] = useState({
    title: '',
    year: '',
    description: '',
    downloadLink: '',
    streamingLink: ''
  });
  const [poster, setPoster] = useState(null);
  const [banner, setBanner] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePosterChange = (e) => {
    if (e.target.files[0]) {
      setPoster(e.target.files[0]);
    }
  };

  const handleBannerChange = (e) => {
    if (e.target.files[0]) {
      setBanner(e.target.files[0]);
    }
  };

  const handleGalleryChange = (e) => {
    if (e.target.files) {
      setGallery(Array.from(e.target.files));
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!formData.title || !formData.year || !formData.description) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      setLoading(false);
      return;
    }

    // Validate year
    const yearNum = parseInt(formData.year);
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > new Date().getFullYear() + 10) {
      setMessage({ type: 'error', text: 'Year must be a valid number between 1900 and ' + (new Date().getFullYear() + 10) });
      setLoading(false);
      return;
    }

    // Validate URLs if provided
    if (formData.downloadLink && !isValidUrl(formData.downloadLink)) {
      setMessage({ type: 'error', text: 'Please enter a valid download URL' });
      setLoading(false);
      return;
    }

    if (formData.streamingLink && !isValidUrl(formData.streamingLink)) {
      setMessage({ type: 'error', text: 'Please enter a valid streaming URL' });
      setLoading(false);
      return;
    }

    if (!poster) {
      setMessage({ type: 'error', text: 'Please upload a poster image' });
      setLoading(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('year', formData.year);
      data.append('description', formData.description);
      data.append('downloadLink', formData.downloadLink);
      data.append('streamingLink', formData.streamingLink);
      data.append('poster', poster);
      if (banner) data.append('banner', banner);
      gallery.forEach((file) => {
        data.append('gallery', file);
      });

      const response = await axios.post('/api/movies', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeader()
        }
      });

      setMessage({ type: 'success', text: 'Movie added successfully!' });
      
      // Reset form
      setFormData({
        title: '',
        year: '',
        description: '',
        downloadLink: '',
        streamingLink: ''
      });
      setPoster(null);
      setBanner(null);
      setGallery([]);
      document.getElementById('poster-input').value = '';
      document.getElementById('banner-input').value = '';
      document.getElementById('gallery-input').value = '';
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        setMessage({ type: 'error', text: 'Session expired. Please login again.' });
        setTimeout(() => {
          logout();
          navigate('/login');
        }, 2000);
      } else {
        setMessage({ 
          type: 'error', 
          text: error.response?.data?.error || 'Failed to add movie. Please try again.' 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
          <p className="text-gray-400">Add a new movie to the gallery</p>
          <p className="text-sm text-green-400 mt-1">
            👤 Logged in as: <span className="font-semibold">{user?.username}</span>
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <span>🚪</span> Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-dark-card rounded-lg p-6 md:p-8">
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-900/50 text-green-300 border border-green-700'
                : 'bg-red-900/50 text-red-300 border border-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Movie Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
              required
            />
          </div>

          {/* Year */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
              required
              min="1900"
              max="2100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition resize-none"
              required
            />
          </div>

          {/* Poster */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Poster Image <span className="text-red-500">*</span>
            </label>
            <input
              id="poster-input"
              type="file"
              accept="image/*"
              onChange={handlePosterChange}
              className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
              required
            />
            {poster && (
              <p className="mt-2 text-sm text-gray-400">Selected: {poster.name}</p>
            )}
          </div>

          {/* Banner */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Banner Image (Optional)
            </label>
            <input
              id="banner-input"
              type="file"
              accept="image/*"
              onChange={handleBannerChange}
              className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
            />
            {banner && (
              <p className="mt-2 text-sm text-gray-400">Selected: {banner.name}</p>
            )}
          </div>

          {/* Gallery */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Gallery Images (Optional, multiple)
            </label>
            <input
              id="gallery-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleGalleryChange}
              className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700"
            />
            {gallery.length > 0 && (
              <p className="mt-2 text-sm text-gray-400">
                Selected: {gallery.length} image(s)
              </p>
            )}
          </div>

          {/* Download Link */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Download Link (Optional)
            </label>
            <input
              type="url"
              name="downloadLink"
              value={formData.downloadLink}
              onChange={handleInputChange}
              placeholder="https://example.com/download"
              className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          {/* Streaming Link */}
          <div>
            <label className="block text-white font-semibold mb-2">
              Streaming Link (Optional)
            </label>
            <input
              type="url"
              name="streamingLink"
              value={formData.streamingLink}
              onChange={handleInputChange}
              placeholder="https://example.com/stream"
              className="w-full px-4 py-3 bg-dark-hover border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-600 transition"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-lg transition duration-200 transform hover:scale-105 disabled:transform-none"
          >
            {loading ? 'Adding Movie...' : 'Add Movie'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Admin;
