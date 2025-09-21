import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import { VideoCard } from "../Cinema/VideoCard";
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
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/cinemas');
        const data = await response.json();
        
        if (data.success) {
          setCinemas(data.data);
        } else {
        }
      } catch (error) {
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
  };

  const handleMovieSelect = (movieKey, movieName) => {
    setSelectedMovie({ key: movieKey, name: movieName });
    setSelectedSlots([]);
    setCurrentStep(3);
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

  const getMovieSlotInfo = (movieKey) => {
    if (!selectedCinema) return null;
    
    const movieSlots = selectedCinema.movie_slot_pricing?.[movieKey]?.slots || [];
    
    const starting = movieSlots.filter(slot => slot.slot_type === 'starting');
    const interval = movieSlots.filter(slot => slot.slot_type === 'interval');
    const ending = movieSlots.filter(slot => slot.slot_type === 'ending');
    
    return {
      starting: starting.length > 0 ? { count: starting.length, price: starting[0].price } : null,
      interval: interval.length > 0 ? { count: interval.length, price: interval[0].price } : null,
      ending: ending.length > 0 ? { count: ending.length, price: ending[0].price } : null
    };
  };

  const calculateTotal = () => {
    return selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
  };

  const handleDownloadDetails = () => {
    // Create a text summary of the reservation
    const reservationDetails = `
D&S Creations - Advertisement Slot Reservation
==============================================

Cinema: ${selectedCinema?.cinema_name}
Location: ${selectedCinema?.cinema_location}
Movie: ${selectedMovie?.name}

Selected Slots:
${selectedSlots.map(slot => 
  `- ${slot.slot_type.charAt(0).toUpperCase() + slot.slot_type.slice(1)} Slot ${slot.slot_number}: LKR ${slot.price}`
).join('\n')}

Total Amount: LKR ${calculateTotal()}

Reservation Date: ${new Date().toLocaleDateString()}
Reservation Time: ${new Date().toLocaleTimeString()}

Thank you for choosing D&S Creations!
    `.trim();

    // Create and download the file
    const blob = new Blob([reservationDetails], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reservation-${selectedCinema?.cinema_name?.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleConfirmReservation = async () => {
    try {
      // Here you would typically send the reservation to your backend
      
      // For now, just show an alert
      alert('Reservation confirmed successfully! You will receive a confirmation email shortly.');
      
      // Reset the form
      setSelectedCinema(null);
      setSelectedMovie(null);
      setSelectedSlots([]);
      setCurrentStep(1);
    } catch (error) {
      alert('There was an error confirming your reservation. Please try again.');
    }
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
                  <div className="cinemas-grid">
                    <h3>Available Cinemas ({cinemas.length})</h3>
                    <div className="cinema-cards">
                      {cinemas.map((cinema) => (
                        <div key={cinema._id} className="cinema-card">
                          <div className="cinema-header">
                            <h4>{cinema.cinema_name}</h4>
                            <span className="cinema-location">{cinema.cinema_location}</span>
                          </div>
                          <div className="cinema-details">
                            {cinema.contact_info?.phone && (
                              <div className="contact-item">
                                <i className="fa fa-phone"></i>
                                <span>{cinema.contact_info.phone}</span>
                              </div>
                            )}
                            {cinema.contact_info?.email && (
                              <div className="contact-item">
                                <i className="fa fa-envelope"></i>
                                <span>{cinema.contact_info.email}</span>
                              </div>
                            )}
                          </div>
                          <button 
                            className="select-cinema-btn"
                            onClick={() => handleCinemaSelect(cinema)}
                          >
                            Select Cinema
                          </button>
                        </div>
                      ))}
                    </div>
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
                
                <div className="movies-grid">
                  <h3>Available Movies:</h3>
                  {selectedCinema.ongoing_movies && Object.entries(selectedCinema.ongoing_movies).map(([key, movie]) => (
                    movie && movie.name ? (
                      <VideoCard 
                        key={key}
                        video={{
                          title: movie.name,
                          youtubeUrl: movie.trailer_link,
                          slotInfo: getMovieSlotInfo(key)
                        }}
                        onSelect={() => handleMovieSelect(key, movie.name)}
                        style={{
                          marginBottom: '30px',
                          fontWeight: '100',
                          fontSize: '18px',
                          color: '#e63946',
                          width: '100%',
                          height: '45px',
                          textAlign: 'center',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none',
                          border: 'none',
                          borderRadius: '5px',
                          backgroundColor: '#6c757d',
                          transition: '0.2s ease-in-out',
                          cursor: 'pointer'
                        }}
                      />
                    ) : null
                  ))}
                </div>

                {/* Navigation Buttons for Movie Selection */}
                <div className="step-navigation">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setCurrentStep(1)}
                  >
                    Back to Cinemas
                  </button>
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
                    <div className="compact-slots-selection">
                      {/* Starting Slots Card */}
                      <div className="slot-card">
                        <div className="slot-card-header">
                          <h4>Starting</h4>
                          <span className="slot-count">{slots.starting.length} slots</span>
                        </div>
                        <div className="slot-card-content">
                          {slots.starting.map((slot) => (
                            <div 
                              key={`starting_${slot.slot_number}`}
                              className={`compact-slot-item ${selectedSlots.some(s => s.slot_id === `starting_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `starting_${slot.slot_number}`,
                                slot_type: 'starting',
                                slot_number: slot.slot_number,
                                price: slot.price
                              })}
                            >
                              <span className="slot-number">{slot.slot_number}</span>
                              <span className="slot-price">LKR {slot.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Interval Slots Card */}
                      <div className="slot-card">
                        <div className="slot-card-header">
                          <h4>Interval</h4>
                          <span className="slot-count">{slots.interval.length} slots</span>
                        </div>
                        <div className="slot-card-content">
                          {slots.interval.map((slot) => (
                            <div 
                              key={`interval_${slot.slot_number}`}
                              className={`compact-slot-item ${selectedSlots.some(s => s.slot_id === `interval_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `interval_${slot.slot_number}`,
                                slot_type: 'interval',
                                slot_number: slot.slot_number,
                                price: slot.price
                              })}
                            >
                              <span className="slot-number">{slot.slot_number}</span>
                              <span className="slot-price">LKR {slot.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ending Slots Card */}
                      <div className="slot-card">
                        <div className="slot-card-header">
                          <h4>Ending</h4>
                          <span className="slot-count">{slots.ending.length} slots</span>
                        </div>
                        <div className="slot-card-content">
                          {slots.ending.map((slot) => (
                            <div 
                              key={`ending_${slot.slot_number}`}
                              className={`compact-slot-item ${selectedSlots.some(s => s.slot_id === `ending_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `ending_${slot.slot_number}`,
                                slot_type: 'ending',
                                slot_number: slot.slot_number,
                                price: slot.price
                              })}
                            >
                              <span className="slot-number">{slot.slot_number}</span>
                              <span className="slot-price">LKR {slot.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Total Summary */}
                      {selectedSlots.length > 0 && (
                        <div className="total-summary">
                          <div className="total-amount">
                            <span className="total-label">Total:</span>
                            <span className="total-value">LKR {calculateTotal()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Navigation Buttons */}
                <div className="step-navigation">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={() => setCurrentStep(4)}
                    disabled={selectedSlots.length === 0}
                  >
                    Continue to Confirmation
                  </button>
                </div>
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
                    <p><strong>Location:</strong> {selectedCinema?.cinema_location}</p>
                    <p><strong>Movie:</strong> {selectedMovie?.name}</p>
                    <p><strong>Selected Slots:</strong> {selectedSlots.length}</p>
                    <div className="selected-slots-details">
                      {selectedSlots.map(slot => (
                        <div key={slot.slot_id} className="slot-detail">
                          {slot.slot_type.charAt(0).toUpperCase() + slot.slot_type.slice(1)} Slot {slot.slot_number} - LKR {slot.price}
                        </div>
                      ))}
                    </div>
                    <p className="total-amount-display"><strong>Total Amount: LKR {calculateTotal()}</strong></p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="confirmation-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setCurrentStep(3)}
                  >
                    Back to Slots
                  </button>
                  <button 
                    className="btn-download" 
                    onClick={handleDownloadDetails}
                  >
                    <i className="fa fa-download"></i>
                    Download Details
                  </button>
                  <button 
                    className="btn-confirm" 
                    onClick={handleConfirmReservation}
                  >
                    <i className="fa fa-check"></i>
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