import React from 'react';

const ModalForm = ({ 
  currentStep, 
  formData, 
  handleInputChange, 
  errors, 
  steps,
  validateMovie,
  setErrors
}) => {
  // Function to format dates for display
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    // Handle both Date objects and date strings
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'N/A';
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to handle date validation on blur
  const handleDateBlur = (e) => {
    const { name, value } = e.target;
    const movieKey = name.split('.')[1]; // Extract movie key (movie_1, movie_2, etc.)
    const field = name.split('.')[2]; // Extract field name (start_date, end_date)
    const movie = formData.ongoing_movies[movieKey];
    
    console.log('🔍 Date blur debug:', {
      name,
      value,
      movieKey,
      field,
      movieName: movie?.name,
      currentStartDate: movie?.start_date,
      currentEndDate: movie?.end_date,
      hasMovieName: movie && movie.name && movie.name.trim().length > 0
    });
    
    if (movie && movie.name && movie.name.trim().length > 0) {
      // Create a temporary movie object with the updated value for validation
      const tempMovie = {
        ...movie,
        [field]: value
      };
      
      console.log('🔍 Temp movie for validation:', tempMovie);
      
      const movieErrors = validateMovie(tempMovie, movieKey.split('_')[1]);
      console.log('🔍 Validation errors:', movieErrors);
      
      // Update errors state with new validation results
      setErrors(prev => ({
        ...prev,
        ...movieErrors
      }));
    }
  };

  // Function to get minimum date for end date input
  const getMinEndDate = (movieKey) => {
    const movie = formData.ongoing_movies[movieKey];
    if (movie && movie.start_date) {
      // Set min date to start_date + 1 day
      const startDate = new Date(movie.start_date);
      startDate.setDate(startDate.getDate() + 1);
      return startDate.toISOString().split('T')[0];
    }
    return '';
  };

  // Function to get minimum date for start date input (today)
  const getMinStartDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Render movie form dynamically
  const renderMovieForm = (movieNumber) => {
    const movieKey = `movie_${movieNumber}`;
    const movie = formData.ongoing_movies[movieKey];
    const pricing = formData.movie_slot_pricing[movieKey];

    if (!movie || !pricing) return null;

    return (
      <div className="step-content active" key={movieKey}>
        <h4>Movie {movieNumber} - Ongoing</h4>
        <div className="form-group">
          <label>Movie Name *</label>
          <input
            type="text"
            name={`ongoing_movies.${movieKey}.name`}
            value={movie.name}
            onChange={handleInputChange}
            className={errors.name ? 'error' : ''}
            placeholder="Enter movie name (optional)"
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label>Start Date *</label>
            <input
              type="date"
              name={`ongoing_movies.${movieKey}.start_date`}
              value={movie.start_date}
              onChange={handleInputChange}
              onBlur={handleDateBlur}
              min={getMinStartDate()}
              className={errors.start_date ? 'error' : ''}
              placeholder="Select start date (optional)"
            />
            {errors.start_date && <span className="error-message">{errors.start_date}</span>}
          </div>
          
          <div className="form-group">
            <label>End Date *</label>
            <input
              type="date"
              name={`ongoing_movies.${movieKey}.end_date`}
              value={movie.end_date}
              onChange={handleInputChange}
              onBlur={handleDateBlur}
              min={getMinEndDate(movieKey)}
              className={errors.end_date ? 'error' : ''}
              placeholder="Select end date (optional)"
            />
            {errors.end_date && <span className="error-message">{errors.end_date}</span>}
          </div>
        </div>
        
        <div className="form-group">
          <label>Trailer Link (YouTube) *</label>
          <input
            type="url"
            name={`ongoing_movies.${movieKey}.trailer_link`}
            value={movie.trailer_link}
            onChange={handleInputChange}
            className={errors.trailer_link ? 'error' : ''}
            placeholder="https://www.youtube.com/watch?v=..."
          />
          {errors.trailer_link && <span className="error-message">{errors.trailer_link}</span>}
        </div>

        {/* Movie Slot Pricing */}
        <div className="movie-pricing-section">
          <h5>Advertisement Slot Pricing for Movie {movieNumber}</h5>
          <div className="pricing-grid">
            <div className="form-group">
              <label>Starting Slots Price (LKR)</label>
              <input
                type="number"
                name={`movie_slot_pricing.${movieKey}.starting_price`}
                value={pricing.starting_price}
                onChange={handleInputChange}
                className={errors[`movie_${movieNumber}_starting_price`] ? 'error' : ''}
                placeholder="Enter starting slots price"
                min="0"
              />
              {errors[`movie_${movieNumber}_starting_price`] && <span className="error-message">{errors[`movie_${movieNumber}_starting_price`]}</span>}
              <small>Price for slots 1-5 (before movie starts)</small>
            </div>
            
            <div className="form-group">
              <label>Interval Slots Price (LKR)</label>
              <input
                type="number"
                name={`movie_slot_pricing.${movieKey}.interval_price`}
                value={pricing.interval_price}
                onChange={handleInputChange}
                className={errors[`movie_${movieNumber}_interval_price`] ? 'error' : ''}
                placeholder="Enter interval slots price"
                min="0"
              />
              {errors[`movie_${movieNumber}_interval_price`] && <span className="error-message">{errors[`movie_${movieNumber}_interval_price`]}</span>}
              <small>Price for slots 6-10 (during movie interval)</small>
            </div>
            
            <div className="form-group">
              <label>Ending Slots Price (LKR)</label>
              <input
                type="number"
                name={`movie_slot_pricing.${movieKey}.ending_price`}
                value={pricing.ending_price}
                onChange={handleInputChange}
                className={errors[`movie_${movieNumber}_ending_price`] ? 'error' : ''}
                placeholder="Enter ending slots price"
                min="0"
              />
              {errors[`movie_${movieNumber}_ending_price`] && <span className="error-message">{errors[`movie_${movieNumber}_ending_price`]}</span>}
              <small>Price for slots 11-15 (after movie ends)</small>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="form-content">
      {currentStep === 1 && (
        <div className="step-content active">
          <h4>General Details</h4>
          <div className="form-group">
            <label>Cinema Name *</label>
            <input
              type="text"
              name="cinema_name"
              value={formData.cinema_name}
              onChange={handleInputChange}
              className={errors.cinema_name ? 'error' : ''}
              placeholder="Enter cinema name"
            />
            {errors.cinema_name && <span className="error-message">{errors.cinema_name}</span>}
          </div>
          
          <div className="form-group">
            <label>Cinema Location *</label>
            <input
              type="text"
              name="cinema_location"
              value={formData.cinema_location}
              onChange={handleInputChange}
              className={errors.cinema_location ? 'error' : ''}
              placeholder="Enter cinema location"
            />
            {errors.cinema_location && <span className="error-message">{errors.cinema_location}</span>}
          </div>
          
          <div className="form-group">
            <label>Google Maps Location</label>
            <input
              type="url"
              name="google_maps_location"
              value={formData.google_maps_location}
              onChange={handleInputChange}
              placeholder="https://maps.google.com/..."
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                name="contact_info.phone"
                value={formData.contact_info.phone}
                onChange={handleInputChange}
                placeholder="+94 11 234 5678"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="contact_info.email"
                value={formData.contact_info.email}
                onChange={handleInputChange}
                placeholder="info@cinema.com"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label>Number of Ongoing Movies *</label>
            <input
              type="number"
              name="number_of_movies"
              value={formData.number_of_movies || 1}
              onChange={handleInputChange}
              className={errors.number_of_movies ? 'error' : ''}
              placeholder="Enter number of movies"
              min="1"
              max="4"
            />
            {errors.number_of_movies && <span className="error-message">{errors.number_of_movies}</span>}
            <small>Specify how many ongoing movies (1-4)</small>
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
              />
              Active Cinema
            </label>
          </div>
        </div>
      )}

      {/* Dynamically render movie forms based on number_of_movies */}
      {currentStep >= 2 && currentStep <= (formData.number_of_movies || 0) + 1 && (
        renderMovieForm(currentStep - 1)
      )}

      {/* Upcoming Movies Step */}
      {currentStep === (formData.number_of_movies || 0) + 2 && (
        <div className="step-content active">
          <h4>Upcoming Movies</h4>
          <div className="form-group">
            <label>Upcoming Movie 1 Name *</label>
            <input
              type="text"
              name="upcoming_movies.movie_1.name"
              value={formData.upcoming_movies.movie_1.name}
              onChange={handleInputChange}
              placeholder="Enter upcoming movie name"
            />
          </div>
          
          <div className="form-group">
            <label>Upcoming Movie 1 Trailer Link</label>
            <input
              type="url"
              name="upcoming_movies.movie_1.trailer_link"
              value={formData.upcoming_movies.movie_1.trailer_link}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          
          <div className="form-group">
            <label>Upcoming Movie 2 Name *</label>
            <input
              type="text"
              name="upcoming_movies.movie_2.name"
              value={formData.upcoming_movies.movie_2.name}
              onChange={handleInputChange}
              placeholder="Enter upcoming movie name"
            />
          </div>
          
          <div className="form-group">
            <label>Upcoming Movie 2 Trailer Link</label>
            <input
              type="url"
              name="upcoming_movies.movie_2.trailer_link"
              value={formData.upcoming_movies.movie_2.trailer_link}
              onChange={handleInputChange}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        </div>
      )}

      {/* Review & Submit Step */}
      {currentStep === (formData.number_of_movies || 0) + 3 && (
        <div className="step-content active">
          <h4>Review & Submit</h4>
          <div className="review-content">
            <h5>Cinema Details</h5>
            <p><strong>Name:</strong> {formData.cinema_name}</p>
            <p><strong>Location:</strong> {formData.cinema_location}</p>
            <p><strong>Number of Movies:</strong> {formData.number_of_movies}</p>
            <p><strong>Status:</strong> {formData.is_active ? 'Active' : 'Inactive'}</p>
            
            <h5>Ongoing Movies</h5>
            {Object.keys(formData.ongoing_movies).map((key, index) => {
              const movie = formData.ongoing_movies[key];
              if (movie.name) {
                return (
                  <p key={index}>
                    <strong>Movie {index + 1}:</strong> {movie.name} 
                    ({formatDate(movie.start_date)} - {formatDate(movie.end_date)})
                  </p>
                );
              }
              return null;
            })}
            
            <h5>Upcoming Movies</h5>
            {Object.keys(formData.upcoming_movies).map((key, index) => {
              const movie = formData.upcoming_movies[key];
              if (movie.name) {
                return (
                  <p key={index}>
                    <strong>Upcoming {index + 1}:</strong> {movie.name}
                  </p>
                );
              }
              return null;
            })}
            
            <h5>Movie Slot Pricing</h5>
            {Object.keys(formData.movie_slot_pricing).map((movieKey, index) => {
              const movie = formData.ongoing_movies[movieKey];
              const pricing = formData.movie_slot_pricing[movieKey];
              if (movie && movie.name) {
                return (
                  <div key={movieKey} style={{ marginBottom: '15px', padding: '10px', background: '#f8f9fa', borderRadius: '6px' }}>
                    <p><strong>{movie.name}:</strong></p>
                    <p style={{ marginLeft: '20px', fontSize: '14px' }}>
                      Starting: LKR {pricing.starting_price} | 
                      Interval: LKR {pricing.interval_price} | 
                      Ending: LKR {pricing.ending_price}
                    </p>
                  </div>
                );
              }
              return null;
            })}
            
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalForm;
