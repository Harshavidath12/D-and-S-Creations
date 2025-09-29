import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {useParams} from 'react-router'
import { useNavigate} from 'react-router'

function UpdateAdmin() {
    const [inputs, setInputs] = useState({});
    const history = useNavigate();
    const id = useParams().id;

    useEffect(() => {
        const fetchHandler = async () => {
            await axios
            .get(`http://localhost:5000/users/68d45316d8aaac622bf0de65`)
            .then((res) => res.data)
            .then((data) => setInputs(data.users));
        };
        fetchHandler();
    },[id]);

    const sendRequest = async () => {
      const formData = new FormData();
      formData.append("firstname", inputs.firstname);
      formData.append("lastname", inputs.lastname);
      formData.append("email", inputs.email);
      formData.append("phonenumber", inputs.phonenumber);
      formData.append("whoareyou", inputs.whoareyou);
      formData.append("gender", inputs.gender);
      formData.append("birthday", inputs.birthday);
      if (inputs.ProfilePic) formData.append("ProfilePic", inputs.ProfilePic);

      await axios.put(`http://localhost:5000/users/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
    };

    const handleChange = (e) => {
      if (e.target.type === "file") {
        setInputs((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.files[0], // store File object
        }));
      } else {
        setInputs((prevState) => ({
          ...prevState,
          [e.target.name]: e.target.value,
        }));
      }
    };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(inputs);
    sendRequest().then(() => history("/AdminProfile"))  //give the path  
  };

   
  return (
    <div>
      <h1>Update Your Profile</h1>
      <br/>
      <form className="register-form" onSubmit={handleSubmit}>

        <label>Profile Picture</label>
        <input type="file" name="ProfilePic" onChange={(e) => 
        setInputs(prev => ({ ...prev, ProfilePic: e.target.files[0] }))} />
        <br />

        <label>First Name</label> 
        <input type="text" name="firstname" onChange={handleChange} value={inputs.firstname} required></input> 
        <br />

        <label>Last Name</label> 
        <input type="text" name="lastname" onChange={handleChange} value={inputs.lastname} required></input> 
        <br />
        
        <label>Email</label> 
        <input type="email" name="email" onChange={handleChange} value={inputs.email} required></input> 
        <br />

        <label>Phone Number</label> 
        <input type="tel" name="phonenumber" onChange={handleChange} value={inputs.phonenumber} required></input> 
        <br />

        <label>Who Are You</label> 
        <select name="whoareyou" onChange={handleChange} value={inputs.whoareyou} required>
          <option value="Client">Client</option>
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
        <input type="text" name="birthday" onChange={handleChange} value={inputs.birthday} required></input> 
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default UpdateAdmin
