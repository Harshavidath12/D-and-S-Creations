import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Nav/Nav';
import axios from "axios";
import User from '../User/User';
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import "./Users.css"; //Import the CSS file

const URL = "http://localhost:5000/bookings";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  const [users, setUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, [location]);

  const ComponentsRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    documentTitle: "Users Report",
    onAfterPrint: () => alert("User report successfully downloaded"),
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [noResults, setNoResults] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredUsers = data.users.filter((user) =>
        Object.values(user).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setUsers(filteredUsers);
      setNoResults(filteredUsers.length === 0);
    });
  };

  const handleSendReport = () => {
    const phoneNumber = "+94706625728";
    const message = `Selected User Reports`;
    const WhatsAppUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(WhatsAppUrl, "_blank");
  };

  return (
    <div className="users-container">
      <Nav />
      <h1 className="page-title">User Details Display Page</h1>

      {/* Search bar */}
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

      {noResults ? (
        <div className="no-results">No Users Found</div>
      ) : (
        <div ref={ComponentsRef} className="users-list">
          {users && users.map((user, i) => (
            <div key={i} className="user-card">
              <User user={user} />
            </div>
          ))}
        </div>
      )}

      {/* Action buttons */}
      <div className="button-group">
        <button onClick={handlePrint} className="btn btn-green">
          Download PDF
        </button>
        <button onClick={handleSendReport} className="btn btn-darkgreen">
          Send WhatsApp Message
        </button>
      </div>
    </div>
  );
}

export default Users;
