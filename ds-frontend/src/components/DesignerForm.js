import React, { useState, useEffect } from "react";

const DesignerForm = ({ existingData, onCancel, onSubmit }) => {
  const [formData, setFormData] = useState(
    existingData || { name: "", email: "", type: "", previousDesigns: [] }
  );

  useEffect(() => {
    if (existingData) {
      setFormData({
        ...existingData,
        previousDesigns: existingData.previousDesigns || [],
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setFormData((prev) => ({
      ...prev,
      previousDesigns: [...prev.previousDesigns, ...urls],
    }));
  };

  const handleRemoveFile = (index) => {
    setFormData((prev) => ({
      ...prev,
      previousDesigns: prev.previousDesigns.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const backendData = {
      name: formData.name,
      email: formData.email,
      type: formData.type,
    };

    onSubmit(backendData, formData.previousDesigns);

    if (!existingData) {
      setFormData({ name: "", email: "", type: "", previousDesigns: [] });
    }
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
        placeholder="Email"
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
         <option value="image editing">image Editing</option>
      </select>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />

      {formData.previousDesigns.length > 0 && (
        <div className="preview-list">
          {formData.previousDesigns.map((file, index) => {
            const ext = file.split(".").pop().toLowerCase();
            return ["mp4", "webm"].includes(ext) ? (
              <div key={index} style={{ display: "inline-block", margin: "5px" }}>
                <video src={file} controls width="120" />
                <button type="button" onClick={() => handleRemoveFile(index)}>❌</button>
              </div>
            ) : (
              <div key={index} style={{ display: "inline-block", margin: "5px" }}>
                <img src={file} alt={`preview-${index}`} width="120" />
                <button type="button" onClick={() => handleRemoveFile(index)}>❌</button>
              </div>
            );
          })}
        </div>
      )}

      <button type="submit">{existingData ? "Update" : "Add"}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default DesignerForm;
