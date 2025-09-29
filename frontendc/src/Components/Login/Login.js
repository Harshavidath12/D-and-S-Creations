import axios from 'axios';
import React, { useState } from 'react';
import {useNavigate} from "react-router";
import HomeNav from '../HomeNav/HomeNav';
import "./Login.css";

function Login() {
  const history = useNavigate();
  const [inputs, setInputs] = useState({
    username:"",
    password:""
  });

  const handleChange = (e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const response = await sendRequest();
      if(response.status === "ok"){
        history("/AdminDash");
      }else{
        alert("Login Error !");
      }
    }catch (err) {
      alert ("error" + err.message);
    }
  };

  const sendRequest = async() => {
    return await axios.post("http://localhost:5000/login",{
      username:inputs.username,
      password:inputs.password,
      
    }).then(res => res.data);
  }
  return (
    <div>
      <HomeNav/>
        <h1>User Login</h1>
      <br/>
      <form onSubmit={handleSubmit}>
        <label>Username</label> 
        <input type="text" name="username" onChange={handleChange} value={inputs.username} required></input> 
        <br />
        <br />
        <label>password</label> 
        <input type="password" name="password" onChange={handleChange} value={inputs.password} required></input> 
        <br /><br />
        <button type="submit">Login</button>
    </form>
    </div>
  )
}

export default Login
