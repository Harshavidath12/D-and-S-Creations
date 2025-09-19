import React, { useState, useEffect, useRef } from 'react';
import Nav from '../Nav/Nav';
import axios from "axios";
import User from '../User/User';
import { useLocation } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5000/users";

const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data);
};

function Users() {
  const [users, setUsers] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, [location]); // ✅ fixed 'Location' typo

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

  const handleSendReport=()=>{
    //Creare the whatsapp chat URL
    const phoneNumber="+94706625728";
    const message=`selected User Reprts`
    const WhatsAppUrl=`https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    //open the whatsapp chat in new window 
    window.open(WhatsAppUrl,"_blank");
  }

  return (
    <div>
      <Nav />
      <h1>User Details Display Page</h1>
      
      <input //search function
        onChange={(e) => setSearchQuery(e.target.value)}
        type="text"
        name="search"
        placeholder="Search Users"
      />
      <button onClick={handleSearch}>Search</button>

      {noResults ? (
        <div>
          <p>No Users Found</p>
        </div>
      ) : (
        <div>
          <div ref={ComponentsRef}>
            {users && users.map((user, i) => (
              <div key={i}>
                <User user={user} />
              </div>
            ))}
          </div>
          <br />
        </div>
      )}

      <button onClick={handlePrint}>Download</button>
      <br></br>
      <button onClick={handleSendReport}>Send Whatsapp Message</button>
    </div>
  );
}

export default Users;
