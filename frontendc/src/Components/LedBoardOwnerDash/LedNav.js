import React from 'react'
import {Link} from "react-router-dom";
import '../AdminNav/AdminNav.css';
import '../AdminProfile/AdminProfile'
import '../Home/Home'

function LedNav() {
  return (
    <div class="navbar">
          <ul className="nav-list">
            <li> 
                <Link to="/LedBoardOwnerDash" className="nav-link">Home</Link> 
            </li>
            <li> 
                <Link to="/Request" className="nav-link">Request</Link> 
            </li>
            <li> 
                <Link to="/AdminProfileLed" className="nav-link">View Profile</Link> 
            </li>
            <li> 
                <Link to="/Home" className="nav-link">Sing Out</Link> 
            </li>
          </ul>
        </div>
  )
}

export default LedNav
