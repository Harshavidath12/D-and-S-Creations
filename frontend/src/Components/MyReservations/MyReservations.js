import React, { useState, useEffect } from "react";
import Nav from "../Nav/Nav";
import "./MyReservations.css";

// Movie trailer mapping - you can expand this as needed
const MOVIE_TRAILERS = {
  'Avatar: The Way of Water': 'https://www.youtube.com/watch?v=d9MyW72ELq0',
  'Black Panther: Wakanda Forever': 'https://www.youtube.com/watch?v=_Z3QKkl1WyM',
  'Ant-Man and the Wasp: Quantumania': 'https://www.youtube.com/watch?v=ZlNFpri-Y40',
  'Shazam! Fury of the Gods': 'https://www.youtube.com/watch?v=AIc671o9y43',
  'Elemental': 'https://www.youtube.com/watch?v=hXzcyx9V0xw',
  'Spider-Man: Across the Spider-Verse': 'https://www.youtube.com/watch?v=shW9i6k8cB0',
  'Oppenheimer': 'https://www.youtube.com/watch?v=uYPbbksJxIg',
  'Barbie': 'https://www.youtube.com/watch?v=pBk4NYhWNMM',
  'The Little Mermaid': 'https://www.youtube.com/watch?v=kpGo2_d3oYE',
  'The Super Mario Bros. Movie': 'https://www.youtube.com/watch?v=TnGl01FkMMo',
  'Dungeons & Dragons: Honor Among Thieves': 'https://www.youtube.com/watch?v=IiMinixSXII'
};

// Function to extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Function to generate YouTube thumbnail URL
const getYouTubeThumbnail = (url) => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return '/img/placeholder-video.jpg';
};

function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [groupedReservations, setGroupedReservations] = useState({});

  // Fetch cinemas and extract reserved slots
  useEffect(() => {
    const fetchReservedSlots = async () => {
      try {
        setLoading(true);
        // Fetch cinemas data
        const response = await fetch('http://localhost:5000/api/cinemas');
        const data = await response.json();
        
        if (data.success) {
          const reservedSlotsData = [];
          
          // Extract reserved slots from each cinema
          data.data.forEach(cinema => {
            if (cinema.movie_slot_pricing) {
              Object.keys(cinema.movie_slot_pricing).forEach(movieKey => {
                const moviePricing = cinema.movie_slot_pricing[movieKey];
                const movieInfo = cinema.ongoing_movies[movieKey];
                
                if (moviePricing.slots) {
                  moviePricing.slots.forEach(slot => {
                    if (slot.is_reserved === true) {
                      reservedSlotsData.push({
                        cinema_id: cinema._id,
                        cinema_name: cinema.cinema_name,
                        cinema_location: cinema.cinema_location,
                        movie_key: movieKey,
                        movie_name: movieInfo ? movieInfo.name : 'Unknown Movie',
                        movie_start_date: movieInfo ? movieInfo.start_date : null,
                        movie_end_date: movieInfo ? movieInfo.end_date : null,
                        trailer_link: movieInfo ? movieInfo.trailer_link : null,
                        slot: slot
                      });
                    }
                  });
                }
              });
            }
          });
          
          setReservations(reservedSlotsData);
          
          // Group by movie name
          const grouped = reservedSlotsData.reduce((acc, slotData) => {
            const movieName = slotData.movie_name;
            if (!acc[movieName]) {
              acc[movieName] = [];
            }
            acc[movieName].push(slotData);
            return acc;
          }, {});
          setGroupedReservations(grouped);
        } else {
          setReservations([]);
        }
      } catch (error) {
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservedSlots();
  }, []);

  // Calculate advertising cost from reserved date to movie ending date
  const calculateAdvertisingCost = (reservedAt, movieEndDate, slotPrice) => {
    const reservedDate = new Date(reservedAt);
    const endDate = new Date(movieEndDate);
    
    // Calculate number of days
    const timeDiff = endDate.getTime() - reservedDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Calculate total cost (slot price × number of days)
    const totalCost = slotPrice * daysDiff;
    
    return {
      days: daysDiff,
      dailyCost: slotPrice,
      totalCost: totalCost,
      startDate: reservedDate,
      endDate: endDate
    };
  };

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
            <div className="slot-cards-grid">
              {Object.entries(groupedReservations).map(([movieName, slotDataArray]) => {
                return slotDataArray.map((slotData, index) => {
                  const slot = slotData.slot;
                  const trailerUrl = slotData.trailer_link || MOVIE_TRAILERS[movieName];
                  const movieEndDate = slotData.movie_end_date || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  const adCost = calculateAdvertisingCost(slot.reserved_at, movieEndDate, slot.price);
                  
                  return (
                    <div key={`${slotData.cinema_id}-${slotData.movie_key}-${slot._id}`} className="slot-card">
                      <div className="slot-header">
                        <div className="movie-poster">
                          {trailerUrl ? (
                            <div className="video-thumbnail" onClick={() => window.open(trailerUrl, '_blank')}>
                              <img src={getYouTubeThumbnail(trailerUrl)} alt={movieName} />
                              <div className="play-button">
                                <i className="fa fa-play"></i>
                              </div>
                            </div>
                          ) : (
                            <div className="placeholder-poster">
                              <i className="fa fa-film"></i>
                            </div>
                          )}
                        </div>
                        <div className="slot-info">
                          <h3>{movieName}</h3>
                          <div className="cinema-details">
                            <h4>{slotData.cinema_name}</h4>
                            <p className="location">{slotData.cinema_location}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="slot-details">
                        <div className="slot-meta">
                          <div className="meta-row">
                            <span className="label">Slot Type:</span>
                            <span className="value">{slot.slot_type.charAt(0).toUpperCase() + slot.slot_type.slice(1)}</span>
                          </div>
                          <div className="meta-row">
                            <span className="label">Slot Number:</span>
                            <span className="value">{slot.slot_number}</span>
                          </div>
                          <div className="meta-row">
                            <span className="label">Reserved By:</span>
                            <span className="value">{slot.reserved_by}</span>
                          </div>
                          <div className="meta-row">
                            <span className="label">Reserved At:</span>
                            <span className="value">{new Date(slot.reserved_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="cost-calculation">
                          <h4>Advertisement Cost Calculation</h4>
                          <div className="calculation-details">
                            <div className="calc-row">
                              <span className="label">Period:</span>
                              <span className="value">{adCost.startDate.toLocaleDateString()} to {adCost.endDate.toLocaleDateString()}</span>
                            </div>
                            <div className="calc-row">
                              <span className="label">Duration:</span>
                              <span className="value">{adCost.days} days</span>
                            </div>
                            <div className="calc-row">
                              <span className="label">Daily Cost:</span>
                              <span className="value">LKR {adCost.dailyCost.toLocaleString()}</span>
                            </div>
                            <div className="calc-row total-cost">
                              <span className="label">Total Cost:</span>
                              <span className="value">LKR {adCost.totalCost.toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                });
              }).flat()}
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
