import React from 'react'
import {Link} from "react-router-dom";
import './JobRollNav.css'
import '../Home/Home'
import '../PendingUsers/PendingUsers'


function JobRollNav() {
  return (
   <div className="navbar1">
  <ul className="nav-list1">
    <li><Link to="/Client" className="nav-link1">Clients</Link></li>
    <li><Link to="/FilmhallOwners" className="nav-link1">FilmHall Owners</Link></li>
    <li><Link to="/LedBoardOwners" className="nav-link1">LedBoard Owners</Link></li>
    <li><Link to="/Designer" className="nav-link1">Designers</Link></li>
    
  </ul>
</div>

  )
}

export default JobRollNav
