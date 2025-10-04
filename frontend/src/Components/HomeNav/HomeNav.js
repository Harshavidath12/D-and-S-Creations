import React from 'react';
import './HomeNav.css';
import {Link} from "react-router-dom";


function HomeNav() {
  return (
    <div class="navbar">
      <ul className="nav-list">
        <li> 
            <Link to="/Home" className="nav-link">Home</Link>
        </li>
        {/* <li> 
            <Link to="/AdminProfile" className="nav-link">View Profile</Link> 
        </li> */}
        <li> 
            <Link to="/Login" className="nav-link">Login</Link> 
        </li>
        <li> 
            <Link to="/Register" className="nav-link">Register</Link> 
        </li>
      </ul>
    </div>
  )
}

export default HomeNav
