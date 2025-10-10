import React, { useEffect, useState } from "react";
import { getComplaints, createComplaint, updateComplaint, deleteComplaint, downloadComplaintsPDF } from "../api";
import ComplaintForm from "./ComplaintForm";
import "../style.css";
import Nav from "../Components/Nav/Nav"

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    const { data } = await getComplaints();
    setComplaints(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (complaint) => {
    if (editing) {
      await updateComplaint(editing._id, complaint);
      setEditing(null);
    } else {
      await createComplaint(complaint);
    }
    setShowForm(false);
    fetchData();
  };

  const handleDelete = async (id) => {
    await deleteComplaint(id);
    fetchData();
  };

  const handleDownload = async () => {
    const res = await downloadComplaintsPDF();
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "complaints.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <Nav/>
    <div className="page">
     <div className="top-actions">
       <button className="download-btn" onClick={handleDownload}>
       ⬇️ Download PDF
       </button>
    </div>

      {showForm && (
        <ComplaintForm onSubmit={handleAdd} existingData={editing} onCancel={() => { setEditing(null); setShowForm(false); }} />
      )}
      <h3>Complaints List</h3>
      <table>
        <thead>
          <tr>
            <th>Client</th><th>Designer</th><th>Description</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map((c) => (
            <tr key={c._id}>
              <td>{c.clientName}</td>
              <td>{c.designerId?.name}</td>
              <td>{c.description}</td>
              <td>{new Date(c.date).toDateString()}</td>
              <td>
                <button onClick={() => { setEditing(c); setShowForm(true); }}>✏️</button>
                <button onClick={() => handleDelete(c._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="floating-btn" onClick={() => setShowForm(true)}>➕ Add Complaint</button>
    </div>
    </div>
  );
};

export default ComplaintList;