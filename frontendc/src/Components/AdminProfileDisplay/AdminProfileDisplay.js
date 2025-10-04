import React from "react";
import "../AdminProfile/AdminProfile.css"
import {Link} from "react-router-dom";

function AdminProfileDisplay(props) {
 const {_id, firstname, lastname, email, phonenumber, gender, birthday, whoareyou} = props.user;

 const getProfileLink = () => {
  switch (whoareyou) {
    case "Client":
      return `/Client/${_id}`;
    case "Designer":
      return `/Designer/${_id}`;
    case "FilmhallOwners":
      return `/FilmhallOwners/${_id}`;
    case "LedBoardOwners":
      return `/LedBoardOwners/${_id}`;
    default:
      return `/PendingUsers/${_id}`;
  }
};

  return (
<div className="profile-container">
  <h1>My Profile</h1>

  <div className="profile-wrapper">
    {/* Left Panel */} 
    <div className="profile-left"> 
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

      <Link to={getProfileLink()} className="profile-button">Edit Profile</Link>
    </div>
  </div>
</div>


  )
}

export default AdminProfileDisplay
