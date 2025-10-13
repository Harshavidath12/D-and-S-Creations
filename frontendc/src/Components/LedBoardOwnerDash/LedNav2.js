import React from 'react'
import {Link} from "react-router-dom";
import '../AdminNav/AdminNav.css';
import '../AdminProfile/AdminProfile'
import '../Home/Home'

function LedNav2() {
  return (
    <div class="navbar">
          <ul className="nav-list">
            <li> 
                <Link to="/LedUpdateDash" className="nav-link">Home</Link> 
            </li>
            <li> 
                <Link to="/Request2" className="nav-link">Request</Link> 
            </li>
            <li> 
                <Link to="/AdminProfileLed2" className="nav-link">View Profile</Link> 
            </li>
            <li> 
                <Link to="/Home" className="nav-link">Sing Out</Link> 
            </li>
          </ul>
        </div>
  )
}

export default LedNav2
