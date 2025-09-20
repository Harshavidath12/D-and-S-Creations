import React, { useState, useEffect } from "react";
import { getDesigners } from "../api";

const ComplaintForm = ({ onSubmit, existingData, onCancel }) => {
  const [formData, setFormData] = useState(
    existingData || { designerId: "", clientName: "", description: "", date: "" }
  );
  const [designers, setDesigners] = useState([]);

  useEffect(() => {
    const fetchDesigners = async () => {
      const { data } = await getDesigners();
      setDesigners(data);
    };
    fetchDesigners();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ designerId: "", clientName: "", description: "", date: "" });
  };

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{existingData ? "Update Complaint" : "Add Complaint"}</h3>

      <select name="designerId" value={formData.designerId} onChange={handleChange} required>
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
        min={today} // <-- restrict past dates
        required
      />

      <button type="submit">{existingData ? "Update" : "Add"}</button>
      {onCancel && (
        <button onClick={onCancel} type="button" className="cancel-btn">
          Cancel
        </button>
      )}
    </form>
  );
};

export default ComplaintForm;
