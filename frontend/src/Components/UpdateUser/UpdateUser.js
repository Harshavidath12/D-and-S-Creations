import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

function UpdateUser() {
  const [inputs, setInputs] = useState({}); //import krapu tika set kragaganna
  const history = useNavigate();
  const id = useParams().id;

  useEffect(() => {
    const fetchHandler = async () => {
      await axios
        .get(`http://localhost:5000/users/${id}`)
        .then((res) => res.data)
        .then((data) => setInputs(data.user));
    };
    fetchHandler();
  }, [id]);

  //database ekata update wumna details insert wena part eka

  const sendRequest = async () => {
    await axios.put(`http://localhost:5000/users/${id}`, {
      name: String(inputs.name),
          ledBoardType: String(inputs.ledBoardType),
          quantity: String(inputs.quantity),
          location: String(inputs.location),
          purpose: String(inputs.purpose),
          rentalStartDateTime: String(inputs.rentalStartDateTime),
          rentalEndDateTime: String(inputs.rentalEndDateTime),
          paymentMethod: String(inputs.paymentMethod),
    })
    .then((res)=>res.data);
  };

   // handle input changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

    // handle form submit
  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(()=>history("/userdetails"));// user update button eka click krama userdetails page ekata yanna
  };

  return (
    <div>
      <h1>Update User</h1>
     <form className="ledboard-form" onSubmit={handleSubmit}>

            {/* Name */}
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter Full name"
            value={inputs.name}
            onChange={handleChange}
            required
          />


          {/* Type of LED Board */}
          <label>Type of LED Board</label>
          <select name="ledBoardType" value={inputs.ledBoardType} onChange={handleChange} required>
            <option value="">-- Select Type --</option>
            <option value="Outdoor">Outdoor LED Board</option>
            <option value="Indoor">Indoor LED Board</option>
            <option value="P3">P3 LED Board</option>
            <option value="P6">P6 LED Board</option>
          </select>

          {/* Quantity */}
          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            min="1"
            value={inputs.quantity}
            onChange={handleChange}
            required
          />

          {/* Location */}
          <label>Location (Venue, City, Address)</label>
          <input
            type="text"
            name="location"
            placeholder="Enter location"
            value={inputs.location}
            onChange={handleChange}
            required
          />

          {/* Purpose */}
          <label>Purpose</label>
          <select name="purpose" value={inputs.purpose} onChange={handleChange} required>
            <option value="">-- Select Purpose --</option>
            <option value="Advertisement">Advertisement</option>
            <option value="Wedding">Wedding</option>
            <option value="Concert">Concert</option>
            <option value="Conference">Conference</option>
            <option value="School Event">School Event</option>
            <option value="University Event">University Event</option>
          </select>

          {/* Rental Dates */}
          <label>Rental Start Date & Time</label>
          <input
            type="datetime-local"
            name="rentalStartDateTime"
            value={inputs.rentalStartDateTime}
            onChange={handleChange}
            required
          />

          <label>Rental End Date & Time</label>
          <input
            type="datetime-local"
            name="rentalEndDateTime"
            value={inputs.rentalEndDateTime}
            onChange={handleChange}
            required
          />

          {/* Payment */}
          <label>Payment Method</label>
          <select name="paymentMethod" value={inputs.paymentMethod} onChange={handleChange} required>
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
