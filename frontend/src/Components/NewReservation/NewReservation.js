import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./NewReservation.css";

function NewReservation() {
  const [formData, setFormData] = useState({
    movie: "",
    cinema: "",
    date: "",
    time: "",
    advertisement_slots: [],
    name: "",
    email: "",
    phone: "",
    company: "",
    advertisement_duration: ""
  });

  const [step, setStep] = useState(1);
  const [cinemas, setCinemas] = useState([]);
  const [loading, setLoading] = useState(true);

  const timeSlots = [
    "10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"
  ];

  // Fetch cinemas from your backend API
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/cinemas');
        const data = await response.json();
        
        if (data.success) {
          setCinemas(data.data);
        } else {
          console.error('Error fetching cinemas:', data.message);
          alert('Error fetching cinemas: ' + data.message);
        }
      } catch (error) {
        console.error('Error fetching cinemas:', error);
        alert('Error fetching cinemas. Please check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Reservation submitted successfully!");
    console.log("Reservation Data:", formData);
  };

  // Get available movies based on selected cinema
  const getAvailableMovies = () => {
    const selectedCinema = cinemas.find(cinema => cinema._id === formData.cinema);
    if (selectedCinema) {
      return [
        selectedCinema.ongoing_movies.movie_1,
        selectedCinema.ongoing_movies.movie_2,
        selectedCinema.ongoing_movies.movie_3,
        selectedCinema.ongoing_movies.movie_4,
        selectedCinema.upcoming_movie
      ].filter(movie => movie);
    }
    return [];
  };

  // Get advertisement slots for selected cinema
  const getAdvertisementSlots = () => {
    if (!formData.cinema) return { start_slots: [], interval_slots: [], end_slots: [] };
    
    const selectedCinema = cinemas.find(cinema => cinema._id === formData.cinema);
    if (!selectedCinema || !selectedCinema.advertisement_slots) {
      return { start_slots: [], interval_slots: [], end_slots: [] };
    }
    
    return selectedCinema.advertisement_slots;
  };

  // Handle slot selection
  const handleSlotSelection = (slotType, slotNumber, price) => {
    const slotId = `${slotType}_${slotNumber}`;
    const isSelected = formData.advertisement_slots.some(slot => slot.id === slotId);
    
    if (isSelected) {
      // Remove slot
      setFormData(prev => ({
        ...prev,
        advertisement_slots: prev.advertisement_slots.filter(slot => slot.id !== slotId)
      }));
    } else {
      // Add slot
      setFormData(prev => ({
        ...prev,
        advertisement_slots: [...prev.advertisement_slots, {
          id: slotId,
          type: slotType,
          slot_number: slotNumber,
          price: price
        }]
      }));
    }
  };

  const renderStep1 = () => (
    <div className="step-content">
      <h3>Select Cinema & Movie</h3>
      
      <div className="form-group">
        <label>Cinema *</label>
        {loading ? (
          <div className="loading">Loading cinemas...</div>
        ) : (
          <select 
            name="cinema" 
            value={formData.cinema} 
            onChange={handleInputChange}
            required
          >
            <option value="">Choose a cinema</option>
            {cinemas.filter(cinema => cinema.is_active).map(cinema => (
              <option key={cinema._id} value={cinema._id}>
                {cinema.cinema_name} - {cinema.cinema_location}
              </option>
            ))}
          </select>
        )}
      </div>
      
      <div className="form-group">
        <label>Movie *</label>
        <select 
          name="movie" 
          value={formData.movie} 
          onChange={handleInputChange}
          required
          disabled={!formData.cinema}
        >
          <option value="">Choose a movie</option>
          {getAvailableMovies().map(movie => (
            <option key={movie} value={movie}>{movie}</option>
          ))}
        </select>
        {!formData.cinema && (
          <p className="help-text">Please select a cinema first</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => {
    const slots = getAdvertisementSlots();
    const totalPrice = formData.advertisement_slots.reduce((sum, slot) => sum + slot.price, 0);
    
    return (
      <div className="step-content">
        <h3>Select Advertisement Slots</h3>
        
        <div className="form-group">
          <label>Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Time *</label>
          <select 
            name="time" 
            value={formData.time} 
            onChange={handleInputChange}
            required
          >
            <option value="">Choose a time</option>
            {timeSlots.map(time => (
              <option key={time} value={time}>{time}</option>
            ))}
          </select>
        </div>

        <div className="advertisement-slots-section">
          <h4>Advertisement Slots Available</h4>
          
          {/* Start Slots */}
          <div className="slot-category">
            <h5>Start Slots (Before Movie) - 5 slots</h5>
            <div className="slots-grid">
              {slots.start_slots.map((slot, index) => (
                <div 
                  key={`start_${slot.slot_number}`}
                  className={`slot-item ${slot.is_reserved ? 'reserved' : 'available'} ${
                    formData.advertisement_slots.some(s => s.id === `start_${slot.slot_number}`) ? 'selected' : ''
                  }`}
                  onClick={() => !slot.is_reserved && handleSlotSelection('start', slot.slot_number, slot.price)}
                >
                  <div className="slot-number">Slot {slot.slot_number}</div>
                  <div className="slot-price">₹{slot.price}</div>
                  <div className="slot-status">
                    {slot.is_reserved ? 'Reserved' : 'Available'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interval Slots */}
          <div className="slot-category">
            <h5>Interval Slots (During Movie) - 5 slots</h5>
            <div className="slots-grid">
              {slots.interval_slots.map((slot, index) => (
                <div 
                  key={`interval_${slot.slot_number}`}
                  className={`slot-item ${slot.is_reserved ? 'reserved' : 'available'} ${
                    formData.advertisement_slots.some(s => s.id === `interval_${slot.slot_number}`) ? 'selected' : ''
                  }`}
                  onClick={() => !slot.is_reserved && handleSlotSelection('interval', slot.slot_number, slot.price)}
                >
                  <div className="slot-number">Slot {slot.slot_number}</div>
                  <div className="slot-price">₹{slot.price}</div>
                  <div className="slot-status">
                    {slot.is_reserved ? 'Reserved' : 'Available'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* End Slots */}
          <div className="slot-category">
            <h5>End Slots (After Movie) - 5 slots</h5>
            <div className="slots-grid">
              {slots.end_slots.map((slot, index) => (
                <div 
                  key={`end_${slot.slot_number}`}
                  className={`slot-item ${slot.is_reserved ? 'reserved' : 'available'} ${
                    formData.advertisement_slots.some(s => s.id === `end_${slot.slot_number}`) ? 'selected' : ''
                  }`}
                  onClick={() => !slot.is_reserved && handleSlotSelection('end', slot.slot_number, slot.price)}
                >
                  <div className="slot-number">Slot {slot.slot_number}</div>
                  <div className="slot-price">₹{slot.price}</div>
                  <div className="slot-status">
                    {slot.is_reserved ? 'Reserved' : 'Available'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {formData.advertisement_slots.length > 0 && (
            <div className="selected-slots-summary">
              <h5>Selected Slots ({formData.advertisement_slots.length})</h5>
              <div className="selected-slots-list">
                {formData.advertisement_slots.map(slot => (
                  <div key={slot.id} className="selected-slot">
                    {slot.type.charAt(0).toUpperCase() + slot.type.slice(1)} Slot {slot.slot_number} - ₹{slot.price}
                  </div>
                ))}
              </div>
              <div className="total-price">
                <strong>Total: ₹{totalPrice}</strong>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderStep3 = () => (
    <div className="step-content">
      <h3>Advertisement Details</h3>
      <div className="form-group">
        <label>Full Name *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Company Name *</label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label>Phone Number *</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Advertisement Duration *</label>
        <select 
          name="advertisement_duration" 
          value={formData.advertisement_duration} 
          onChange={handleInputChange}
          required
        >
          <option value="">Select duration</option>
          <option value="15">15 seconds</option>
          <option value="30">30 seconds</option>
          <option value="45">45 seconds</option>
          <option value="60">1 minute</option>
          <option value="90">1.5 minutes</option>
          <option value="120">2 minutes</option>
        </select>
      </div>

      {formData.advertisement_slots.length > 0 && (
        <div className="booking-summary">
          <h4>Booking Summary</h4>
          <div className="summary-details">
            <p><strong>Cinema:</strong> {cinemas.find(c => c._id === formData.cinema)?.cinema_name}</p>
            <p><strong>Movie:</strong> {formData.movie}</p>
            <p><strong>Date:</strong> {formData.date}</p>
            <p><strong>Time:</strong> {formData.time}</p>
            <p><strong>Selected Slots:</strong> {formData.advertisement_slots.length}</p>
            <p><strong>Total Price:</strong> ₹{formData.advertisement_slots.reduce((sum, slot) => sum + slot.price, 0)}</p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      {/* Navbar */}
      <Nav />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Book Advertisement Slots</h1>
          <p>Reserve advertisement slots for your business in cinema halls</p>
        </div>
      </section>

      {/* Reservation Form */}
      <section className="reservation-section">
        <div className="container">
          <div className="reservation-form">
            <div className="form-header">
              <h2>Make a Reservation</h2>
              <div className="step-indicator">
                <div className={`step ${step >= 1 ? 'active' : ''}`}>1</div>
                <div className={`step ${step >= 2 ? 'active' : ''}`}>2</div>
                <div className={`step ${step >= 3 ? 'active' : ''}`}>3</div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}

              <div className="form-actions">
                {step > 1 && (
                  <button type="button" onClick={handlePrev} className="btn-secondary">
                    Previous
                  </button>
                )}
                {step < 3 ? (
                  <button type="button" onClick={handleNext} className="btn-primary">
                    Next
                  </button>
                ) : (
                  <button type="submit" className="btn-primary">
                    Complete Reservation
                  </button>
                )}
              </div>
            </form>
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
