import React, { useState, useEffect, useRef } from "react";
import "./nav.css";
import { Link } from "react-router-dom";
import "../AdminProfile/AdminProfile";

function Nav4() {
  
  return (
    <div>
      <ul className="home-url">
        <li className="home-ll">
          <Link to="/userdetails" className="active home-a">
            <h1>Home</h1>
          </Link>
        </li>
        <li>
          <Link to="/AdminProfile4" className="nav-link">
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

export default Nav4;
