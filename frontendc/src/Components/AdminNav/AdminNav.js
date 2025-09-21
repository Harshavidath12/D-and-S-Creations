import React from 'react'
import {Link} from "react-router-dom";
import '../HomeNav/HomeNav.css';
import '../AdminProfile/AdminProfile'

function AdminNav() {
  return (
    <div class="navbar">
          <ul className="nav-list">
            <li> 
                <Link to="/PendingUsers" className="nav-link">User List</Link> 
            </li>
            <li> 
                <Link to="/AdminProfile" className="nav-link">Admin Profile</Link> 
            </li>
          </ul>
        </div>
  )
}

export default AdminNav
