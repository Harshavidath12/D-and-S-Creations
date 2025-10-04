import React, { useState, useEffect } from "react";
import { getDesigners } from "../api";

const ComplaintForm = ({ onSubmit, existingData, onCancel }) => {
  const [formData, setFormData] = useState(
    existingData || { designerId: "", clientName: "", description: "", date: "" }
  );
  const [designers, setDesigners] = useState([]);

  useEffect(() => {
    const fetchDesigners = async () => {
      try {
        const { data } = await getDesigners();
        setDesigners(data);
      } catch (err) {
        console.error("Error fetching designers:", err);
      }
    };
    fetchDesigners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!formData.date) {
      alert("Please select a date.");
      return;
    }

    const today = new Date();
    const selectedDate = new Date(formData.date);
    today.setHours(0, 0, 0, 0); 

    if (selectedDate < today) {
      alert("Please select a date from today or a future date.");
      return;
    }

    onSubmit(formData);

   
    if (!existingData) {
      setFormData({ designerId: "", clientName: "", description: "", date: "" });
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{existingData ? "Update Complaint" : "Add Complaint"}</h3>

      <select
        name="designerId"
        value={formData.designerId}
        onChange={handleChange}
        required
      >
        <option value="">Select Designer</option>
        {designers.map((d) => (
          <option key={d._id} value={d._id}>{d.name}</option>
        ))}
      </select>

      <input
        name="clientName"
        placeholder="Client Name"
        value={formData.clientName}
        onChange={handleChange}
        required
      />

      <input
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        min={new Date().toISOString().split("T")[0]} 
        max={new Date().toISOString().split("T")[0]} 
        required
      />

      <button type="submit">{existingData ? "Update" : "Add"}</button>

      {onCancel && (
        <button
          onClick={onCancel}
          type="button"
          className="cancel-btn"
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ComplaintForm;
