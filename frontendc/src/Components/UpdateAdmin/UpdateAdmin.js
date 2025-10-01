import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router';

function UpdateAdmin() {
  const [inputs, setInputs] = useState({});
  const [errors, setErrors] = useState({});
  const history = useNavigate();
  const id = useParams().id;

  // Fetch user data on mount
  useEffect(() => {
    const fetchHandler = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/users/${id}`);
        setInputs(res.data.users); // ensure your API returns "users"
      } catch (err) {
        console.error(err);
      }
    };
    fetchHandler();
  }, [id]);

  // Handle input change and clear individual field error
  const handleChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors(prev => ({ ...prev, [e.target.name]: "" }));
  };

  // Validation function
  const validate = async () => {
    let tempErrors = {};

    // First name & last name required
    if (!inputs.firstname?.trim()) tempErrors.firstname = "First name is required";
    if (!inputs.lastname?.trim()) tempErrors.lastname = "Last name is required";

    // Email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inputs.email)) {
      tempErrors.email = "Invalid email format";
    } else {
      try {
        const res = await axios.get(`http://localhost:5000/users`);
        const emailExists = res.data.users.some(
          u => u.email.toLowerCase() === inputs.email.toLowerCase() && u._id !== id
        );
        if (emailExists) tempErrors.email = "This email is already registered";
      } catch (err) {
        console.error(err);
      }
    }

    // Phone number: 10 digits only
    if (!/^\d{10}$/.test(inputs.phonenumber)) {
      tempErrors.phonenumber = "Phone number must be 10 digits";
    }

    // Birthday must be in the past
    if (!inputs.birthday) {
      tempErrors.birthday = "Birthday is required";
    } else {
      const selectedDate = new Date(inputs.birthday);
      const today = new Date();
      selectedDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      if (selectedDate >= today) {
        tempErrors.birthday = "Birthday must be in the past (not today)";
      }
    }

    // Who are you & gender required
    if (!inputs.whoareyou) tempErrors.whoareyou = "Please select a role";
    if (!inputs.gender) tempErrors.gender = "Please select gender";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validate();
    if (!isValid) return;

    try {
      const res = await axios.put(`http://localhost:5000/users/${id}`, {
        firstname: inputs.firstname,
        lastname: inputs.lastname,
        email: inputs.email,
        phonenumber: inputs.phonenumber,
        whoareyou: inputs.whoareyou,
        gender: inputs.gender,
        birthday: inputs.birthday
      });
      console.log(res.data);
      alert("Profile updated successfully!");
      history("/AdminProfile"); // navigate after update
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      alert("Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div>
      <h1>Update Your Profile</h1>
      <br/>
      <form className="register-form" onSubmit={handleSubmit}>

        <label>First Name</label> 
        <input type="text" name="firstname" onChange={handleChange} value={inputs.firstname || ""} />
        {errors.firstname && <span className="error">{errors.firstname}</span>}
        <br />

        <label>Last Name</label> 
        <input type="text" name="lastname" onChange={handleChange} value={inputs.lastname || ""} />
        {errors.lastname && <span className="error">{errors.lastname}</span>}
        <br />
        
        <label>Email</label> 
        <input type="email" name="email" onChange={handleChange} value={inputs.email || ""} />
        {errors.email && <span className="error">{errors.email}</span>}
        <br />

        <label>Phone Number</label> 
        <input type="tel" name="phonenumber" onChange={handleChange} value={inputs.phonenumber || ""} />
        {errors.phonenumber && <span className="error">{errors.phonenumber}</span>}
        <br />

        <label>Who Are You</label> 
        <select name="whoareyou" onChange={handleChange} value={inputs.whoareyou || ""}>
          <option value="">Select role</option>
          <option value="Client">Client</option>
          <option value="FilmHall Owner">FilmHall Owner</option>
          <option value="LedBoard Owner">LedBoard Owner</option>
          <option value="Designer">Designer</option>
        </select>
        {errors.whoareyou && <span className="error">{errors.whoareyou}</span>}
        <br />

        <label>Gender</label>
        <select name="gender" onChange={handleChange} value={inputs.gender || ""}>
          <option value="">Select gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.gender && <span className="error">{errors.gender}</span>}
        <br />

        <label>Birthday</label> 
        <input type="date" name="birthday" onChange={handleChange} value={inputs.birthday || ""} />
        {errors.birthday && <span className="error">{errors.birthday}</span>}
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default UpdateAdmin;
