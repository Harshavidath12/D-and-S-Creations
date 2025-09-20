import React, { useEffect, useState } from "react";
import { getDesigners, createDesigner, updateDesigner, deleteDesigner } from "../api";
import DesignerForm from "./DesignerForm";
import "../style.css";

const DesignerList = () => {
  const [designers, setDesigners] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesigner, setSelectedDesigner] = useState(null); // New state for details

  const fetchData = async () => {
    const { data } = await getDesigners();
    setDesigners(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (designer) => {
    if (editing) {
      await updateDesigner(editing._id, designer);
      setEditing(null);
    } else {
      await createDesigner(designer);
    }
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteDesigner(id);
    if (selectedDesigner && selectedDesigner._id === id) {
      setSelectedDesigner(null); // Clear details if deleted
    }
    fetchData();
  };

  const handleEdit = (designer) => {
    setEditing(designer);
    setShowForm(true);
  };

  // Filter designers based on search term
  const filteredDesigners = designers.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page">
      {/* Search + Add button */}
      <div style={{ marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <input
          type="text"
          placeholder="Search designers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px 12px",
            width: "250px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "16px"
          }}
        />
        <button className="floating-btn" onClick={() => { setShowForm(true); setEditing(null); }}>
          ➕ Add Designer
        </button>
      </div>

      {/* Add/Edit Designer Form */}
      {showForm && (
        <DesignerForm
          onSubmit={handleAdd}
          existingData={editing}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}

      {/* Designers Table */}
      <h3>Designers List</h3>
      <table>
        <thead>
          <tr>
            <th>Name</th><th>Email</th><th>Type</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDesigners.map((d) => (
            <tr key={d._id}>
              <td
                className="designer-name clickable"
                onClick={() => setSelectedDesigner(d)}
              >
                {d.name}
              </td>
              <td>{d.email}</td>
              <td>{d.type}</td>
              <td>
                <button onClick={() => handleEdit(d)}>✏️</button>
                <button onClick={() => handleDelete(d._id)}>🗑️</button>
              </td>
            </tr>
          ))}
          {filteredDesigners.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>No designers found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Designer Details Panel */}
      {selectedDesigner && (
        <div className="designer-details">
          <h3>Designer Details</h3>
          <p><strong>Name:</strong> {selectedDesigner.name}</p>
          <p><strong>Email:</strong> {selectedDesigner.email}</p>
          <p><strong>Type:</strong> {selectedDesigner.type}</p>
          <p><strong>Previous Designs:</strong> {selectedDesigner.previousDesigns.join(", ")}</p>
          <button onClick={() => setSelectedDesigner(null)} className="cancel-btn">Close</button>
        </div>
      )}
    </div>
  );
};

export default DesignerList;
