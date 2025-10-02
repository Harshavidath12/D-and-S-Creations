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
    setUser((prevUser) => ({
      ...prevUser, 
      [name]: value}));
  };

  const handleSubmit = async(e) => {
  e.preventDefault();

  try {
    const response = await sendRequest();

    if(response.status === "ok"){
      localStorage.setItem("username", response.user.username); // save username

      switch (response.user.whoareyou) {
        case "Admin":
          history("/AdminDash");
          break;
        case "Designer":
          history("/DesignerDash");
          break;
        case "FilmHall Owner":
          history("/FilmHallOwnerDash");
          break;
        case "LedBoard Owner":
          history("/LedBoardOwnerDash");
          break;
        case "Client":
          history("/Home");
          break;
        default:
          history("/"); // fallback
      }
    } else {
      alert("Login Error !");
    }
  } catch (err) {
    alert("Error: " + err.message);
  }
};

  //Function to call the backend login
  const sendRequest = async() => {
    return await axios.post("http://localhost:5000/login",{
      username: user.username,
      password: user.password,
      
    }).then(res => res.data);
  }
  return (
    <div> <HomeNav/>
    <div className='div23'>
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
    </div>
  )
}

export default Login
