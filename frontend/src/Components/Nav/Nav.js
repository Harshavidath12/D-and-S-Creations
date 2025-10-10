import React, { useState, useEffect, useRef } from "react";
import "./nav.css";
import { Link } from "react-router-dom";

function Nav() {
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
        {/* Home */}
        <li className="home-ll">
          <Link to="/mainhome" className="active home-a">
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
                  to="/my-reservations"
                  className="dropdown-link"
                  onClick={() => setIsCinemaDropdownOpen(false)}
                >
                  My Reservations
                </Link>
              </li>
              <li className="dropdown-item">
                <Link
                  to="/new-reservation"
                  className="dropdown-link"
                  onClick={() => setIsCinemaDropdownOpen(false)}
                >
                  New Reservation
                </Link>
              </li>
            </ul>
          )}
        </li>

        {/* Cinema Management for Owners */}
        <li className="home-ll">
          <Link to="/cinema-management" className="active home-a">
            <h1>Manage Cinemas</h1>
          </Link>
        </li>

        {/* User-related links */}
        <li className="home-ll">
          <Link to="/adduser" className="active home-a">
            <h1>Add User</h1>
          </Link>
        </li>
        <li className="home-ll">
          <Link to="/userdetails" className="active home-a">
            <h1>User Details</h1>
          </Link>
        </li>

        {/* Designers */}
        <li className="home-ll">
          <Link to="/client-designers" className="active home-a">
            <h1>Designers</h1>
          </Link>
        </li>

        {/* Contact Us */}
        <li className="home-ll">
          <Link to="/complaints" className="active home-a">
            <h1>Contact Us</h1>
          </Link>
        </li>

        {/* Photos */}
        <li className="home-ll">
          <Link to="/imgpart" className="active home-a">
            <h1>Photos</h1>
          </Link>
        </li>

        {/* LED Board */}
        <li className="home-ll">
          <Link to="/ledboard" className="active home-a">
            <h1>LED Board</h1>
          </Link>
        </li>

        {/* Auth Links */}
        <li>
          <Link to="/Login" className="nav-link">
            Login
          </Link>
        </li>
        <li>
          <Link to="/Register" className="nav-link">
            Register
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
