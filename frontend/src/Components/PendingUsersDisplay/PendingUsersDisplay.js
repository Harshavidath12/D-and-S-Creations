import React from 'react';
import axios from 'axios';
import './PendingUserDisplay.css';
import { useNavigate } from 'react-router-dom';

function PendingUsersDisplay(props) {
  const { _id, firstname, lastname, email, phonenumber, whoareyou, gender, birthday, status, username, password } = props.user;

  const history = useNavigate();

  const deleteHandler = async () => {
    if (status === "Pending") {
      // send whatsapp message
      const phoneNumber = phonenumber; 
      const message = `Hello ${firstname}, your account has not created.\nPlease try again later.`;
      const WhatsAppUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
      
      // open whatsapp
      window.open(WhatsAppUrl, '_blank');

      // delete user
      await axios.delete(`http://localhost:5000/users/${_id}`)
        .then(res => res.data)
        .then(() => history("/PendingUsers"));
    } else {
      await axios.delete(`http://localhost:5000/users/${_id}`)
        .then(res => res.data)
        .then(() => history("/PendingUsers"));
    }
  };

  // Accept handler (update status to Active)
  const acceptHandler = () => {
    history("/SetLogin", { state: { _id, firstname, lastname, whoareyou, phonenumber } });
  };

  return ( 
    <div className="pending-display-card">
      <label className="pending-display-label">Id</label>
      <h3 className="pending-display-value">{_id}</h3>
      <br/>

      <label className="pending-display-label">First Name</label>
      <h3 className="pending-display-value">{firstname}</h3>
      <br/>

      <label className="pending-display-label">Last Name</label>
      <h3 className="pending-display-value">{lastname}</h3>
      <br/>

      <label className="pending-display-label">E-Mail</label>
      <h3 className="pending-display-value">{email}</h3>
      <br/>

      <label className="pending-display-label">Phone Number</label>
      <h3 className="pending-display-value">{phonenumber}</h3>
      <br/>

      <label className="pending-display-label">Who Are You</label>
      <h3 className="pending-display-value">{whoareyou}</h3>
      <br/>

      <label className="pending-display-label">Gender</label>
      <h3 className="pending-display-value">{gender}</h3>
      <br/>

      <label className="pending-display-label">Birthday</label>
      <h3 className="pending-display-value">{birthday}</h3>
      <br/>

      <label className="pending-display-label">Status</label>
      <h3 className="pending-display-value">{status}</h3>
      <br/>

      <label className="pending-display-label">User Name</label>
      <h3 className="pending-display-value">{username}</h3>
      <br/>

      <label className="pending-display-label">Password</label>
      <h3 className="pending-display-value">{password}</h3>

      <div className="pending-display-buttons">
        <button 
          onClick={acceptHandler} 
          className="pending-display-accept" 
          disabled={status === "Active"}
        >
          Accept
        </button>
        <button 
          onClick={deleteHandler} 
          className="pending-display-reject"
        >
          Reject
        </button>
      </div>
      <br/>
    </div>
  );
}

export default PendingUsersDisplay;
