import axios from 'axios';
import React, { useState } from 'react';
import {useNavigate} from "react-router";


function Register() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    username:"",
    email:"",
    phonenumber:"",
    whoareyou:"",
    gender:"",
    birthday:""
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/AdminDash"))  //give the path
  };

  const sendRequest = async() => {
    await axios.post("http://localhost:5000/users",{
      username:String (inputs.username),
      email:String (inputs.email),
      phonenumber:String (inputs.phonenumber),
      whoareyou:String (inputs.whoareyou),
      gender:String (inputs.gender),
      birthday:Date (inputs.birthday)
    }).then(res => res.data);
  }

  return (
    <div>
      <h1>Register</h1>
      <br/>
      <form onSubmit={handleSubmit}>
        <label>Username</label> 
        <input type="text" name="username" onChange={handleChange} value={inputs.username} required></input> 
        <br />
        
        <label>Email</label> 
        <input type="email" name="email" onChange={handleChange} value={inputs.email} required></input> 
        <br />

        <label>Phone Number</label> 
        <input type="tel" name="phonenumber" onChange={handleChange} value={inputs.phonenumber} required></input> 
        <br />

        <label>Who Are You</label> 
        <select name="whoareyou" onChange={handleChange} value={inputs.whoareyou} required>
          <option value="Client" selected>Client</option>
          <option value="FilmHall Owner">FilmHall Owner</option>
          <option value="LedBoard Owner">LedBoard Owner</option>
          <option value="Designer">Designer</option>
        </select> <br />

        <label>Gender</label>
        <select name="gender" onChange={handleChange} value={inputs.gender} required>
          <option value="select" selected>Select... </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select> <br />

        <label>Birthday</label> 
        <input type="date" name="birthday" onChange={handleChange} value={inputs.birthday} required></input> 
        <br />

        <button type="submit">Request</button>
      </form>
    </div>
  )
}

export default Register
