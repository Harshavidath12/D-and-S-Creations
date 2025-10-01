import React from 'react'
import {Link} from "react-router-dom";
import './AdminNav.css';
import '../AdminProfile/AdminProfile'
import '../Home/Home'

function AdminNav() {
  return (
    <div class="navbar">
          <ul className="nav-list">
            <li> 
                <Link to="/PendingUsers" className="nav-link">Pending Users</Link> 
            </li>
            <li> 
                <Link to="/Roll" className="nav-link">Job Roll</Link> 
            </li>
            <li> 
                <Link to="/AdminProfile" className="nav-link">View Profile</Link> 
            </li>
            <li> 
                <Link to="/Home" className="nav-link">Sing Out</Link> 
            </li>
          </ul>
        </div>
  )
}

export default AdminNav
