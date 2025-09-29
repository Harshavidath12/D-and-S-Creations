import React, { useEffect, useState } from "react";
import { getDesigners } from "../api";
import "../style.css";

const ClientDesignerList = () => {
  const [designers, setDesigners] = useState([]);
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
      console.error("Error fetching designers:", err);
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

      {/* Designers Table (view only) */}
      <table className="designer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {filteredDesigners.map(d => (
            <tr key={d._id}>
              <td className="clickable" onClick={() => setSelectedDesigner(d)}>{d.name}</td>
              <td>{d.email}</td>
              <td>{d.type}</td>
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
              href={`mailto:${selectedDesigner.email}?subject=Work Request&body=Hi ${selectedDesigner.name}, I would like to request a design.`}
              className="custom-btn"
            >
              Contact Designer
            </a>

            <button className="cancel-btn" onClick={() => setSelectedDesigner(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDesignerList;
