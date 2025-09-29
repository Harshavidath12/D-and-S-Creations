import React, { useEffect, useState } from "react";
import DesignerForm from "./DesignerForm";
import { getDesigners, createDesigner, updateDesigner, deleteDesigner } from "../api";
import "../style.css";

const DesignerList = () => {
  const [designers, setDesigners] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      const { data } = await getDesigners();
      setDesigners(data.map(d => ({ ...d, previousDesigns: d.previousDesigns || [] })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (backendData, frontendDesigns) => {
    try {
      let response;
      if (editing) {
        response = await updateDesigner(editing._id, backendData);
        setDesigners(designers.map(d =>
          d._id === editing._id ? { ...d, ...backendData, previousDesigns: frontendDesigns } : d
        ));
      } else {
        response = await createDesigner(backendData);
        setDesigners([...designers, { ...response.data, previousDesigns: frontendDesigns }]);
      }
      setShowForm(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error saving designer");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDesigner(id);
      setDesigners(designers.filter(d => d._id !== id));
      if (selectedDesigner && selectedDesigner._id === id) setSelectedDesigner(null);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredDesigners = designers.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="designer-page">
    
      <input
        type="text"
        className="designer-search"
        placeholder="Search designers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Designer Form ABOVE the table */}
      {showForm && (
        <div className="form-top-container">
          <DesignerForm
            existingData={editing}
            onCancel={() => { setShowForm(false); setEditing(null); }}
            onSubmit={handleSubmit}
          />
        </div>
      )}

      {/* Designer Table */}
      <table className="designer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDesigners.map(d => (
            <tr key={d._id}>
              <td className="clickable" onClick={() => setSelectedDesigner(d)}>{d.name}</td>
              <td>{d.email}</td>
              <td>{d.type}</td>
              <td>
                <button onClick={() => { setEditing(d); setShowForm(true); }}>✏️</button>
                <button onClick={() => handleDelete(d._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Floating Add Designer Button */}
      <button
        className="floating-add-btn"
        onClick={() => { setShowForm(true); setEditing(null); }}
      >
        ➕ Add Designer
      </button>

      {/* Designer Details Card / Overlay */}
      {selectedDesigner && (
        <div className="designer-overlay">
          <div className="designer-card">
            <h2>{selectedDesigner.name}</h2>
            <p><strong>Email:</strong> {selectedDesigner.email}</p>
            <p><strong>Type:</strong> {selectedDesigner.type}</p>

            {selectedDesigner.previousDesigns && selectedDesigner.previousDesigns.length > 0 ? (
              <div className="previous-works">
                {selectedDesigner.previousDesigns.map((work, index) => {
                  const ext = work.split(".").pop().toLowerCase();
                  return ["mp4", "webm"].includes(ext) ? (
                    <video 
                      key={index} 
                      controls 
                      width="400" 
                      height="250" 
                      style={{ margin: "10px", borderRadius: "10px" }}
                    >
                      <source src={work} type={`video/${ext}`} />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img 
                      key={index} 
                      src={work} 
                      alt={`work-${index}`} 
                      width="400" 
                      style={{ margin: "10px", borderRadius: "10px" }}
                    />
                  );
                })}
              </div>
            ) : (
              <p>No previous works uploaded</p>
            )}

            <a
              href={`mailto:${selectedDesigner.email}?subject=Customization Request&body=Hi ${selectedDesigner.name}, I would like to discuss a custom design.`}
              className="custom-btn"
            >
              Customize
            </a>

            <button className="cancel-btn" onClick={() => setSelectedDesigner(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignerList;
