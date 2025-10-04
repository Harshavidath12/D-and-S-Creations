import axios from 'axios';
import React, { useState } from 'react';
import './Register.css'
import HomeNav from '../HomeNav/HomeNav';
import {useNavigate} from "react-router";


function Register() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    firstname:"", 
    lastname:"",
    email:"",
    phonenumber:"",
    whoareyou:"",
    gender:"",
    birthday:""
  });

  const [errors, setErrors] = useState({});  // State to hold validation errors

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));  
  };

    // 🔹 validation function
  const validate = async () => {
    let tempErrors = {};

    // First name & last name just required
    if (!inputs.firstname.trim()) tempErrors.firstname = "First name is required";
    if (!inputs.lastname.trim()) tempErrors.lastname = "Last name is required";

    // Email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      tempErrors.email = "Invalid email format";
    } else {
      // check duplicate email in DB
      try {
        const res = await axios.get(`http://localhost:5000/users`);
        const emailExists = res.data.users.some(
          (u) => u.email.toLowerCase() === inputs.email.toLowerCase()
        );
        if (emailExists) tempErrors.email = "This email is already registered";
      } catch (err) {
        console.error(err);
      }
    }

    // Phone digits only
    if (!/^\d{10}$/.test(inputs.phonenumber)) {
      tempErrors.phonenumber = "Phone number must be 10 digits";
    }

    // Birthday must be in the past
    const selectedDate = new Date(inputs.birthday);
    const today = new Date();

    // zero-out time so only date matters
    selectedDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);

    if (!inputs.birthday) {
      tempErrors.birthday = "Birthday is required";
    } else if (selectedDate >= today) {
      tempErrors.birthday = "Birthday must be in the past (not today)";
    }

    // Who are you & gender required
    if (!inputs.whoareyou) tempErrors.whoareyou = "Please select a role";
    if (!inputs.gender) tempErrors.gender = "Please select gender";

    setErrors(tempErrors);

    // return true if no errors
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = await validate();
    if (!valid) return; // stop submit if errors

    try {
      await axios.post("http://localhost:5000/users", {
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        email: inputs.email,
        phonenumber: inputs.phonenumber,
        whoareyou: inputs.whoareyou,
        gender: inputs.gender,
        birthday: inputs.birthday
      });
      alert("Request completed successfully.\nPlease wait for your username and password. Check your WhatsApp or email.\nThank you!");
      history("/Home");
    } catch (err) {
      alert("Error submitting form: " + err.message);
    }
  };

  return (
    <div>
      <HomeNav />
      <div className="register-container">
        <h1>Register</h1>
        <br />
        <form className="register-form" onSubmit={handleSubmit}>
          
          <label>First Name</label>
          <input type="text" name="firstname" onChange={handleChange} value={inputs.firstname}/>
          {errors.firstname && <span className="error">{errors.firstname}</span>}
          
          <label>Last Name</label>
          <input type="text" name="lastname" onChange={handleChange} value={inputs.lastname}/>
          {errors.lastname && <span className="error">{errors.lastname}</span>}
          
          <label>Email</label>
          <input type="email" name="email" onChange={handleChange} value={inputs.email}/>
          {errors.email && <span className="error">{errors.email}</span>}
          
          <label>Phone Number</label>
          <h7>(Must WhatsApp Number)</h7>
          <input type="tel" name="phonenumber" onChange={handleChange} value={inputs.phonenumber}/>
          {errors.phonenumber && <span className="error">{errors.phonenumber}</span>}
          
          <label>Who Are You</label>
          <select name="whoareyou" onChange={handleChange} value={inputs.whoareyou}>
            <option value="">Select...</option>
            <option value="Client">Client</option>
            <option value="FilmHall Owner">FilmHall Owner</option>
            <option value="LedBoard Owner">LedBoard Owner</option>
            <option value="Designer">Designer</option>
          </select>
          {errors.whoareyou && <span className="error">{errors.whoareyou}</span>}
          
          <label>Gender</label>
          <select name="gender" onChange={handleChange} value={inputs.gender}>
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && <span className="error">{errors.gender}</span>}
          
          <label>Birthday</label>
          <input type="date" name="birthday" onChange={handleChange} value={inputs.birthday}/>
          {errors.birthday && <span className="error">{errors.birthday}</span>}
          
          <button type="submit">Request</button>
        </form>
      </div>
    </div>
  );
}

export default Register
