import React, { useEffect, useState } from "react";
import axios from "axios";
import LedNav from "../LedBoardOwnerDash/LedNav";
import "./LedBoardOwnerDash.css";
import { useNavigate } from "react-router";

function LedBoardOwnerDash() {
  const navigate = useNavigate();

  // 🔹 Get username from localStorage
  const [username, setUsername] = useState("");
  const [inputs, setInputs] = useState({
    outDoor: "",
    inDoor: "",
    p3: "",
    p6: "",
    ownerId: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get username saved in login
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      setInputs((prev) => ({ ...prev, ownerId: storedUsername }));
    } else {
      alert("No user logged in. Please login again.");
      navigate("/login");
    }
  }, [navigate]);

  // 🔹 Handle input change
  const handleChange = (e) => {
    setInputs((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  // 🔹 Validation
  const validate = () => {
    let tempErrors = {};
    if (inputs.outDoor === "" || inputs.outDoor < 0)
      tempErrors.outDoor = "Outdoor value must be 0 or higher";
    if (inputs.inDoor === "" || inputs.inDoor < 0)
      tempErrors.inDoor = "Indoor value must be 0 or higher";
    if (inputs.p3 === "" || inputs.p3 < 0)
      tempErrors.p3 = "P3 value must be 0 or higher";
    if (inputs.p6 === "" || inputs.p6 < 0)
      tempErrors.p6 = "P6 value must be 0 or higher";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // 🔹 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/ledboards", inputs);
      alert("LED Board data added successfully!");

      localStorage.setItem("ownerId", username);

      setInputs({ outDoor: "", inDoor: "", p3: "", p6: "", ownerId: username });
      navigate("/LedFormDash");
    } catch (err) {
      alert("Error submitting form: " + err.message);
    }
  };

  return (
    <div>
      <LedNav />
      <div className="dashboard-container">
        <h1 className="dashboard-title">Welcome, {username}</h1>

        <form className="led-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="outDoor">Out Door Boards</label>
            <input
              type="number"
              id="outDoor"
              name="outDoor"
              min="0"
              value={inputs.outDoor}
              onChange={handleChange}
              className="form-input"
            />
            {errors.outDoor && <span className="error">{errors.outDoor}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="inDoor">In Door Boards</label>
            <input
              type="number"
              id="inDoor"
              name="inDoor"
              min="0"
              value={inputs.inDoor}
              onChange={handleChange}
              className="form-input"
            />
            {errors.inDoor && <span className="error">{errors.inDoor}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="p3">P3 Boards</label>
            <input
              type="number"
              id="p3"
              name="p3"
              min="0"
              value={inputs.p3}
              onChange={handleChange}
              className="form-input"
            />
            {errors.p3 && <span className="error">{errors.p3}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="p6">P6 Boards</label>
            <input
              type="number"
              id="p6"
              name="p6"
              min="0"
              value={inputs.p6}
              onChange={handleChange}
              className="form-input"
            />
            {errors.p6 && <span className="error">{errors.p6}</span>}
          </div>

          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default LedBoardOwnerDash;
