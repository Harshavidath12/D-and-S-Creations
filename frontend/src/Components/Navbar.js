import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <h2>D & S Creations</h2>
      <div>
        <Link to="/">Home</Link><br></br><br></br>
        <Link to="/designers">Designers</Link><br></br><br></br>
        <Link to="/complaints">Complaints</Link><br></br><br></br>
        <Link to="/client-designers">Client Designers</Link>
      </div>
    </nav>
  );
}

export default Navbar;
