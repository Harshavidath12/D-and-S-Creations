import React from 'react';
import './nav.css'
import {Link} from "react-router-dom";

function Nav() {
  return (
    <div>
      <ul className="home-url">
        <li className="home-ll">
            <Link to="/mainhome" className="active home-a">
            <h1>Home</h1>
            </Link>
        </li>
        <li className="home-ll">
             <Link to="/adduser" className="active home-a">
            <h1>ADD user</h1>
             </Link>
        </li>
        <li className="home-ll">
            <Link to="/userdetails" className="active home-a">
            <h1>user details</h1>
             </Link>
        </li>

        <li className="home-ll">
            <Link to="/conus" className="active home-a">
            <h1>Contact Us</h1>
             </Link>
        </li> 

          <li className="home-ll">
            <Link to="/imgpart" className="active home-a">
            <h1>Photos</h1>
             </Link>
           </li>

           <li className="home-ll">
          
            <Link to="/ledboard" className="active home-a">
             <h1>LED Board</h1>
             </Link>
        </li>

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

export default Nav
