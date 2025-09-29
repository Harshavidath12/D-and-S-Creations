import React from 'react'
import axios from 'axios';
import './PendingUserDisplay.css';
import { useNavigate } from 'react-router-dom';

function PendingUsersDisplay(props) {
    const {_id, firstname, lastname, email, phonenumber, whoareyou, gender, birthday, status} = props.user;

    const history = useNavigate();

    const deleteHandler = async () => {
      await axios.delete(`http://localhost:5000/users/${_id}`)
        .then(res => res.data)
        .then(() => history("/PendingUsers"));
    };

  // Accept handler (update status to Active)
 const acceptHandler = () => {
  history("/SetLogin", { state: { _id, firstname, lastname, whoareyou } });
};

  return ( 
    <div className="main">
      <label>Id</label>
      <h3>{_id}</h3>
      <br/>
      <label>First Name</label>
      <h3>{firstname}</h3>
      <br/>
      <label>Last Name</label>
      <h3>{lastname}</h3>
      <br/>
      <label>E-Maile</label>
      <h3>{email}</h3>
      <br/>
      <label>Phone Number</label>
      <h3>{phonenumber}</h3>
      <br/>
      <label>Who Are You</label>
      <h3>{whoareyou}</h3>
      <br/>
      <label>Gender</label>
      <h3>{gender}</h3>
      <br/>
      <label>Birthday</label>
      <h3>{birthday}</h3>
      <br/>
      <label>Status</label>
      <h3>{status}</h3>
      <div className="buttons">
      <button onClick={acceptHandler} className="Acceptbutton" disabled={status === "Active"}>Accept</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button onClick={deleteHandler} className="Rejectbutton">Reject</button>
      </div>
      <br/>
      
      
    
    </div>
  )
}

export default PendingUsersDisplay
