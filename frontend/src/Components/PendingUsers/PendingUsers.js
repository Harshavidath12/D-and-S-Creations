import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import AdminNav from '../AdminNav/AdminNav';
import './PendingUsers.css';
import PendingUsersDisplay from "../PendingUsersDisplay/PendingUsersDisplay";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function PendingUsers() {
  const [users, setUsers] = useState();
  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, []);

  // download pdf
  const contentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    documentTitle: "Users Pending Report",
    onAfterPrint: () => alert("User Report Successfully Downloaded!"),
  });

  // search
  const [searchQuery, setSearchQuery] = useState("");
  const [noResult, setNoResult] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredUsers = data.users.filter((user) =>
        Object.values(user).some((field) =>
          field.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
      setUsers(filteredUsers);
      setNoResult(filteredUsers.length === 0);
    });
  };

  return (
    <div className="pending-users-container">
      <AdminNav />
      <h1 className="pending-users-title">Pending Users List</h1>

      <div className="pending-users-actions">
        {/* Search Bar */}
        <input
          onChange={(e) => setSearchQuery(e.target.value)}
          type="text"
          name="search"
          placeholder="Search Users Details"
          className="pending-users-search"
        />
        <button onClick={handleSearch} className="pending-users-search-button">
          Search
        </button>
      </div>

      {noResult ? (
        <div>
          <p className="pending-users-message">No User Found...</p>
        </div>
      ) : (
        <div ref={contentRef} className="pending-users-list">
          {users &&
            users
              .filter((user) => user.status === "Pending")
              .map((user, i) => (
                <div key={i}>
                  <PendingUsersDisplay user={user} />
                </div>
              ))}
        </div>
      )}

      <button onClick={handlePrint} className="pending-users-pdf-button">
        Download Report
      </button>
    </div>
  );
}

export default PendingUsers;
