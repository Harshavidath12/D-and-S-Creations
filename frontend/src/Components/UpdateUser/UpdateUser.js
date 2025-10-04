import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateUser.css";  // 🔹 Add this

function UpdateUser() {
  const [inputs, setInputs] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/bookings/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.user));
    };
    fetchHandler();
  }, [id]);

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/bookings/${id}`, {
      name: String(inputs.name),
      ledBoardType: String(inputs.ledBoardType),
      quantity: String(inputs.quantity),
      location: String(inputs.location),
      purpose: String(inputs.purpose),
      rentalStartDateTime: String(inputs.rentalStartDateTime),
      rentalEndDateTime: String(inputs.rentalEndDateTime),
      paymentMethod: String(inputs.paymentMethod),
    })
    .then((res) => res.data);
  };

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/userdetails"));
  };

  return (
    <div className="update-user-container">
      <h1>Update User</h1>
      <form className="update-user-form" onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          placeholder="Enter Full name"
          value={inputs.name || ""}
          onChange={handleChange}
          required
        />

        <label>Type of LED Board</label>
        <select
          name="ledBoardType"
          value={inputs.ledBoardType || ""}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Type --</option>
          <option value="Outdoor">Outdoor LED Board</option>
          <option value="Indoor">Indoor LED Board</option>
          <option value="P3">P3 LED Board</option>
          <option value="P6">P6 LED Board</option>
        </select>

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          min="1"
          value={inputs.quantity || ""}
          onChange={handleChange}
          required
        />

        <label>Location (Venue, City, Address)</label>
        <input
          type="text"
          name="location"
          placeholder="Enter location"
          value={inputs.location || ""}
          onChange={handleChange}
          required
        />

        <label>Purpose</label>
        <select
          name="purpose"
          value={inputs.purpose || ""}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Purpose --</option>
          <option value="Advertisement">Advertisement</option>
          <option value="Wedding">Wedding</option>
          <option value="Concert">Concert</option>
          <option value="Conference">Conference</option>
          <option value="School Event">School Event</option>
          <option value="University Event">University Event</option>
        </select>

        <label>Rental Start Date & Time</label>
        <input
          type="datetime-local"
          name="rentalStartDateTime"
          value={inputs.rentalStartDateTime || ""}
          onChange={handleChange}
          required
        />

        <label>Rental End Date & Time</label>
        <input
          type="datetime-local"
          name="rentalEndDateTime"
          value={inputs.rentalEndDateTime || ""}
          onChange={handleChange}
          required
        />

        <label>Payment Method</label>
        <select
          name="paymentMethod"
          value={inputs.paymentMethod || ""}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Payment --</option>
          <option value="Card">Credit / Debit Card</option>
          <option value="Bank">Bank Transfer</option>
          <option value="Cash">Cash</option>
        </select>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UpdateUser;
