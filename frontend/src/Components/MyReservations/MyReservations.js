import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./MyReservations.css";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reservations from API
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        setLoading(true);
        // For demo purposes, we'll fetch all reservations
        // In a real app, you'd filter by user email
        const response = await fetch('http://localhost:5000/api/reservations');
        const data = await response.json();
        
        if (data.success) {
          setReservations(data.data);
        } else {
          console.error('Error fetching reservations:', data.message);
          // Fallback to empty array if API fails
          setReservations([]);
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
        // Fallback to empty array if API fails
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancelReservation = async (reservationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reservations/${reservationId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'cancelled' })
      });

      const data = await response.json();
      
      if (data.success) {
        // Update local state
        setReservations(reservations.map(res => 
          res._id === reservationId 
            ? { ...res, status: 'cancelled' }
            : res
        ));
        alert("Reservation cancelled successfully!");
      } else {
        alert('Error cancelling reservation: ' + data.message);
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      alert('Error cancelling reservation. Please try again.');
    }
  };

  return (
    <div>
      {/* Navbar */}
      <Nav />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>My Reservations</h1>
          <p>Manage your cinema bookings and reservations</p>
        </div>
      </section>

      {/* Reservations Section */}
      <section className="reservations-section">
        <div className="container">
          <h2>Your Bookings</h2>
          
          {loading ? (
            <div className="loading">Loading your reservations...</div>
          ) : reservations.length === 0 ? (
            <div className="no-reservations">
              <h3>No reservations found</h3>
              <p>You haven't made any reservations yet.</p>
              <a href="/new-reservation" className="cta-btn">Make a Reservation</a>
            </div>
          ) : (
            <div className="reservations-grid">
              {reservations.map((reservation) => (
                <div key={reservation._id} className="reservation-card">
                  <div className="reservation-header">
                    <h3>{reservation.movie_name}</h3>
                    <span className={`status ${reservation.status.toLowerCase()}`}>
                      {reservation.status}
                    </span>
                  </div>
                  
                  <div className="reservation-details">
                    <div className="detail-row">
                      <span className="label">Reservation ID:</span>
                      <span className="value">{reservation.reservation_id}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Cinema:</span>
                      <span className="value">{reservation.cinema_name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Location:</span>
                      <span className="value">{reservation.cinema_location}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Date:</span>
                      <span className="value">{new Date(reservation.show_date).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Time:</span>
                      <span className="value">{reservation.show_time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Advertisement Slots:</span>
                      <span className="value">{reservation.advertisement_slots.length} slots</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Duration:</span>
                      <span className="value">{reservation.advertisement_duration} seconds</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Company:</span>
                      <span className="value">{reservation.company_name}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Total:</span>
                      <span className="value price">₹{reservation.total_amount}</span>
                    </div>
                  </div>
                  
                  <div className="reservation-actions">
                    <button className="btn-secondary">View Details</button>
                    {reservation.status !== 'cancelled' && reservation.status !== 'completed' && (
                      <button 
                        className="btn-danger"
                        onClick={() => handleCancelReservation(reservation._id)}
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default MyReservations;
