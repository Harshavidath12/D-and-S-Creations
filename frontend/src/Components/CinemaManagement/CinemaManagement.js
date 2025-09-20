import React, { useState, useEffect } from 'react';
import './CinemaManagement.css';

const CinemaManagement = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
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

  // Validation functions
  const validateCinemaName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Cinema name is required';
    }
    if (name.trim().length < 2) {
      return 'Cinema name must be at least 2 characters long';
    }
    if (name.trim().length > 100) {
      return 'Cinema name cannot exceed 100 characters';
    }
    if (!/^[a-zA-Z0-9\s\-&.,()]+$/.test(name)) {
      return 'Cinema name contains invalid characters';
    }
    return '';
  };

  const validateCinemaLocation = (location) => {
    if (!location || location.trim().length === 0) {
      return 'Cinema location is required';
    }
    if (location.trim().length < 5) {
      return 'Cinema location must be at least 5 characters long';
    }
    if (location.trim().length > 200) {
      return 'Cinema location cannot exceed 200 characters';
    }
    return '';
  };

  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return '';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      return '';
    }
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const validateYouTubeUrl = (url) => {
    if (!url || url.trim().length === 0) {
      return '';
    }
    // More flexible YouTube URL validation - accepts any YouTube URL
    const youtubeRegex = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/;
    if (!youtubeRegex.test(url)) {
      return 'Please enter a valid YouTube URL';
    }
    return '';
  };

  const validateMovieName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'Movie name is required';
    }
    if (name.trim().length > 100) {
      return 'Movie name cannot exceed 100 characters';
    }
    return '';
  };

  const validateDate = (date, fieldName) => {
    if (!date) {
      return `${fieldName} is required`;
    }
    
    // Date input type="date" provides YYYY-MM-DD format
    const selectedDate = new Date(date);
    
    if (isNaN(selectedDate.getTime())) {
      return 'Please enter a valid date';
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (fieldName === 'Start date' && selectedDate < today) {
      return 'Start date cannot be in the past';
    }
    return '';
  };

  const validateEndDate = (startDate, endDate) => {
    if (!startDate || !endDate) {
      return '';
    }
    
    // Date input type="date" provides YYYY-MM-DD format
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return '';
    }
    
    if (end <= start) {
      return 'End date must be after start date';
    }
    return '';
  };

  const validatePrice = (price, fieldName) => {
    if (price === undefined || price === null || price === '' || price === 0) {
      return '';
    }
    const numPrice = parseFloat(price);
    if (isNaN(numPrice)) {
      return `${fieldName} must be a valid number`;
    }
    if (numPrice < 0) {
      return `${fieldName} cannot be negative`;
    }
    return '';
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1: // General Details
        newErrors.cinema_name = validateCinemaName(formData.cinema_name);
        newErrors.cinema_location = validateCinemaLocation(formData.cinema_location);
        newErrors.email = validateEmail(formData.contact_info.email);
        newErrors.phone = validatePhone(formData.contact_info.phone);
        break;

      case 2: // Movie 1
        newErrors.movie_1_name = validateMovieName(formData.ongoing_movies.movie_1.name);
        newErrors.movie_1_start_date = validateDate(formData.ongoing_movies.movie_1.start_date, 'Start date');
        newErrors.movie_1_end_date = validateDate(formData.ongoing_movies.movie_1.end_date, 'End date');
        newErrors.movie_1_end_date_relation = validateEndDate(formData.ongoing_movies.movie_1.start_date, formData.ongoing_movies.movie_1.end_date);
        newErrors.movie_1_trailer = validateYouTubeUrl(formData.ongoing_movies.movie_1.trailer_link);
        newErrors.movie_1_starting_price = validatePrice(formData.movie_slot_pricing.movie_1.starting_price, 'Starting price');
        newErrors.movie_1_interval_price = validatePrice(formData.movie_slot_pricing.movie_1.interval_price, 'Interval price');
        newErrors.movie_1_ending_price = validatePrice(formData.movie_slot_pricing.movie_1.ending_price, 'Ending price');
        break;

      case 3: // Movie 2
        newErrors.movie_2_name = validateMovieName(formData.ongoing_movies.movie_2.name);
        newErrors.movie_2_start_date = validateDate(formData.ongoing_movies.movie_2.start_date, 'Start date');
        newErrors.movie_2_end_date = validateDate(formData.ongoing_movies.movie_2.end_date, 'End date');
        newErrors.movie_2_end_date_relation = validateEndDate(formData.ongoing_movies.movie_2.start_date, formData.ongoing_movies.movie_2.end_date);
        newErrors.movie_2_trailer = validateYouTubeUrl(formData.ongoing_movies.movie_2.trailer_link);
        newErrors.movie_2_starting_price = validatePrice(formData.movie_slot_pricing.movie_2.starting_price, 'Starting price');
        newErrors.movie_2_interval_price = validatePrice(formData.movie_slot_pricing.movie_2.interval_price, 'Interval price');
        newErrors.movie_2_ending_price = validatePrice(formData.movie_slot_pricing.movie_2.ending_price, 'Ending price');
        break;

      case 4: // Movie 3
        newErrors.movie_3_name = validateMovieName(formData.ongoing_movies.movie_3.name);
        newErrors.movie_3_start_date = validateDate(formData.ongoing_movies.movie_3.start_date, 'Start date');
        newErrors.movie_3_end_date = validateDate(formData.ongoing_movies.movie_3.end_date, 'End date');
        newErrors.movie_3_end_date_relation = validateEndDate(formData.ongoing_movies.movie_3.start_date, formData.ongoing_movies.movie_3.end_date);
        newErrors.movie_3_trailer = validateYouTubeUrl(formData.ongoing_movies.movie_3.trailer_link);
        newErrors.movie_3_starting_price = validatePrice(formData.movie_slot_pricing.movie_3.starting_price, 'Starting price');
        newErrors.movie_3_interval_price = validatePrice(formData.movie_slot_pricing.movie_3.interval_price, 'Interval price');
        newErrors.movie_3_ending_price = validatePrice(formData.movie_slot_pricing.movie_3.ending_price, 'Ending price');
        break;

      case 5: // Movie 4
        newErrors.movie_4_name = validateMovieName(formData.ongoing_movies.movie_4.name);
        newErrors.movie_4_start_date = validateDate(formData.ongoing_movies.movie_4.start_date, 'Start date');
        newErrors.movie_4_end_date = validateDate(formData.ongoing_movies.movie_4.end_date, 'End date');
        newErrors.movie_4_end_date_relation = validateEndDate(formData.ongoing_movies.movie_4.start_date, formData.ongoing_movies.movie_4.end_date);
        newErrors.movie_4_trailer = validateYouTubeUrl(formData.ongoing_movies.movie_4.trailer_link);
        newErrors.movie_4_starting_price = validatePrice(formData.movie_slot_pricing.movie_4.starting_price, 'Starting price');
        newErrors.movie_4_interval_price = validatePrice(formData.movie_slot_pricing.movie_4.interval_price, 'Interval price');
        newErrors.movie_4_ending_price = validatePrice(formData.movie_slot_pricing.movie_4.ending_price, 'Ending price');
        break;

      case 6: // Upcoming Movies
        if (formData.upcoming_movies.movie_1.name) {
          newErrors.upcoming_movie_1_name = validateMovieName(formData.upcoming_movies.movie_1.name);
        }
        if (formData.upcoming_movies.movie_1.trailer_link) {
          newErrors.upcoming_movie_1_trailer = validateYouTubeUrl(formData.upcoming_movies.movie_1.trailer_link);
        }
        if (formData.upcoming_movies.movie_2.name) {
          newErrors.upcoming_movie_2_name = validateMovieName(formData.upcoming_movies.movie_2.name);
        }
        if (formData.upcoming_movies.movie_2.trailer_link) {
          newErrors.upcoming_movie_2_trailer = validateYouTubeUrl(formData.upcoming_movies.movie_2.trailer_link);
        }
        break;
    }

    // Remove empty error messages
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(prev => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleMovieChange = (movieKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      ongoing_movies: {
        ...prev.ongoing_movies,
        [movieKey]: {
          ...prev.ongoing_movies[movieKey],
          [field]: value
        }
      }
    }));

    // Clear error when user starts typing
    const errorKey = `${movieKey}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handlePricingChange = (movieKey, priceType, value) => {
    setFormData(prev => ({
      ...prev,
      movie_slot_pricing: {
        ...prev.movie_slot_pricing,
        [movieKey]: {
          ...prev.movie_slot_pricing[movieKey],
          [priceType]: parseInt(value) || 0
        }
      }
    }));

    // Clear error when user starts typing
    const errorKey = `${movieKey}_${priceType}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleUpcomingMovieChange = (movieKey, field, value) => {
    setFormData(prev => ({
      ...prev,
      upcoming_movies: {
        ...prev.upcoming_movies,
        [movieKey]: {
          ...prev.upcoming_movies[movieKey],
          [field]: value
        }
      }
    }));

    // Clear error when user starts typing
    const errorKey = `upcoming_${movieKey}_${field}`;
    if (errors[errorKey]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
        // Clear errors for the next step
        setErrors({});
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      // Clear errors when going back
      setErrors({});
    }
  };

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        const response = await fetch('http://localhost:5000/api/cinemas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();
        
        if (result.success) {
          alert('Cinema created successfully!');
          setIsModalOpen(false);
          setCurrentStep(1);
          setErrors({}); // Clear all errors on success
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
        } else {
          alert('Error creating cinema: ' + result.message);
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error creating cinema');
      }
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <GeneralDetailsStep formData={formData} handleInputChange={handleInputChange} errors={errors} />;
      case 2:
        return <MovieStep movieKey="movie_1" movieData={formData.ongoing_movies.movie_1} formData={formData} handleMovieChange={handleMovieChange} handlePricingChange={handlePricingChange} stepNumber={1} errors={errors} />;
      case 3:
        return <MovieStep movieKey="movie_2" movieData={formData.ongoing_movies.movie_2} formData={formData} handleMovieChange={handleMovieChange} handlePricingChange={handlePricingChange} stepNumber={2} errors={errors} />;
      case 4:
        return <MovieStep movieKey="movie_3" movieData={formData.ongoing_movies.movie_3} formData={formData} handleMovieChange={handleMovieChange} handlePricingChange={handlePricingChange} stepNumber={3} errors={errors} />;
      case 5:
        return <MovieStep movieKey="movie_4" movieData={formData.ongoing_movies.movie_4} formData={formData} handleMovieChange={handleMovieChange} handlePricingChange={handlePricingChange} stepNumber={4} errors={errors} />;
      case 6:
        return <UpcomingMoviesStep formData={formData} handleUpcomingMovieChange={handleUpcomingMovieChange} errors={errors} />;
      case 7:
        return <ReviewStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <div className="cinema-management">
      <div className="page-header">
        <div className="container">
          <h1>Cinema Management</h1>
          <p>Manage your cinema locations and movie schedules</p>
          <button className="cta-btn" onClick={() => {
            setIsModalOpen(true);
            setErrors({}); // Clear all errors when opening modal
          }}>
            Add New Cinema
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>Add New Cinema</h2>
              <button className="close-btn" onClick={() => {
                setIsModalOpen(false);
                setErrors({}); // Clear all errors when closing modal
              }}>
                ×
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-layout">
                <div className="step-content-area">
                  <div className="progress-bar">
                    {steps.map((step) => (
                      <div 
                        key={step.id} 
                        className={`progress-step ${currentStep === step.id ? 'active' : currentStep > step.id ? 'completed' : ''}`}
                      >
                        {step.id}
                      </div>
                    ))}
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <h3>{steps[currentStep - 1].title}</h3>
                      <p>{steps[currentStep - 1].description}</p>
                    </div>
                    <div className="step-form">
                      {renderStepContent()}
                    </div>
                  </div>
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={prevStep} 
                    disabled={currentStep === 1}
                  >
                    Previous
                  </button>
                  <div className="step-counter">
                    Step {currentStep} of {totalSteps}
                  </div>
                  {currentStep === totalSteps ? (
                    <button className="btn-primary" onClick={handleSubmit}>
                      Create Cinema
                    </button>
                  ) : (
                    <button className="btn-primary" onClick={nextStep}>
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// General Details Step Component
const GeneralDetailsStep = ({ formData, handleInputChange, errors }) => (
  <div className="step-content-wrapper">
    <h3>General Cinema Details</h3>
    <div className="form-grid">
      <div className="form-group">
        <label>Cinema Name *</label>
        <input
          type="text"
          value={formData.cinema_name}
          onChange={(e) => handleInputChange('cinema_name', e.target.value)}
          placeholder="Enter cinema name"
          className={errors.cinema_name ? 'error' : ''}
          required
        />
        {errors.cinema_name && <div className="error-message">{errors.cinema_name}</div>}
      </div>

      <div className="form-group">
        <label>Location *</label>
        <input
          type="text"
          value={formData.cinema_location}
          onChange={(e) => handleInputChange('cinema_location', e.target.value)}
          placeholder="Enter cinema location"
          className={errors.cinema_location ? 'error' : ''}
          required
        />
        {errors.cinema_location && <div className="error-message">{errors.cinema_location}</div>}
      </div>

      <div className="form-group full-width">
        <label>Google Maps Location</label>
        <input
          type="url"
          value={formData.google_maps_location}
          onChange={(e) => handleInputChange('google_maps_location', e.target.value)}
          placeholder="https://maps.google.com/..."
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          value={formData.contact_info.phone}
          onChange={(e) => handleInputChange('contact_info.phone', e.target.value)}
          placeholder="Enter phone number"
          className={errors.phone ? 'error' : ''}
        />
        {errors.phone && <div className="error-message">{errors.phone}</div>}
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={formData.contact_info.email}
          onChange={(e) => handleInputChange('contact_info.email', e.target.value)}
          placeholder="Enter email address"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>
    </div>
  </div>
);

// Movie Step Component
const MovieStep = ({ movieKey, movieData, formData, handleMovieChange, handlePricingChange, stepNumber, errors }) => (
  <div className="step-content-wrapper">
    <h3>Movie {stepNumber} Details</h3>
    
    <div className="form-grid">
      <div className="form-group full-width">
        <label>Movie Name *</label>
        <input
          type="text"
          value={movieData.name}
          onChange={(e) => handleMovieChange(movieKey, 'name', e.target.value)}
          placeholder="Enter movie name"
          className={errors[`${movieKey}_name`] ? 'error' : ''}
          required
        />
        {errors[`${movieKey}_name`] && <div className="error-message">{errors[`${movieKey}_name`]}</div>}
      </div>

      <div className="form-group">
        <label>Start Date *</label>
        <input
          type="date"
          value={movieData.start_date}
          onChange={(e) => handleMovieChange(movieKey, 'start_date', e.target.value)}
          className={errors[`${movieKey}_start_date`] ? 'error' : ''}
          required
        />
        {errors[`${movieKey}_start_date`] && <div className="error-message">{errors[`${movieKey}_start_date`]}</div>}
      </div>

      <div className="form-group">
        <label>End Date *</label>
        <input
          type="date"
          value={movieData.end_date}
          onChange={(e) => handleMovieChange(movieKey, 'end_date', e.target.value)}
          min={movieData.start_date || ''}
          className={errors[`${movieKey}_end_date`] || errors[`${movieKey}_end_date_relation`] ? 'error' : ''}
          required
        />
        {(errors[`${movieKey}_end_date`] || errors[`${movieKey}_end_date_relation`]) && (
          <div className="error-message">{errors[`${movieKey}_end_date`] || errors[`${movieKey}_end_date_relation`]}</div>
        )}
      </div>

      <div className="form-group full-width">
        <label>Trailer Link</label>
        <input
          type="url"
          value={movieData.trailer_link}
          onChange={(e) => handleMovieChange(movieKey, 'trailer_link', e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className={errors[`${movieKey}_trailer`] ? 'error' : ''}
        />
        {errors[`${movieKey}_trailer`] && <div className="error-message">{errors[`${movieKey}_trailer`]}</div>}
      </div>
    </div>

    <div className="pricing-section">
      <h4>Advertisement Slot Pricing (LKR)</h4>
      <p className="section-description">Set prices for the 15 advertisement slots for this movie (5 slots per category).</p>
      <div className="pricing-grid">
        <div className="pricing-group">
          <label>Starting Price (Slots 1-5)</label>
          <div className="price-input-container">
            <span className="currency-symbol">LKR</span>
            <input
              type="number"
              min="0"
              value={formData.movie_slot_pricing[movieKey].starting_price}
              onChange={(e) => handlePricingChange(movieKey, 'starting_price', e.target.value)}
              placeholder="0"
              className={errors[`${movieKey}_starting_price`] ? 'error' : ''}
            />
          </div>
          {errors[`${movieKey}_starting_price`] && <div className="error-message">{errors[`${movieKey}_starting_price`]}</div>}
        </div>
        
        <div className="pricing-group">
          <label>Interval Price (Slots 6-10)</label>
          <div className="price-input-container">
            <span className="currency-symbol">LKR</span>
            <input
              type="number"
              min="0"
              value={formData.movie_slot_pricing[movieKey].interval_price}
              onChange={(e) => handlePricingChange(movieKey, 'interval_price', e.target.value)}
              placeholder="0"
              className={errors[`${movieKey}_interval_price`] ? 'error' : ''}
            />
          </div>
          {errors[`${movieKey}_interval_price`] && <div className="error-message">{errors[`${movieKey}_interval_price`]}</div>}
        </div>
        
        <div className="pricing-group">
          <label>Ending Price (Slots 11-15)</label>
          <div className="price-input-container">
            <span className="currency-symbol">LKR</span>
            <input
              type="number"
              min="0"
              value={formData.movie_slot_pricing[movieKey].ending_price}
              onChange={(e) => handlePricingChange(movieKey, 'ending_price', e.target.value)}
              placeholder="0"
              className={errors[`${movieKey}_ending_price`] ? 'error' : ''}
            />
          </div>
          {errors[`${movieKey}_ending_price`] && <div className="error-message">{errors[`${movieKey}_ending_price`]}</div>}
        </div>
      </div>
    </div>
  </div>
);

// Upcoming Movies Step Component
const UpcomingMoviesStep = ({ formData, handleUpcomingMovieChange, errors }) => (
  <div className="step-content-wrapper">
    <h3>Upcoming Movies</h3>
    <p className="section-description">Provide details for movies that will be released soon.</p>

    <div className="movies-grid">
      <div className="movie-card">
        <h4>Upcoming Movie 1</h4>
        <div className="form-group">
          <label>Movie Name</label>
          <input
            type="text"
            value={formData.upcoming_movies.movie_1.name}
            onChange={(e) => handleUpcomingMovieChange('movie_1', 'name', e.target.value)}
            placeholder="Enter movie name"
            className={errors.upcoming_movie_1_name ? 'error' : ''}
          />
          {errors.upcoming_movie_1_name && <div className="error-message">{errors.upcoming_movie_1_name}</div>}
        </div>
        <div className="form-group">
          <label>Trailer Link</label>
          <input
            type="url"
            value={formData.upcoming_movies.movie_1.trailer_link}
            onChange={(e) => handleUpcomingMovieChange('movie_1', 'trailer_link', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={errors.upcoming_movie_1_trailer ? 'error' : ''}
          />
          {errors.upcoming_movie_1_trailer && <div className="error-message">{errors.upcoming_movie_1_trailer}</div>}
        </div>
      </div>

      <div className="movie-card">
        <h4>Upcoming Movie 2</h4>
        <div className="form-group">
          <label>Movie Name</label>
          <input
            type="text"
            value={formData.upcoming_movies.movie_2.name}
            onChange={(e) => handleUpcomingMovieChange('movie_2', 'name', e.target.value)}
            placeholder="Enter movie name"
            className={errors.upcoming_movie_2_name ? 'error' : ''}
          />
          {errors.upcoming_movie_2_name && <div className="error-message">{errors.upcoming_movie_2_name}</div>}
        </div>
        <div className="form-group">
          <label>Trailer Link</label>
          <input
            type="url"
            value={formData.upcoming_movies.movie_2.trailer_link}
            onChange={(e) => handleUpcomingMovieChange('movie_2', 'trailer_link', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className={errors.upcoming_movie_2_trailer ? 'error' : ''}
          />
          {errors.upcoming_movie_2_trailer && <div className="error-message">{errors.upcoming_movie_2_trailer}</div>}
        </div>
      </div>
    </div>
  </div>
);

// Review Step Component
const ReviewStep = ({ formData }) => (
  <div className="step-content-wrapper">
    <h3>Review & Submit</h3>
    <p className="section-description">Please review all the information you've entered before submitting.</p>

    <div className="review-section">
      <h4>General Information</h4>
      <p><strong>Cinema Name:</strong> {formData.cinema_name || 'N/A'}</p>
      <p><strong>Location:</strong> {formData.cinema_location || 'N/A'}</p>
      <p><strong>Google Maps:</strong> {formData.google_maps_location ? <a href={formData.google_maps_location} target="_blank" rel="noopener noreferrer">View Map</a> : 'N/A'}</p>
      <p><strong>Contact Phone:</strong> {formData.contact_info.phone || 'N/A'}</p>
      <p><strong>Contact Email:</strong> {formData.contact_info.email || 'N/A'}</p>
    </div>

    {['movie_1', 'movie_2', 'movie_3', 'movie_4'].map((movieKey, index) => {
      const movie = formData.ongoing_movies[movieKey];
      const pricing = formData.movie_slot_pricing[movieKey];
      if (movie.name) {
        return (
          <div key={movieKey} className="review-section">
            <h4>Ongoing Movie {index + 1}: {movie.name}</h4>
            <p><strong>Start Date:</strong> {movie.start_date || 'N/A'}</p>
            <p><strong>End Date:</strong> {movie.end_date || 'N/A'}</p>
            <p><strong>Trailer:</strong> {movie.trailer_link ? <a href={movie.trailer_link} target="_blank" rel="noopener noreferrer">Watch Trailer</a> : 'N/A'}</p>
            <p><strong>Starting Price:</strong> {pricing.starting_price !== undefined ? `LKR ${pricing.starting_price}` : 'N/A'}</p>
            <p><strong>Interval Price:</strong> {pricing.interval_price !== undefined ? `LKR ${pricing.interval_price}` : 'N/A'}</p>
            <p><strong>Ending Price:</strong> {pricing.ending_price !== undefined ? `LKR ${pricing.ending_price}` : 'N/A'}</p>
          </div>
        );
      }
      return null;
    })}

    {['movie_1', 'movie_2'].map((movieKey, index) => {
      const movie = formData.upcoming_movies[movieKey];
      if (movie.name) {
        return (
          <div key={`upcoming-${movieKey}`} className="review-section">
            <h4>Upcoming Movie {index + 1}: {movie.name}</h4>
            <p><strong>Trailer:</strong> {movie.trailer_link ? <a href={movie.trailer_link} target="_blank" rel="noopener noreferrer">Watch Trailer</a> : 'N/A'}</p>
          </div>
        );
      }
      return null;
    })}
  </div>
);

export default CinemaManagement;