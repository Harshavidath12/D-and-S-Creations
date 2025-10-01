import axios from 'axios';
import React, { useState } from 'react';
import {useNavigate} from "react-router";
import HomeNav from '../HomeNav/HomeNav';
import "./Login.css";

function Login() {
  const history = useNavigate();
  const [user, setUser] = useState({
    username:"",
    password:""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({...prevUser, [name]: value}));
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
      username: user.username,
      password: user.password,
      
    }).then(res => res.data);
  }
  return (
    <div>
      <HomeNav/>
        <h1>User Login</h1>
      <br/>
      <form onSubmit={handleSubmit}>
        <label>Username</label> 
        <input type="text" name="username" onChange={handleInputChange} value={user.username} required></input> 
        <br />
        <br />
        <label>password</label> 
        <input type="password" name="password" onChange={handleInputChange} value={user.password} required></input> 
        <br /><br />
        <button type="submit">Login</button>
    </form>
    </div>
  )
}

export default Login
