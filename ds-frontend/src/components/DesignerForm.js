import React, { useState, useEffect } from "react";

const DesignerForm = ({ onSubmit, existingData, onCancel }) => {
  const [formData, setFormData] = useState(
    existingData || { name: "", email: "", type: "", previousDesigns: "" }
  );

  useEffect(() => {
    if (existingData) {
      setFormData({
        ...existingData,
        previousDesigns: Array.isArray(existingData.previousDesigns)
          ? existingData.previousDesigns.join(", ")
          : existingData.previousDesigns || ""
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let previousDesigns = formData.previousDesigns;
    if (typeof previousDesigns === "string") {
      previousDesigns = previousDesigns
        .split(",")
        .map((d) => d.trim())
        .filter((d) => d.length > 0);
    }

    const designerData = {
      ...formData,
      previousDesigns,
    };

    onSubmit(designerData);

    setFormData({ name: "", email: "", type: "", previousDesigns: "" });
  };

  return (
    <form className="form" onSubmit={handleSubmit}>
      <h3>{existingData ? "Update Designer" : "Add Designer"}</h3>

      <input
        name="name"
        placeholder="Designer Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <select
        name="type"
        value={formData.type}
        onChange={handleChange}
        required
      >
        <option value="">Select Designer Type</option>
        <option value="video editing">Video Editing</option>
        <option value="image editing">Image Editing</option>
      </select>

      <input
        name="previousDesigns"
        placeholder="Previous Designs (comma separated)"
        value={formData.previousDesigns}
        onChange={handleChange}
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

export default DesignerForm;
