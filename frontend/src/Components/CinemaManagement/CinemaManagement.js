import React, { useState, useEffect } from 'react';
import './CinemaManagement.css';
import ModalForm from './ModalForm';

const CinemaManagement = () => {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCinema, setEditingCinema] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "success"
  });

  const [formData, setFormData] = useState({
    cinema_name: '',
    cinema_location: '',
    google_maps_location: '',
    contact_info: {
      phone: '',
      email: ''
    },
    ongoing_movies: {
      movie_1: { name: '', start_date: '', end_date: '', trailer_link: '' },
      movie_2: { name: '', start_date: '', end_date: '', trailer_link: '' },
      movie_3: { name: '', start_date: '', end_date: '', trailer_link: '' },
      movie_4: { name: '', start_date: '', end_date: '', trailer_link: '' }
    },
    upcoming_movies: {
      movie_1: { name: '', trailer_link: '' },
      movie_2: { name: '', trailer_link: '' }
    },
    movie_slot_pricing: {
      movie_1: { starting_price: 0, interval_price: 0, ending_price: 0 },
      movie_2: { starting_price: 0, interval_price: 0, ending_price: 0 },
      movie_3: { starting_price: 0, interval_price: 0, ending_price: 0 },
      movie_4: { starting_price: 0, interval_price: 0, ending_price: 0 }
    },
    is_active: true
  });

  const totalSteps = 7;

  const steps = [
    { id: 1, title: 'General Details', description: 'Basic cinema information' },
    { id: 2, title: 'Movie 1', description: 'First ongoing movie' },
    { id: 3, title: 'Movie 2', description: 'Second ongoing movie' },
    { id: 4, title: 'Movie 3', description: 'Third ongoing movie' },
    { id: 5, title: 'Movie 4', description: 'Fourth ongoing movie' },
    { id: 6, title: 'Upcoming Movies', description: 'Future releases' },
    { id: 7, title: 'Review & Submit', description: 'Final review' }
  ];

  // Fetch cinemas from API
  const fetchCinemas = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cinemas');
      const data = await response.json();
      
      if (data.success) {
        setCinemas(data.data);
      } else {
        showNotification('Failed to fetch cinemas', 'error');
      }
    } catch (error) {
      console.error('Error fetching cinemas:', error);
      showNotification('Error fetching cinemas', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 5000);
  };

  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  const getMovieCount = (cinema) => {
    let count = 0;
    if (cinema.ongoing_movies) {
      Object.keys(cinema.ongoing_movies).forEach(key => {
        if (cinema.ongoing_movies[key] && cinema.ongoing_movies[key].name) {
          count++;
        }
      });
    }
    return count;
  };

  const getUpcomingCount = (cinema) => {
    let count = 0;
    if (cinema.upcoming_movies) {
      Object.keys(cinema.upcoming_movies).forEach(key => {
        if (cinema.upcoming_movies[key] && cinema.upcoming_movies[key].name) {
          count++;
        }
      });
    }
    return count;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Generate YouTube thumbnail URL
  const getYouTubeThumbnail = (url) => {
    const videoId = getYouTubeVideoId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  // Generate Google Maps embed URL
  const getGoogleMapsEmbedUrl = (mapsUrl) => {
    if (!mapsUrl) return null;
    // Extract coordinates or place ID from Google Maps URL
    const match = mapsUrl.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      const lat = match[1];
      const lng = match[2];
      return `https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=${lat},${lng}&zoom=15&maptype=roadmap`;
    }
    return null;
  };

  const handleUpdate = (cinema) => {
    setEditingCinema(cinema);
    setFormData(cinema);
    setIsModalOpen(true);
    setCurrentStep(1);
  };

  const handleDelete = async (cinemaId, cinemaName) => {
    if (window.confirm(`Are you sure you want to delete ${cinemaName}?`)) {
      try {
        const response = await fetch(`http://localhost:5000/api/cinemas/${cinemaId}`, {
          method: 'DELETE'
        });
        const data = await response.json();
        
        if (data.success) {
          showNotification('Cinema deleted successfully', 'success');
          fetchCinemas();
        } else {
          showNotification('Failed to delete cinema', 'error');
        }
      } catch (error) {
        console.error('Error deleting cinema:', error);
        showNotification('Error deleting cinema', 'error');
      }
    }
  };


  // Validation functions
  const validateCinemaName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Cinema name is required';
    }
    if (name.trim().length < 2) {
      return 'Cinema name must be at least 2 characters';
    }
    return null;
  };

  const validateLocation = (location) => {
    if (!location || location.trim().length === 0) {
      return 'Cinema location is required';
    }
    if (location.trim().length < 5) {
      return 'Cinema location must be at least 5 characters';
    }
    return null;
  };

  const validateMovie = (movie, movieNumber) => {
    const errors = {};
    
    if (!movie.name || movie.name.trim().length === 0) {
      errors.name = `Movie ${movieNumber} name is required`;
    }
    
    if (!movie.start_date) {
      errors.start_date = `Movie ${movieNumber} start date is required`;
    }
    
    if (!movie.end_date) {
      errors.end_date = `Movie ${movieNumber} end date is required`;
    }
    
    if (movie.start_date && movie.end_date) {
      const startDate = new Date(movie.start_date);
      const endDate = new Date(movie.end_date);
      if (endDate <= startDate) {
        errors.end_date = `Movie ${movieNumber} end date must be after start date`;
      }
    }
    
    if (movie.trailer_link && movie.trailer_link.trim().length > 0) {
      const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (!youtubeRegex.test(movie.trailer_link)) {
        errors.trailer_link = `Movie ${movieNumber} trailer must be a valid YouTube URL`;
      }
    }
    
    return errors;
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    
    if (currentStep === 1) {
      const nameError = validateCinemaName(formData.cinema_name);
      if (nameError) newErrors.cinema_name = nameError;
      
      const locationError = validateLocation(formData.cinema_location);
      if (locationError) newErrors.cinema_location = locationError;
    } else if (currentStep >= 2 && currentStep <= 5) {
      const movieKey = `movie_${currentStep - 1}`;
      const movie = formData.ongoing_movies[movieKey];
      const movieErrors = validateMovie(movie, currentStep - 1);
      Object.assign(newErrors, movieErrors);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('ongoing_movies.') || name.startsWith('upcoming_movies.') || name.startsWith('movie_slot_pricing.')) {
      const parts = name.split('.');
      const movieKey = parts[1];
      const field = parts[2];
      
      setFormData(prev => ({
        ...prev,
        [parts[0]]: {
          ...prev[parts[0]],
          [movieKey]: {
            ...prev[parts[0]][movieKey],
            [field]: type === 'checkbox' ? checked : value
          }
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    try {
      const url = editingCinema 
        ? `http://localhost:5000/api/cinemas/${editingCinema._id}`
        : 'http://localhost:5000/api/cinemas';
      
      const method = editingCinema ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        showNotification(
          editingCinema ? 'Cinema updated successfully!' : 'Cinema created successfully!',
          'success'
        );
        setIsModalOpen(false);
        setEditingCinema(null);
        setFormData({
          cinema_name: '',
          cinema_location: '',
          google_maps_location: '',
          contact_info: { phone: '', email: '' },
          ongoing_movies: {
            movie_1: { name: '', start_date: '', end_date: '', trailer_link: '' },
            movie_2: { name: '', start_date: '', end_date: '', trailer_link: '' },
            movie_3: { name: '', start_date: '', end_date: '', trailer_link: '' },
            movie_4: { name: '', start_date: '', end_date: '', trailer_link: '' }
          },
          upcoming_movies: {
            movie_1: { name: '', trailer_link: '' },
            movie_2: { name: '', trailer_link: '' }
          },
          movie_slot_pricing: {
            movie_1: { starting_price: 0, interval_price: 0, ending_price: 0 },
            movie_2: { starting_price: 0, interval_price: 0, ending_price: 0 },
            movie_3: { starting_price: 0, interval_price: 0, ending_price: 0 },
            movie_4: { starting_price: 0, interval_price: 0, ending_price: 0 }
          },
          is_active: true
        });
        setCurrentStep(1);
        fetchCinemas();
      } else {
        showNotification(data.message || 'Failed to save cinema', 'error');
      }
    } catch (error) {
      console.error('Error saving cinema:', error);
      showNotification('Error saving cinema', 'error');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCinema(null);
    setCurrentStep(1);
    setErrors({});
    setFormData({
      cinema_name: '',
      cinema_location: '',
      google_maps_location: '',
      contact_info: { phone: '', email: '' },
      ongoing_movies: {
        movie_1: { name: '', start_date: '', end_date: '', trailer_link: '' },
        movie_2: { name: '', start_date: '', end_date: '', trailer_link: '' },
        movie_3: { name: '', start_date: '', end_date: '', trailer_link: '' },
        movie_4: { name: '', start_date: '', end_date: '', trailer_link: '' }
      },
      upcoming_movies: {
        movie_1: { name: '', trailer_link: '' },
        movie_2: { name: '', trailer_link: '' }
      },
      movie_slot_pricing: {
        movie_1: { starting_price: 0, interval_price: 0, ending_price: 0 },
        movie_2: { starting_price: 0, interval_price: 0, ending_price: 0 },
        movie_3: { starting_price: 0, interval_price: 0, ending_price: 0 },
        movie_4: { starting_price: 0, interval_price: 0, ending_price: 0 }
      },
      is_active: true
    });
  };

  const handleCreateNew = () => {
    setEditingCinema(null);
    setIsModalOpen(true);
    setCurrentStep(1);
  };

  return (
    <div className="cinema-management">
      <div className="page-header">
        <div className="container">
          <h1>Cinema Management</h1>
          <p>Manage your cinema locations, movie schedules, and advertisement slots</p>
          <button 
            className="btn btn-primary create-btn"
            onClick={handleCreateNew}
          >
            <i className="fa fa-plus"></i> Add New Cinema
          </button>
        </div>
      </div>

      <div className="content-section">
        <div className="container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading cinemas...</p>
            </div>
          ) : cinemas.length === 0 ? (
            <div className="no-cinemas">
              <i className="fa fa-film"></i>
              <h3>No Cinemas Found</h3>
              <p>Start by adding your first cinema location.</p>
              <button 
                className="btn btn-primary"
                onClick={handleCreateNew}
              >
                <i className="fa fa-plus"></i> Add Cinema
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table className="cinema-table">
                <thead>
                  <tr>
                    <th>Cinema Name</th>
                    <th>Location</th>
                    <th>Movies</th>
                    <th>Upcoming</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cinemas.map((cinema) => (
                    <tr key={cinema._id} className={!cinema.is_active ? 'inactive' : ''}>
                      <td>
                        <div className="cinema-name">
                          <strong>{cinema.cinema_name}</strong>
                          {cinema.contact_info && cinema.contact_info.phone && (
                            <small>{cinema.contact_info.phone}</small>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="location-cell">
                          <div className="cinema-location">
                            <i className="fa fa-map-marker"></i>
                            {cinema.cinema_location}
                          </div>
                          {cinema.google_maps_location && (
                            <div className="map-preview">
                              <iframe
                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgU6xqjJjJY&q=${encodeURIComponent(cinema.cinema_location)}&zoom=15&maptype=roadmap`}
                                width="100%"
                                height="80"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title={`Map of ${cinema.cinema_location}`}
                              ></iframe>
                              <a 
                                href={cinema.google_maps_location} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="map-link"
                              >
                                <i className="fa fa-external-link"></i> Open in Maps
                              </a>
                            </div>
                          )}
                        </div>
                      </td>
                       <td>
                         <div className="movie-details-cell">
                           <div className="movie-count-header">
                             <i className="fa fa-film"></i>
                             {getMovieCount(cinema)} Movies
                           </div>
                           {cinema.ongoing_movies && Object.keys(cinema.ongoing_movies).map((movieKey, index) => {
                             const movie = cinema.ongoing_movies[movieKey];
                             if (!movie || !movie.name) return null;
                             const thumbnailUrl = getYouTubeThumbnail(movie.trailer_link);
                             return (
                               <div key={movieKey} className="movie-item">
                                 <div className="movie-content">
                                   <div className="movie-info">
                                     <div className="movie-name">{movie.name}</div>
                                     <div className="movie-dates">
                                       {formatDate(movie.start_date)} - {formatDate(movie.end_date)}
                                     </div>
                                   </div>
                                   {thumbnailUrl && (
                                     <div className="movie-thumbnail">
                                       <img 
                                         src={thumbnailUrl} 
                                         alt={`${movie.name} trailer thumbnail`}
                                         className="thumbnail-image"
                                       />
                                       <div className="play-overlay">
                                         <i className="fa fa-play-circle"></i>
                                       </div>
                                       {movie.trailer_link && (
                                         <a 
                                           href={movie.trailer_link} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="trailer-link-overlay"
                                         >
                                           Watch Trailer
                                         </a>
                                       )}
                                     </div>
                                   )}
                                 </div>
                               </div>
                             );
                           })}
                         </div>
                       </td>
                       <td>
                         <div className="upcoming-details-cell">
                           <div className="upcoming-count-header">
                             <i className="fa fa-clock-o"></i>
                             {getUpcomingCount(cinema)} Upcoming
                           </div>
                           {cinema.upcoming_movies && Object.keys(cinema.upcoming_movies).map((movieKey, index) => {
                             const movie = cinema.upcoming_movies[movieKey];
                             if (!movie || !movie.name) return null;
                             const thumbnailUrl = getYouTubeThumbnail(movie.trailer_link);
                             return (
                               <div key={movieKey} className="upcoming-item">
                                 <div className="upcoming-content">
                                   <div className="upcoming-info">
                                     <div className="upcoming-name">{movie.name}</div>
                                     {movie.trailer_link && (
                                       <a href={movie.trailer_link} target="_blank" rel="noopener noreferrer" className="trailer-link">
                                         <i className="fa fa-play-circle"></i> Trailer
                                       </a>
                                     )}
                                   </div>
                                   {thumbnailUrl && (
                                     <div className="upcoming-thumbnail">
                                       <img 
                                         src={thumbnailUrl} 
                                         alt={`${movie.name} trailer thumbnail`}
                                         className="thumbnail-image"
                                       />
                                       <div className="play-overlay">
                                         <i className="fa fa-play-circle"></i>
                                       </div>
                                       {movie.trailer_link && (
                                         <a 
                                           href={movie.trailer_link} 
                                           target="_blank" 
                                           rel="noopener noreferrer"
                                           className="trailer-link-overlay"
                                         >
                                           Watch
                                         </a>
                                       )}
                                     </div>
                                   )}
                                 </div>
                               </div>
                             );
                           })}
                         </div>
                       </td>
                      <td>
                        <span className={`status-badge ${cinema.is_active ? 'active' : 'inactive'}`}>
                          {cinema.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <span className="created-date">
                          {formatDate(cinema.createdAt)}
                        </span>
                      </td>
                       <td>
                         <div className="action-buttons">
                           <button 
                             className="btn btn-sm btn-warning"
                             onClick={() => handleUpdate(cinema)}
                             title="Update"
                           >
                             <i className="fa fa-edit" aria-hidden="true"></i>
                           </button>
                           <button 
                             className="btn btn-sm btn-danger"
                             onClick={() => handleDelete(cinema._id, cinema.cinema_name)}
                             title="Delete"
                           >
                             <i className="fa fa-trash" aria-hidden="true"></i>
                           </button>
                         </div>
                       </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Cinema */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editingCinema ? 'Update Cinema' : 'Add New Cinema'}</h2>
              <button className="close-btn" onClick={handleCloseModal}>×</button>
            </div>
            
            <div className="modal-body">
              {/* Progress Bar */}
              <div className="progress-bar">
                {steps.map((step) => (
                  <div 
                    key={step.id} 
                    className={`progress-step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}
                  >
                    {currentStep > step.id ? '' : step.id}
                  </div>
                ))}
              </div>

              {/* Form content based on current step */}
              <ModalForm
                currentStep={currentStep}
                formData={formData}
                handleInputChange={handleInputChange}
                errors={errors}
                steps={steps}
              />

              {/* Modal footer */}
              <div className="btn-group">
                <button 
                  className="btn btn-prev" 
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                >
                  Back
                </button>
                
                {currentStep < totalSteps ? (
                  <button 
                    className="btn btn-next" 
                    onClick={handleNext}
                  >
                    Continue
                  </button>
                ) : (
                  <button 
                    className="btn btn-submit" 
                    onClick={handleSubmit}
                  >
                    {editingCinema ? 'Update Cinema' : 'Create Cinema'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification.show && (
        <div className={`custom-notification ${notification.type}`}>
          <div className="notification-content">
            <span className="notification-message">{notification.message}</span>
            <button className="notification-close" onClick={closeNotification}>×</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CinemaManagement;