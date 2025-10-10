import React, { useState, useEffect, useRef } from "react";
import "./nav.css";
import { Link } from "react-router-dom";
import "../AdminProfile/AdminProfile";

function Nav3() {
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
          <Link to="/cinema-management" className="active home-a">
            <h1>Home</h1>
          </Link>
        </li>
        <li>
          <Link to="/AdminProfile3" className="nav-link">
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

export default Nav3;
