import React, { useState } from "react";
import Nav from "../Nav/Nav";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AddUser() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({
    name: "",
    ledBoardType: "",
    quantity: "",
    location: "",
    purpose: "",
    rentalStartDateTime: "",
    rentalEndDateTime: "",
    paymentMethod: "",
  });

  // handle input changes
  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // send request to backend
  const sendRequest = async () => {
    return await axios.post("http://localhost:5000/users", {
      name: String(inputs.name),
      gmail: String(inputs.gmail),
      age: String(inputs.age),
      address: String(inputs.address),
    });
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    sendRequest().then(() => {
      navigate("/userdetails"); // ✅ navigate only after insert completes
    });
  };

  return (
    <div>
      <Nav />
      <h1>Add User</h1>
      <form onSubmit={handleSubmit}>
        <label>Name</label>
        <br />
        <input
          type="text"
          name="name"
          onChange={handleChange}
          required
          value={inputs.name}
        />
        <br />
        <br />

        <label>Led Board Type</label>
        <br />
        <input
          type="text"
          name="ledBoardType"
          onChange={handleChange}
          required
          value={inputs.ledBoardType}
        />
        <br />
        <br />

        <label>Quantity</label>
        <br />
        <input
          type="text"
          name="quantity"
          onChange={handleChange}
          required
          value={inputs.quantity}
        />
        <br />
        <br />

        <label>location</label>
        <br />
        <input
          type="text"
          name="location"
          onChange={handleChange}
          required
          value={inputs.location}
        />
        <br />
        <br />

        <label>Purpose</label>
        <br />
        <input
          type="text"
          name="purpose"
          onChange={handleChange}
          required
          value={inputs.purpose}
        />
        <br />
        <br />

        
        <label>rentalStartDateTime</label>
        <br />
        <input
          type="text"
          name="rentalStartDateTime"
          onChange={handleChange}
          required
          value={inputs.rentalStartDateTime}
        />
        <br />
        <br />

        <label>rentalEndDateTime</label>
        <br />
        <input
          type="text"
          name="rentalEndDateTime"
          onChange={handleChange}
          required
          value={inputs.rentalEndDateTime}
        />
        <br />
        <br />

        <label>PaymentMethod</label>
        <br />
        <input
          type="text"
          name="paymentMethod"
          onChange={handleChange}
          required
          value={inputs.paymentMethod}
        />
        <br />
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AddUser;

