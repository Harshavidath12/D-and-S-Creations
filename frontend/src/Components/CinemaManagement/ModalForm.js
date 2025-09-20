import React from 'react';

const ModalForm = ({ 
  currentStep, 
  formData, 
  handleInputChange, 
  errors, 
  steps 
}) => {
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

      {currentStep === 2 && (
        <div className="step-content active">
          <h4>Movie 1 - Ongoing</h4>
          <div className="form-group">
            <label>Movie Name *</label>
            <input
              type="text"
              name="ongoing_movies.movie_1.name"
              value={formData.ongoing_movies.movie_1.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter movie name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="ongoing_movies.movie_1.start_date"
                value={formData.ongoing_movies.movie_1.start_date}
                onChange={handleInputChange}
                className={errors.start_date ? 'error' : ''}
              />
              {errors.start_date && <span className="error-message">{errors.start_date}</span>}
            </div>
            
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="ongoing_movies.movie_1.end_date"
                value={formData.ongoing_movies.movie_1.end_date}
                onChange={handleInputChange}
                className={errors.end_date ? 'error' : ''}
              />
              {errors.end_date && <span className="error-message">{errors.end_date}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Trailer Link (YouTube)</label>
            <input
              type="url"
              name="ongoing_movies.movie_1.trailer_link"
              value={formData.ongoing_movies.movie_1.trailer_link}
              onChange={handleInputChange}
              className={errors.trailer_link ? 'error' : ''}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.trailer_link && <span className="error-message">{errors.trailer_link}</span>}
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="step-content active">
          <h4>Movie 2 - Ongoing</h4>
          <div className="form-group">
            <label>Movie Name *</label>
            <input
              type="text"
              name="ongoing_movies.movie_2.name"
              value={formData.ongoing_movies.movie_2.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter movie name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="ongoing_movies.movie_2.start_date"
                value={formData.ongoing_movies.movie_2.start_date}
                onChange={handleInputChange}
                className={errors.start_date ? 'error' : ''}
              />
              {errors.start_date && <span className="error-message">{errors.start_date}</span>}
            </div>
            
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="ongoing_movies.movie_2.end_date"
                value={formData.ongoing_movies.movie_2.end_date}
                onChange={handleInputChange}
                className={errors.end_date ? 'error' : ''}
              />
              {errors.end_date && <span className="error-message">{errors.end_date}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Trailer Link (YouTube)</label>
            <input
              type="url"
              name="ongoing_movies.movie_2.trailer_link"
              value={formData.ongoing_movies.movie_2.trailer_link}
              onChange={handleInputChange}
              className={errors.trailer_link ? 'error' : ''}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.trailer_link && <span className="error-message">{errors.trailer_link}</span>}
          </div>
        </div>
      )}

      {currentStep === 4 && (
        <div className="step-content active">
          <h4>Movie 3 - Ongoing</h4>
          <div className="form-group">
            <label>Movie Name *</label>
            <input
              type="text"
              name="ongoing_movies.movie_3.name"
              value={formData.ongoing_movies.movie_3.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter movie name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="ongoing_movies.movie_3.start_date"
                value={formData.ongoing_movies.movie_3.start_date}
                onChange={handleInputChange}
                className={errors.start_date ? 'error' : ''}
              />
              {errors.start_date && <span className="error-message">{errors.start_date}</span>}
            </div>
            
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="ongoing_movies.movie_3.end_date"
                value={formData.ongoing_movies.movie_3.end_date}
                onChange={handleInputChange}
                className={errors.end_date ? 'error' : ''}
              />
              {errors.end_date && <span className="error-message">{errors.end_date}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Trailer Link (YouTube)</label>
            <input
              type="url"
              name="ongoing_movies.movie_3.trailer_link"
              value={formData.ongoing_movies.movie_3.trailer_link}
              onChange={handleInputChange}
              className={errors.trailer_link ? 'error' : ''}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.trailer_link && <span className="error-message">{errors.trailer_link}</span>}
          </div>
        </div>
      )}

      {currentStep === 5 && (
        <div className="step-content active">
          <h4>Movie 4 - Ongoing</h4>
          <div className="form-group">
            <label>Movie Name *</label>
            <input
              type="text"
              name="ongoing_movies.movie_4.name"
              value={formData.ongoing_movies.movie_4.name}
              onChange={handleInputChange}
              className={errors.name ? 'error' : ''}
              placeholder="Enter movie name"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="ongoing_movies.movie_4.start_date"
                value={formData.ongoing_movies.movie_4.start_date}
                onChange={handleInputChange}
                className={errors.start_date ? 'error' : ''}
              />
              {errors.start_date && <span className="error-message">{errors.start_date}</span>}
            </div>
            
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="ongoing_movies.movie_4.end_date"
                value={formData.ongoing_movies.movie_4.end_date}
                onChange={handleInputChange}
                className={errors.end_date ? 'error' : ''}
              />
              {errors.end_date && <span className="error-message">{errors.end_date}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Trailer Link (YouTube)</label>
            <input
              type="url"
              name="ongoing_movies.movie_4.trailer_link"
              value={formData.ongoing_movies.movie_4.trailer_link}
              onChange={handleInputChange}
              className={errors.trailer_link ? 'error' : ''}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            {errors.trailer_link && <span className="error-message">{errors.trailer_link}</span>}
          </div>
        </div>
      )}

      {currentStep === 6 && (
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

      {currentStep === 7 && (
        <div className="step-content active">
          <h4>Review & Submit</h4>
          <div className="review-content">
            <h5>Cinema Details</h5>
            <p><strong>Name:</strong> {formData.cinema_name}</p>
            <p><strong>Location:</strong> {formData.cinema_location}</p>
            <p><strong>Status:</strong> {formData.is_active ? 'Active' : 'Inactive'}</p>
            
            <h5>Ongoing Movies</h5>
            {Object.keys(formData.ongoing_movies).map((key, index) => {
              const movie = formData.ongoing_movies[key];
              if (movie.name) {
                return (
                  <p key={index}>
                    <strong>Movie {index + 1}:</strong> {movie.name} 
                    ({movie.start_date} - {movie.end_date})
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
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalForm;
