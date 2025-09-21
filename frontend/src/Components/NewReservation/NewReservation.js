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
  const [customerInfo, setCustomerInfo] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    company_name: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    phone: ''
  });

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      return 'Email is required';
    }
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = (phone) => {
    // Remove all non-digit characters
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (!phone) {
      return 'Phone number is required';
    }
    
    // Check for Sri Lankan phone number formats
    // +94XXXXXXXXX (12 digits) or 0XXXXXXXXX (10 digits)
    if (cleanPhone.length === 12 && cleanPhone.startsWith('94')) {
      return ''; // Valid +94 format
    }
    if (cleanPhone.length === 10 && cleanPhone.startsWith('0')) {
      return ''; // Valid 0XXXXXXXXX format
    }
    
    return 'Please enter a valid Sri Lankan phone number (0XXXXXXXXX or +94XXXXXXXXX)';
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setCustomerInfo({...customerInfo, customer_email: email});
    
    const error = validateEmail(email);
    setValidationErrors({...validationErrors, email: error});
  };

  const handlePhoneChange = (e) => {
    const phone = e.target.value;
    setCustomerInfo({...customerInfo, customer_phone: phone});
    
    const error = validatePhone(phone);
    setValidationErrors({...validationErrors, phone: error});
  };

  // Fetch cinemas from API
  useEffect(() => {
    const fetchCinemas = async () => {
      try {
        console.log('🚀 Fetching cinemas from API...');
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/cinemas');
        console.log('📡 API Response status:', response.status);
        
        const data = await response.json();
        console.log('📊 API Response data:', data);
        
        if (data.success) {
          console.log('✅ Successfully fetched cinemas:', data.data.length);
          console.log('🏢 Cinema details:', data.data);
          
          // Log slot information for each cinema
          data.data.forEach((cinema, index) => {
            console.log(`\n📽️ Cinema ${index + 1}: ${cinema.cinema_name}`);
            console.log(`📍 Location: ${cinema.cinema_location}`);
            
            if (cinema.movie_slot_pricing) {
              Object.keys(cinema.movie_slot_pricing).forEach(movieKey => {
                const pricing = cinema.movie_slot_pricing[movieKey];
                console.log(`🎬 ${movieKey}:`, {
                  starting_price: pricing.starting_price,
                  interval_price: pricing.interval_price,
                  ending_price: pricing.ending_price,
                  slots_count: pricing.slots?.length || 0
                });
                
                if (pricing.slots) {
                  const startingSlots = pricing.slots.filter(s => s.slot_type === 'starting');
                  const intervalSlots = pricing.slots.filter(s => s.slot_type === 'interval');
                  const endingSlots = pricing.slots.filter(s => s.slot_type === 'ending');
                  
                  console.log(`  🎬 Starting slots: ${startingSlots.length}`, startingSlots);
                  console.log(`  ⏰ Interval slots: ${intervalSlots.length}`, intervalSlots);
                  console.log(`  🏁 Ending slots: ${endingSlots.length}`, endingSlots);
                }
              });
            }
          });
          
          setCinemas(data.data);
        } else {
          console.error('❌ Failed to fetch cinemas:', data.message);
        }
      } catch (error) {
        console.error('💥 Error fetching cinemas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCinemas();
  }, []);

  const handleCinemaSelect = (cinema) => {
    console.log('🎬 Cinema selected:', cinema.cinema_name);
    console.log('📍 Cinema location:', cinema.cinema_location);
    console.log('🎫 Available movies:', cinema.ongoing_movies);
    console.log('💰 Movie pricing:', cinema.movie_slot_pricing);
    
    setSelectedCinema(cinema);
    setSelectedMovie(null);
    setSelectedSlots([]);
    setCurrentStep(2);
  };

  const handleMovieSelect = (movieKey, movieName) => {
    console.log('🎬 Movie selected:', movieName);
    console.log('🔑 Movie key:', movieKey);
    console.log('📽️ Selected cinema:', selectedCinema?.cinema_name);
    
    // Get slot info for this movie
    const slotInfo = getMovieSlotInfo(movieKey);
    console.log('🎫 Slot info for selected movie:', slotInfo);
    
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
      starting: movieSlots.filter(slot => slot.slot_type === 'starting' && !slot.is_reserved),
      interval: movieSlots.filter(slot => slot.slot_type === 'interval' && !slot.is_reserved),
      ending: movieSlots.filter(slot => slot.slot_type === 'ending' && !slot.is_reserved)
    };
  };

  const getMovieSlotInfo = (movieKey) => {
    console.log(`🔍 Getting slot info for movie: ${movieKey}`);
    console.log(`📽️ Selected cinema:`, selectedCinema?.cinema_name);
    
    if (!selectedCinema) {
      console.log('❌ No cinema selected');
      return null;
    }
    
    const moviePricing = selectedCinema.movie_slot_pricing?.[movieKey];
    console.log(`💰 Movie pricing for ${movieKey}:`, moviePricing);
    
    const movieSlots = moviePricing?.slots || [];
    console.log(`🎫 Total slots for ${movieKey}:`, movieSlots.length);
    console.log(`📊 Slot details:`, movieSlots);
    
    const starting = movieSlots.filter(slot => slot.slot_type === 'starting');
    const interval = movieSlots.filter(slot => slot.slot_type === 'interval');
    const ending = movieSlots.filter(slot => slot.slot_type === 'ending');
    
    console.log(`🎬 Starting slots:`, starting.length);
    console.log(`⏰ Interval slots:`, interval.length);
    console.log(`🏁 Ending slots:`, ending.length);
    
    // Calculate available (non-reserved) slots
    const availableStarting = starting.filter(slot => !slot.is_reserved);
    const availableInterval = interval.filter(slot => !slot.is_reserved);
    const availableEnding = ending.filter(slot => !slot.is_reserved);
    
    console.log(`✅ Available starting:`, availableStarting.length);
    console.log(`✅ Available interval:`, availableInterval.length);
    console.log(`✅ Available ending:`, availableEnding.length);
    
    const result = {
      starting: starting.length > 0 ? { 
        count: availableStarting.length, 
        total: starting.length,
        price: starting[0].price 
      } : null,
      interval: interval.length > 0 ? { 
        count: availableInterval.length, 
        total: interval.length,
        price: interval[0].price 
      } : null,
      ending: ending.length > 0 ? { 
        count: availableEnding.length, 
        total: ending.length,
        price: ending[0].price 
      } : null
    };
    
    console.log(`📋 Final slot info result:`, result);
    return result;
  };

  const calculateTotal = () => {
    return selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
  };

  // Calculate advertisement period and total cost
  const calculateAdvertisementDetails = () => {
    if (!selectedMovie || !selectedCinema || selectedSlots.length === 0) return null;

    // Find the movie data to get end date
    const movieData = selectedCinema.ongoing_movies[selectedMovie.key];
    if (!movieData || !movieData.end_date) return null;

    const currentDate = new Date();
    const endDate = new Date(movieData.end_date);
    
    // Calculate number of days
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    // Calculate total cost per slot (price × days)
    const dailySlotCost = selectedSlots.reduce((sum, slot) => sum + slot.price, 0);
    const totalCost = dailySlotCost * daysDiff;

    return {
      startDate: currentDate,
      endDate: endDate,
      days: daysDiff,
      dailySlotCost: dailySlotCost,
      totalCost: totalCost
    };
  };

  const handleDownloadDetails = () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reservation Details</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
            color: #333;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #e63946;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #e63946;
            margin: 0;
            font-size: 28px;
          }
          .header p {
            color: #666;
            margin: 5px 0 0 0;
            font-size: 16px;
          }
          .section {
            margin-bottom: 25px;
          }
          .section h2 {
            color: #282c34;
            border-bottom: 2px solid #61dafb;
            padding-bottom: 5px;
            margin-bottom: 15px;
          }
          .info-row {
            display: flex;
            margin-bottom: 10px;
            padding: 8px 0;
          }
          .info-label {
            font-weight: bold;
            width: 120px;
            color: #282c34;
          }
          .info-value {
            flex: 1;
            color: #333;
          }
          .slots-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          .slots-table th,
          .slots-table td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          .slots-table th {
            background-color: #f7f7f7;
            font-weight: bold;
            color: #282c34;
          }
          .total-section {
            background-color: #e63946;
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin-top: 30px;
          }
          .total-section h3 {
            margin: 0 0 10px 0;
            font-size: 24px;
          }
          .total-section .amount {
            font-size: 32px;
            font-weight: bold;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>D&S Creations</h1>
          <p>Advertisement Slot Reservation</p>
        </div>

        <div class="section">
          <h2>Reservation Details</h2>
          <div class="info-row">
            <div class="info-label">Cinema:</div>
            <div class="info-value">${selectedCinema?.cinema_name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Location:</div>
            <div class="info-value">${selectedCinema?.cinema_location}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Movie:</div>
            <div class="info-value">${selectedMovie?.name}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Date:</div>
            <div class="info-value">${new Date().toLocaleDateString()}</div>
          </div>
          <div class="info-row">
            <div class="info-label">Time:</div>
            <div class="info-value">${new Date().toLocaleTimeString()}</div>
          </div>
        </div>

        <div class="section">
          <h2>Selected Advertisement Slots</h2>
          <table class="slots-table">
            <thead>
              <tr>
                <th>Slot Type</th>
                <th>Slot Number</th>
                <th>Price (LKR)</th>
              </tr>
            </thead>
            <tbody>
              ${selectedSlots.map(slot => `
                <tr>
                  <td>${slot.slot_type.charAt(0).toUpperCase() + slot.slot_type.slice(1)}</td>
                  <td>${slot.slot_number}</td>
                  <td>${slot.price.toLocaleString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Advertisement Period Calculation</h2>
          ${(() => {
            const adDetails = calculateAdvertisementDetails();
            if (!adDetails) return '<p>No advertisement details available</p>';
            
            return `
              <div class="info-row">
                <div class="info-label">Period:</div>
                <div class="info-value">${adDetails.startDate.toLocaleDateString()} to ${adDetails.endDate.toLocaleDateString()}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Duration:</div>
                <div class="info-value">${adDetails.days} days</div>
              </div>
              <div class="info-row">
                <div class="info-label">Daily:</div>
                <div class="info-value">LKR ${adDetails.dailySlotCost.toLocaleString()}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Calculation:</div>
                <div class="info-value">LKR ${adDetails.dailySlotCost.toLocaleString()} × ${adDetails.days} days</div>
              </div>
            `;
          })()}
        </div>

        <div class="total-section">
          <h3>Sub Total</h3>
          <div class="amount">LKR ${(() => {
            const adDetails = calculateAdvertisementDetails();
            return adDetails ? adDetails.totalCost.toLocaleString() : calculateTotal().toLocaleString();
          })()}</div>
        </div>

        <div class="footer">
          <p>Thank you for choosing D&S Creations!</p>
          <p>For inquiries, please contact us at info@dscreations.com</p>
        </div>
      </body>
      </html>
    `;

    // Create a new window and print the content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print
    printWindow.onload = function() {
      printWindow.print();
    };
  };

  const handleConfirmReservation = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!customerInfo.customer_name || !customerInfo.customer_email || 
          !customerInfo.customer_phone || !customerInfo.company_name) {
        alert('Please fill in all customer information fields.');
        setIsSubmitting(false);
        return;
      }

      // Validate email and phone format
      const emailError = validateEmail(customerInfo.customer_email);
      const phoneError = validatePhone(customerInfo.customer_phone);
      
      if (emailError || phoneError) {
        setValidationErrors({
          email: emailError,
          phone: phoneError
        });
        alert('Please fix the validation errors before proceeding.');
        setIsSubmitting(false);
        return;
      }

      // Prepare reservation data
      const reservationData = {
        cinema_id: selectedCinema._id,
        movie_name: selectedMovie.name,
        movie_key: selectedMovie.key,
        show_date: new Date().toISOString().split('T')[0], // Today's date
        show_time: '19:00', // Default show time
        advertisement_slots: selectedSlots.map(slot => ({
          slot_id: slot.slot_id,
          slot_type: slot.slot_type,
          slot_number: slot.slot_number,
          price: slot.price
        })),
        advertisement_duration: 30, // Default 30 seconds
        customer_name: customerInfo.customer_name,
        customer_email: customerInfo.customer_email,
        customer_phone: customerInfo.customer_phone,
        company_name: customerInfo.company_name,
        notes: 'Reservation made through online booking system'
      };

      console.log('Sending reservation data:', reservationData);
      console.log('Selected slots:', selectedSlots);

      // Send reservation to backend
      const response = await fetch('http://localhost:5000/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reservationData)
      });

      const result = await response.json();
      console.log('Backend response:', result);

      if (result.success) {
        alert('Reservation confirmed successfully! You will receive a confirmation email shortly.');
        
        // Reset the form
        setSelectedCinema(null);
        setSelectedMovie(null);
        setSelectedSlots([]);
        setCustomerInfo({
          customer_name: '',
          customer_email: '',
          customer_phone: '',
          company_name: ''
        });
        setCurrentStep(1);
      } else {
        alert(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Error confirming reservation:', error);
      alert('There was an error confirming your reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                
                <div className="movie-grid">
                  <h3>Available Movies:</h3>
                  {selectedCinema.ongoing_movies && Object.entries(selectedCinema.ongoing_movies).map(([key, movie]) => (
                    movie && movie.name ? (
                      <VideoCard 
                        key={key}
                        video={{
                          title: movie.name,
                          youtubeUrl: movie.trailer_link,
                          startDate: movie.start_date,
                          endDate: movie.end_date,
                          slotInfo: getMovieSlotInfo(key)
                        }}
                        onSelect={() => handleMovieSelect(key, movie.name)}
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
                  console.log('🎫 Available slots for selected movie:', slots);
                  console.log('🎬 Starting slots:', slots.starting);
                  console.log('⏰ Interval slots:', slots.interval);
                  console.log('🏁 Ending slots:', slots.ending);
                  return (
                    <div className="compact-slots-selection">
                      {/* Starting Slots Card */}
                      <div className="slot-card">
                        <div className="slot-card-header">
                          <h4>Starting</h4>
                          <span className="slot-count">
                            {slots.starting.length} of {selectedCinema?.movie_slot_pricing?.[selectedMovie.key]?.slots?.filter(s => s.slot_type === 'starting').length || 0} available
                          </span>
                        </div>
                        <div className="slot-card-content">
                          {slots.starting.map((slot) => (
                            <div 
                              key={`starting_${slot.slot_number}`}
                              className={`compact-slot-item ${selectedSlots.some(s => s.slot_id === `starting_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `starting_${slot.slot_number}`,
                                slot_type: 'starting',
                                slot_number: parseInt(slot.slot_number),
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
                          <span className="slot-count">
                            {slots.interval.length} of {selectedCinema?.movie_slot_pricing?.[selectedMovie.key]?.slots?.filter(s => s.slot_type === 'interval').length || 0} available
                          </span>
                        </div>
                        <div className="slot-card-content">
                          {slots.interval.map((slot) => (
                            <div 
                              key={`interval_${slot.slot_number}`}
                              className={`compact-slot-item ${selectedSlots.some(s => s.slot_id === `interval_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `interval_${slot.slot_number}`,
                                slot_type: 'interval',
                                slot_number: parseInt(slot.slot_number),
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
                          <span className="slot-count">
                            {slots.ending.length} of {selectedCinema?.movie_slot_pricing?.[selectedMovie.key]?.slots?.filter(s => s.slot_type === 'ending').length || 0} available
                          </span>
                        </div>
                        <div className="slot-card-content">
                          {slots.ending.map((slot) => (
                            <div 
                              key={`ending_${slot.slot_number}`}
                              className={`compact-slot-item ${selectedSlots.some(s => s.slot_id === `ending_${slot.slot_number}`) ? 'selected' : ''}`}
                              onClick={() => handleSlotSelect({
                                slot_id: `ending_${slot.slot_number}`,
                                slot_type: 'ending',
                                slot_number: parseInt(slot.slot_number),
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
                            <span className="total-label">Daily:</span>
                            <span className="total-value">LKR {calculateTotal()}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Advertisement Period Calculation */}
                {selectedSlots.length > 0 && (() => {
                  const adDetails = calculateAdvertisementDetails();
                  if (!adDetails) return null;
                  
                  return (
                    <div className="advertisement-calculation">
                      <h4>Advertisement Period Calculation</h4>
                      <div className="calculation-details">
                        <p>
                          <strong>Advertisement runs from:</strong> {adDetails.startDate.toLocaleDateString()} 
                          <strong> to </strong> {adDetails.endDate.toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Total period:</strong> {adDetails.days} days
                        </p>
                        <p>
                          <strong>Daily slot cost:</strong> LKR {adDetails.dailySlotCost.toLocaleString()} × {adDetails.days} days
                        </p>
                        <p className="total-calculation">
                          <strong>Sub Total: LKR {adDetails.totalCost.toLocaleString()}</strong>
                        </p>
                      </div>
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
                    <p className="total-amount-display"><strong>Daily: LKR {calculateTotal()}</strong></p>
                  </div>
                </div>

                {/* Advertisement Period Calculation for Confirmation */}
                {(() => {
                  const adDetails = calculateAdvertisementDetails();
                  if (!adDetails) return null;
                  
                  return (
                    <div className="advertisement-calculation">
                      <h4>Advertisement Period Calculation</h4>
                      <div className="calculation-details">
                        <p>
                          <strong>Advertisement runs from:</strong> {adDetails.startDate.toLocaleDateString()} 
                          <strong> to </strong> {adDetails.endDate.toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Total period:</strong> {adDetails.days} days
                        </p>
                        <p>
                          <strong>Daily slot cost:</strong> LKR {adDetails.dailySlotCost.toLocaleString()} × {adDetails.days} days
                        </p>
                        <p className="total-calculation">
                          <strong>Sub Total: LKR {adDetails.totalCost.toLocaleString()}</strong>
                        </p>
                      </div>
                    </div>
                  );
                })()}

                {/* Customer Information Form */}
                <div className="customer-info-form">
                  <h3>Customer Information</h3>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="customer_name">Full Name *</label>
                      <input
                        type="text"
                        id="customer_name"
                        value={customerInfo.customer_name}
                        onChange={(e) => setCustomerInfo({...customerInfo, customer_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="customer_email">Email *</label>
                      <input
                        type="email"
                        id="customer_email"
                        value={customerInfo.customer_email}
                        onChange={handleEmailChange}
                        className={validationErrors.email ? 'error' : ''}
                        required
                      />
                      {validationErrors.email && (
                        <span className="error-message">{validationErrors.email}</span>
                      )}
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="customer_phone">Phone Number *</label>
                      <input
                        type="tel"
                        id="customer_phone"
                        value={customerInfo.customer_phone}
                        onChange={handlePhoneChange}
                        placeholder="0XXXXXXXXX or +94XXXXXXXXX"
                        className={validationErrors.phone ? 'error' : ''}
                        required
                      />
                      {validationErrors.phone && (
                        <span className="error-message">{validationErrors.phone}</span>
                      )}
                    </div>
                    <div className="form-group">
                      <label htmlFor="company_name">Company Name *</label>
                      <input
                        type="text"
                        id="company_name"
                        value={customerInfo.company_name}
                        onChange={(e) => setCustomerInfo({...customerInfo, company_name: e.target.value})}
                        required
                      />
                    </div>
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
                    disabled={isSubmitting}
                  >
                    <i className="fa fa-check"></i>
                    {isSubmitting ? 'Processing...' : 'Confirm Reservation'}
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