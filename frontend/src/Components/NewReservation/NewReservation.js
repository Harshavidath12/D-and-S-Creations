import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./NewReservation.css";

function NewReservation() {
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  // Fetch cinemas from API
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        console.log('Fetching cinemas...');
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/cinemas');
        const data = await response.json();
        
        if (data.success) {
          console.log('Cinemas loaded:', data.data.length);
          setCinemas(data.data);
        } else {
          console.error('Error fetching cinemas:', data.message);
        }
      } catch (error) {
        console.error('Error fetching cinemas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleCinemaSelect = (cinema) => {
    setSelectedCinema(cinema);
    setSelectedMovie(null);
    setSelectedSlots([]);
    setCurrentStep(2);
    console.log('Selected cinema:', cinema.cinema_name);
  };

  const handleMovieSelect = (movieKey, movieName) => {
    setSelectedMovie({ key: movieKey, name: movieName });
    setSelectedSlots([]);
    setCurrentStep(3);
    console.log('Selected movie:', movieName);
  };

  const handleSlotSelect = (slot) => {
    const isSelected = selectedSlots.some(s => s.slot_id === slot.slot_id);
    
    if (isSelected) {
      setSelectedSlots(prev => prev.filter(s => s.slot_id !== slot.slot_id));
    } else {
      setSelectedSlots(prev => [...prev, slot]);
    }
  };

  const getAvailableSlots = () => {
    if (!selectedCinema || !selectedMovie) return { starting: [], interval: [], ending: [] };
    
    const movieSlots = selectedCinema.movie_slot_pricing?.[selectedMovie.key]?.slots || [];
    
    return {
      starting: movieSlots.filter(slot => slot.slot_type === 'starting'),
      interval: movieSlots.filter(slot => slot.slot_type === 'interval'),
      ending: movieSlots.filter(slot => slot.slot_type === 'ending')
    };
  };

  const calculateTotal = () => {
    return selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
  };

  return (
    <div>
      {/* Navbar */}
      <Nav />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Book Advertisement Slots</h1>
          <p>Select a cinema to view available movies and slots</p>
        </div>
      </section>

      {/* Main Content */}
      <section className="reservation-section">
        <div className="container">
          <div className="reservation-form">
            {/* Step Indicator */}
            <div className="container-fluid">
              <br /><br />
              <ul className="list-unstyled multi-steps">
                <li className={currentStep === 1 ? 'is-active' : ''}>Select Cinema</li>
                <li className={currentStep === 2 ? 'is-active' : ''}>Select Movie</li>
                <li className={currentStep === 3 ? 'is-active' : ''}>Select Slots</li>
                <li className={currentStep === 4 ? 'is-active' : ''}>Confirm</li>
              </ul>
            </div>

            {/* Step 1: Select Cinema */}
            {currentStep === 1 && (
              <div>
                <h2>Step 1: Select Cinema</h2>
                
                {loading ? (
                  <div className="loading-message">
                    <p>Loading cinemas...</p>
                  </div>
                ) : (
                  <div>
                    <h3>Available Cinemas ({cinemas.length})</h3>
                    
                    <table className="cinema-table">
                      <thead>
                        <tr>
                          <th>Cinema Name</th>
                          <th>Location</th>
                          <th>Contact</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cinemas.map((cinema) => (
                          <tr key={cinema._id}>
                            <td>
                              <strong>{cinema.cinema_name}</strong>
                            </td>
                            <td>{cinema.cinema_location}</td>
                            <td>
                              {cinema.contact_info?.phone && (
                                <div>Phone: {cinema.contact_info.phone}</div>
                              )}
                              {cinema.contact_info?.email && (
                                <div>Email: {cinema.contact_info.email}</div>
                              )}
                            </td>
                            <td>
                              <button 
                                className="select-cinema-btn"
                                onClick={() => handleCinemaSelect(cinema)}
                              >
                                Select This Cinema
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Select Movie */}
            {currentStep === 2 && selectedCinema && (
              <div>
                <h2>Step 2: Select Movie</h2>
                <div className="selected-cinema-info">
                  <h3>Selected Cinema: {selectedCinema.cinema_name}</h3>
                  <p><strong>Location:</strong> {selectedCinema.cinema_location}</p>
                </div>
                
                <h3>Available Movies:</h3>
                <div className="movies-list">
                  {selectedCinema.ongoing_movies && Object.entries(selectedCinema.ongoing_movies).map(([key, movie]) => (
                    movie && movie.name ? (
                      <div key={key} className="movie-item">
                        <h5>{movie.name}</h5>
                        <p>Start: {new Date(movie.start_date).toLocaleDateString()}</p>
                        <p>End: {new Date(movie.end_date).toLocaleDateString()}</p>
                        {movie.trailer_link && (
                          <a href={movie.trailer_link} target="_blank" rel="noopener noreferrer">
                            Watch Trailer
                          </a>
                        )}
                        <button 
                          className="select-movie-btn"
                          onClick={() => handleMovieSelect(key, movie.name)}
                        >
                          Select This Movie
                        </button>
                      </div>
                    ) : null
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Select Slots */}
            {currentStep === 3 && selectedCinema && selectedMovie && (
              <div>
                <h2>Step 3: Select Advertisement Slots</h2>
                <div className="selected-info">
                  <p><strong>Cinema:</strong> {selectedCinema.cinema_name}</p>
                  <p><strong>Movie:</strong> {selectedMovie.name}</p>
                </div>
                
                {(() => {
                  const slots = getAvailableSlots();
                  return (
                    <div className="slots-selection">
                      {/* Starting Slots */}
                      <div className="slot-category">
                        <h4>Starting Slots (Before Movie)</h4>
                        <div className="slots-grid">
                          {slots.starting.map((slot) => (
                            <div 
                              key={`starting_${slot.slot_number}`}
                              className={`slot-item ${selectedSlots.some(s => s.slot_id === `starting_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `starting_${slot.slot_number}`,
                                slot_type: 'starting',
                                slot_number: slot.slot_number,
                                price: slot.price
                              })}
                            >
                              <div className="slot-number">Slot {slot.slot_number}</div>
                              <div className="slot-price">₹{slot.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interval Slots */}
                      <div className="slot-category">
                        <h4>Interval Slots (During Movie)</h4>
                        <div className="slots-grid">
                          {slots.interval.map((slot) => (
                            <div 
                              key={`interval_${slot.slot_number}`}
                              className={`slot-item ${selectedSlots.some(s => s.slot_id === `interval_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `interval_${slot.slot_number}`,
                                slot_type: 'interval',
                                slot_number: slot.slot_number,
                                price: slot.price
                              })}
                            >
                              <div className="slot-number">Slot {slot.slot_number}</div>
                              <div className="slot-price">₹{slot.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ending Slots */}
                      <div className="slot-category">
                        <h4>Ending Slots (After Movie)</h4>
                        <div className="slots-grid">
                          {slots.ending.map((slot) => (
                            <div 
                              key={`ending_${slot.slot_number}`}
                              className={`slot-item ${selectedSlots.some(s => s.slot_id === `ending_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `ending_${slot.slot_number}`,
                                slot_type: 'ending',
                                slot_number: slot.slot_number,
                                price: slot.price
                              })}
                            >
                              <div className="slot-number">Slot {slot.slot_number}</div>
                              <div className="slot-price">₹{slot.price}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {selectedSlots.length > 0 && (
                        <div className="selected-slots-summary">
                          <h4>Selected Slots ({selectedSlots.length})</h4>
                          <div className="selected-slots-list">
                            {selectedSlots.map(slot => (
                              <div key={slot.slot_id} className="selected-slot">
                                {slot.slot_type.charAt(0).toUpperCase() + slot.slot_type.slice(1)} Slot {slot.slot_number} - ₹{slot.price}
                              </div>
                            ))}
                          </div>
                          <div className="total-price">
                            <strong>Total: ₹{calculateTotal()}</strong>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div>
                <h2>Step 4: Confirmation</h2>
                <div className="confirmation-summary">
                  <h3>Reservation Summary</h3>
                  <div className="summary-details">
                    <p><strong>Cinema:</strong> {selectedCinema?.cinema_name}</p>
                    <p><strong>Movie:</strong> {selectedMovie?.name}</p>
                    <p><strong>Selected Slots:</strong> {selectedSlots.length}</p>
                    <p><strong>Total Amount:</strong> ₹{calculateTotal()}</p>
                  </div>
                  <button className="confirm-reservation-btn">
                    Confirm Reservation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>D&S Creations</h3>
            <p>Your premier destination for cinema advertising and entertainment.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/mainhome">Home</a></li>
              <li><a href="/new-reservation">New Reservation</a></li>
              <li><a href="/my-reservations">My Reservations</a></li>
              <li><a href="/conus">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>Email: info@dscreations.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} D&S Creations. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default NewReservation;