import axios from 'axios';
import React, { useState } from 'react';
import './SetLogin.css';
import { useNavigate, useLocation } from "react-router";


function SetLogin() {
  const history = useNavigate();
  const location = useLocation();

  const { _id, firstname, lastname, whoareyou } = location.state || {};

   const generatePassword = (length = 10) => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const [inputs, setInputs] = useState({
    username:"",
    password: generatePassword(),
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
    sendRequest().then(() => {
      alert ("Request completed successfully.")
      history("/AdminDash")  //give the path
      })
      .catch((err)=>{
        alert(err.message);
      });
  };

  const sendRequest = async() => {
    await axios.post("http://localhost:5000/registers",{
      username:String (inputs.username),
      password:String (inputs.password),
      whoareyou: whoareyou, 
    }).then(res => res.data);

  //Update pending user status
  await axios.put(`http://localhost:5000/users/${_id}`, {
    status: "Active"
  });
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
        <input type="text" name="username" className='input' onChange={handleChange} value={inputs.username} required></input> 
        <br />
        <br />
        <label>password</label> 
        <input type="text" name="password" className='input'  value={inputs.password}  /> 
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
