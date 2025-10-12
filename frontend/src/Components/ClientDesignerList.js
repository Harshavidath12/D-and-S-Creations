import React, { useEffect, useState } from "react";
import { getDesigners, updateDesigner, deleteDesigner } from "../api";
import Nav from "../Components/Nav/Nav";
import "../style.css";

const ClientDesignerList = () => {
  const [designers, setDesigners] = useState([]);
  const [selectedDesigner, setSelectedDesigner] = useState(null);
  const [editingDesigner, setEditingDesigner] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDesigners();
  }, []);

  const fetchDesigners = async () => {
    try {
      const { data } = await getDesigners();
      setDesigners(data.map(d => ({ ...d, previousDesigns: d.previousDesigns || [] })));
    } catch (err) {
      console.error("Error fetching designers:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this designer?")) {
      try {
        await deleteDesigner(id);
        setDesigners(designers.filter(d => d._id !== id));
      } catch (err) {
        console.error("Error deleting designer:", err);
      }
    }
  };

  const handleEdit = (designer) => {
    setEditingDesigner(designer);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingDesigner({ ...editingDesigner, [name]: value });
  };

  const handleUpdate = async () => {
    try {
      await updateDesigner(editingDesigner._id, editingDesigner);
      alert("Designer updated successfully!");
      setEditingDesigner(null);
      fetchDesigners();
    } catch (err) {
      console.error("Error updating designer:", err);
    }
  };

  const filteredDesigners = designers.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="designer-page">
      <Nav />

      <div className="content">
        <input
          type="text"
          className="designer-search"
          placeholder="Search designers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Designers Table */}
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
                  <button className="edit-btn" onClick={() => handleEdit(d)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(d._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Designer Details Overlay */}
        {selectedDesigner && (
          <div className="designer-overlay">
            <div className="designer-card">
              <h2>{selectedDesigner.name}</h2>
              <p><strong>Email:</strong> {selectedDesigner.email}</p>
              <p><strong>Type:</strong> {selectedDesigner.type}</p>

              {selectedDesigner.previousDesigns?.length > 0 ? (
                <div className="previous-works">
                  {selectedDesigner.previousDesigns.map((work, index) => {
                    const ext = work.split(".").pop().toLowerCase();
                    return ["mp4", "webm"].includes(ext) ? (
                      <video key={index} controls width="400" height="250" style={{ margin: "10px", borderRadius: "10px" }}>
                        <source src={work} type={`video/${ext}`} />
                      </video>
                    ) : (
                      <img key={index} src={work} alt={`work-${index}`} width="400" style={{ margin: "10px", borderRadius: "10px" }} />
                    );
                  })}
                </div>
              ) : (
                <p>No previous works uploaded</p>
              )}

              <a
                href={`mailto:${selectedDesigner.email}?subject=Work Request&body=Hi ${selectedDesigner.name}, I would like to request a design.`}
                className="custom-btn"
              >
                Contact Designer
              </a>

              <button className="cancel-btn" onClick={() => setSelectedDesigner(null)}>Close</button>
            </div>
          </div>
        )}

        {/* Edit Overlay */}
        {editingDesigner && (
          <div className="designer-overlay">
            <div className="designer-card">
              <h2>Edit Designer</h2>
              <label>Name:</label>
              <input type="text" name="name" value={editingDesigner.name} onChange={handleEditChange} />
              <label>Email:</label>
              <input type="email" name="email" value={editingDesigner.email} onChange={handleEditChange} />
              <label>Type:</label>
              <input type="text" name="type" value={editingDesigner.type} onChange={handleEditChange} />

              <div className="edit-buttons">
                <button className="custom-btn" onClick={handleUpdate}>Save Changes</button>
                <button className="cancel-btn" onClick={() => setEditingDesigner(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDesignerList;
