import React, { useState, useEffect, useRef } from "react";
import "./nav.css";
import { Link } from "react-router-dom";
import "../AdminProfile/AdminProfile";

function Nav2() {
  const [isCinemaDropdownOpen, setIsCinemaDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleCinemaDropdown = () => {
    setIsCinemaDropdownOpen(!isCinemaDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCinemaDropdownOpen(false);
      }
    };

    if (isCinemaDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCinemaDropdownOpen]);

  return (
    <div>
      <ul className="home-url">
        <li className="home-ll">
          <Link to="/AfterHome" className="active home-a">
            <h1>Home</h1>
          </Link>
        </li>

        {/* Cinema Dropdown */}
        <li className="home-ll dropdown-container" ref={dropdownRef}>
          <div className="dropdown-trigger" onClick={toggleCinemaDropdown}>
            <h1>Cinema</h1>
            <span className="dropdown-arrow">▼</span>
          </div>
          {isCinemaDropdownOpen && (
            <ul className="dropdown-menu">
              <li className="dropdown-item">
                <Link
                  to="/my-reservations2"
                  className="dropdown-link"
                  onClick={() => setIsCinemaDropdownOpen(false)}
                >
                  My Reservations
                </Link>
              </li>
              <li className="dropdown-item">
                <Link
                  to="/new-reservation2"
                  className="dropdown-link"
                  onClick={() => setIsCinemaDropdownOpen(false)}
                >
                  New Reservation
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Original Nav items */}

        <li className="home-ll">
          <Link to="/ledboard2" className="active home-a">
            <h1>LED Board</h1>
          </Link>
        </li>
        
        <li className="home-ll">
          <Link to="/client-designers2" className="active home-a">
            <h1>Designers</h1>
          </Link>
        </li>
        <li className="home-ll">
          <Link to="/complaints2" className="active home-a">
            <h1>Contact Us</h1>
          </Link>
        </li>
        
        <li>
          <Link to="/AdminProfile2" className="nav-link">
            View Profile
          </Link>
        </li>
        <li>
          <Link to="/mainhome" className="nav-link">
            Sign Out
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav2;
