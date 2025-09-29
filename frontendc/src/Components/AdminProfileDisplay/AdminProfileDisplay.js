import React from "react";
import "../AdminProfile/AdminProfile.css"
import {Link} from "react-router-dom";

function AdminProfileDisplay(props) {
 const {_id, firstname, lastname, email, phonenumber, gender, birthday, profilePic} = props.user;

  return (
<div className="profile-container">
  <h1>My Profile</h1>

  <div className="profile-wrapper">
    {/* Left Panel */} 
    <div className="profile-left"> 
      <div className="avatar"><img src={`http://localhost:5000/uploads/${profilePic}`} alt="profile" className="avatar-img"/></div>
      <h2>{firstname} {lastname}</h2> 
      </div>

    {/* Right Panel */}
    <div className="profile-right">
      <label>Email</label>
      <h3>{email}</h3>

      <label>Phone Number</label>
      <h3>{phonenumber}</h3>

      <label>Gender</label>
      <h3>{gender}</h3>

      <label>Birthday</label>
      <h3>{birthday}</h3>

      <Link to={`/PendingUsers/${_id}`} className="profile-button">Edit Profile</Link>
    </div>
  </div>
</div>


  )
}

export default AdminProfileDisplay
