import React, { useState, useEffect } from "react";
import Nav4 from "../Nav/Nav4";
import axios from "axios";
import User from "../User/User";
import { useLocation, useNavigate } from "react-router-dom";
import "./Users.css";
import { downloadUsersPDF } from "../../api"; // ✅ correct


const URL = "http://localhost:5000/bookings";

// Fetch all bookings (users)
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Fetch users whenever location changes
  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, [location]);

  // 🔍 Handle search
  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredUsers = data.users.filter((user) =>
        Object.values(user).some((field) =>
          field?.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setUsers(filteredUsers);
      setNoResults(filteredUsers.length === 0);
    });
  };

  // ✅ Handle backend PDF download (same logic as ComplaintList.js)
  const handleDownload = async () => {
    try {
      const res = await downloadUsersPDF(); // Call backend API
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users_report.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("PDF download failed:", err);
      alert("Failed to download PDF. Please try again.");
    }
  };

  // 📤 Send report via WhatsApp
  const handleSendReport = () => {
    const phoneNumber = "+94706625728";
    const message = `Selected User Reports`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(WhatsAppUrl, "_blank");
  };

  // ⚙️ Navigate to pricing manager
  const handleEditPrice = () => {
    navigate("/pricing-manager");
  };

  return (
    <div className="users-container">
      <h1 className="page-title">User Details Display Page</h1>
      <Nav4 />

      {/* 🔝 Top bar with search + edit price */}
      <div className="top-bar">
        <div className="search-section">
          <input
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            name="search"
            placeholder="Search Users"
            className="search-input"
          />
          <button onClick={handleSearch} className="btn btn-blue">
            Search
          </button>
        </div>
        <button onClick={handleEditPrice} className="edit-price-btn">
          Edit Price
        </button>
      </div>

      {/* 🧾 Display users or “no results” message */}
      {noResults ? (
        <div className="no-results">No Users Found</div>
      ) : (
        <div className="users-list">
          {users &&
            users.map((user, i) => (
              <div key={i} className="user-card">
                <User user={user} />
              </div>
            ))}
        </div>
      )}

      {/* 📁 Action buttons */}
      <div className="button-group">
        <button onClick={handleDownload} className="btn btn-green">
          ⬇ Download PDF
        </button>
        <button onClick={handleSendReport} className="btn btn-darkgreen">
          Send WhatsApp Message
        </button>
      </div>
    </div>
  );
}

export default Users;
