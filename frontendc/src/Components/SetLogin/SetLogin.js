import axios from 'axios';
import React, { useState } from 'react';
import './SetLogin.css';
import { useNavigate, useLocation } from "react-router";


function SetLogin() {

  const history = useNavigate();
  const location = useLocation(); // Access the location object

  const { _id, firstname, lastname, whoareyou } = location.state || {};

  //Function to generate a simple random username based on name
  const generateUsername = (length = 5) => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let randomPart = "";
    for (let i = 0; i < length; i++) {
      randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return (firstname || "user") +" "+ randomPart; // prepend firstname
  };

    //Function to generate a strong random password
    const generatePassword = (length = 10) => {
      const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

  const [inputs, setInputs] = useState({
    username: generateUsername(),
    password: generatePassword(),
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const [errors, setErrors] = useState({ username: "" });

 const handleSubmit = async (e) => {
  e.preventDefault();

  // basic validation
  if (!inputs.username) {
    alert("Username is required");
    return;
  }
  
  //Check duplicate username before sendRequest
  try {
    const res = await axios.get(`http://localhost:5000/users`);
    const usernameExists = res.data.users.some(
      (u) => u.username?.toLowerCase() === inputs.username.toLowerCase()
    );
    if (usernameExists) {
      setErrors({ username: "This username is already taken!" });
      return;
    }
  } catch (err) {
    console.error("Error checking username duplication:", err);
    setErrors({ username: "Error checking username duplication" });
    return;
  }

  // if all good → send request
  try {
    await sendRequest();
    alert("Request completed successfully.");
    history("/AdminDash");
  } catch (err) {
    alert(err.message);
  }
};

  const sendRequest = async() => {
    await axios.put(`http://localhost:5000/users/${_id}`,{
      username: inputs.username,   
      password: inputs.password,   
      status: "Active"       //Update pending user status
    }).then(res => res.data);

  }
  return (
    <div>
    <h1 className='header'>User Register</h1>
    <div className='form'>
    
      <br/>
      <form onSubmit={handleSubmit} className='formapli'>
        <div className="row">
    <div className="col">
      <label className='lab'>First Name</label>
      <h3 className="readonly">{firstname}</h3>
    </div>
    <div className="col">
      <label className='lab'>Last Name</label>
      <h3 className="readonly">{lastname}</h3>
    </div>
  </div>
        <label className='lab'>Job Roll</label>
        <h3 className="readonly">{whoareyou}</h3>
        <br/>
        <label>Username</label> 
        <input type="text" name="username" className='input' value={inputs.username} disabled />
        {errors.username && <span className="error">{errors.username}</span>}
        <button 
          type="button" 
          className="regen-button" 
          onClick={() => setInputs(prev => ({ ...prev, username: generateUsername() }))}>
          Regenerate Username
        </button>
        <br />
        <br />
        <label>password</label> 
        <input type="text" name="password" className='input' onChange={handleChange}  value={inputs.password}  /> 
        <button type="button"  className="regen-button"  onClick={() => setInputs(prev => ({ ...prev, password: generatePassword() }))}>
          Regenerate Password
        </button>
  
        <br /><br />
        <button type="submit" className='submit'>Submit</button>
    </form>
    </div>
    </div>
  )
}

export default SetLogin
