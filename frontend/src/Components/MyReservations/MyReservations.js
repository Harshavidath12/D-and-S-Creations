import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./MyReservations.css";

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setReservations([
        {
          id: 1,
          movie: "The Dark Knight",
          cinema: "Cineplex Downtown",
          date: "2024-01-15",
          time: "7:30 PM",
          seats: "A12, A13",
          status: "Confirmed",
          total: 25.00
        },
        {
          id: 2,
          movie: "Inception",
          cinema: "Mega Cinema",
          date: "2024-01-20",
          time: "9:00 PM",
          seats: "B8, B9",
          status: "Pending",
          total: 30.00
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCancelReservation = (id) => {
    setReservations(reservations.filter(res => res.id !== id));
    alert("Reservation cancelled successfully!");
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
                <div key={reservation.id} className="reservation-card">
                  <div className="reservation-header">
                    <h3>{reservation.movie}</h3>
                    <span className={`status ${reservation.status.toLowerCase()}`}>
                      {reservation.status}
                    </span>
                  </div>
                  
                  <div className="reservation-details">
                    <div className="detail-row">
                      <span className="label">Cinema:</span>
                      <span className="value">{reservation.cinema}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Date:</span>
                      <span className="value">{reservation.date}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Time:</span>
                      <span className="value">{reservation.time}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Seats:</span>
                      <span className="value">{reservation.seats}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Total:</span>
                      <span className="value price">${reservation.total}</span>
                    </div>
                  </div>
                  
                  <div className="reservation-actions">
                    <button className="btn-secondary">View Details</button>
                    <button 
                      className="btn-danger"
                      onClick={() => handleCancelReservation(reservation.id)}
                    >
                      Cancel
                    </button>
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
