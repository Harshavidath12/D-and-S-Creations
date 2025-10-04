import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./User.css"; //Add a separate CSS file for styling

function User(props) {
  const {
    _id,
    name,
    ledBoardType,
    quantity,
    location,
    purpose,
    rentalStartDateTime,
    rentalEndDateTime,
    paymentMethod,
  } = props.user;

  const history = useNavigate();

  // Delete Function
  const deleteHandler = async () => {
    await axios
      .delete(`http://localhost:5000/bookings/${_id}`)
      .then((res) => res.data)
      .then(() => history("/userdetails"));
  };

  return (
    <div className="user-table-container">
      <h2>User Rental Details</h2>

      <table className="user-table">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{_id}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{name}</td>
          </tr>
          <tr>
            <th>Type</th>
            <td>{ledBoardType}</td>
          </tr>
          <tr>
            <th>Quantity</th>
            <td>{quantity}</td>
          </tr>
          <tr>
            <th>Location</th>
            <td>{location}</td>
          </tr>
          <tr>
            <th>Purpose</th>
            <td>{purpose}</td>
          </tr>
          <tr>
            <th>Start Date & Time</th>
            <td>{new Date(rentalStartDateTime).toLocaleString()}</td>
          </tr>
          <tr>
            <th>End Date & Time</th>
            <td>{new Date(rentalEndDateTime).toLocaleString()}</td>
          </tr>
          <tr>
            <th>Payment Method</th>
            <td>{paymentMethod}</td>
          </tr>
        </tbody>
      </table>

      <div className="action-buttons">
        <Link to={`/userdetails/${_id}`} className="update-btn">
          Update
        </Link>
        <button onClick={deleteHandler} className="delete-btn">
          Delete
        </button>
      </div>
    </div>
  );
}

export default User;
