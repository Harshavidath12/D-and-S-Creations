import React, { useEffect, useState, useRef } from 'react';
import axios from "axios";
import AdminNav from '../AdminNav/AdminNav';
import './PendingUsers.css'
import PendingUsersDisplay from "../PendingUsersDisplay/PendingUsersDisplay";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5000/users";

const fetchHandler = async () =>{
    return await axios.get(URL).then((res) => res.data);
}

function PendingUsers() {
  const [users, setUsers] = useState();
  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, [])

  //download
  const ComponentsRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => ComponentsRef.current,
    DocumentTitle: "Users Report",
    onafterprint: () => alert("User Report Successfully Downloaded!"),
  });

  //search
  const [searchQuery, setSearchQuery] = useState("");
  const [noResult, setNoResult] = useState(false);

  const handleSearch = () => {
    fetchHandler().then((data) => {
      const filteredUsers = data.users.filter((user) =>
      Object.values(user).some((field) =>
      field.toString().toLowerCase().includes(searchQuery.toLowerCase())
    ))
    setUsers(filteredUsers);
    setNoResult(filteredUsers.length === 0);
    })
  }

  return (
        <div className="fro">
          <AdminNav/>
        <h1>Pending Users List</h1>
        <div className='cent'>
        {/* Search Bar */}
        <input onChange={(e) => setSearchQuery(e.target.value)} 
        type = "text" name='search' placeholder='Search Users Details' className="Search"></input>
        <button onClick={handleSearch} className="Searchbutton">Search</button>
        <br/><br/>
        </div>
        {noResult ? (
          <div>
            <p>No User Found...</p>
          </div>
        ): (

        <div ref={ComponentsRef} className="userlist">
          {users && users
            .filter(user => user.status === "Pending")
            .map((user, i) => (
              <div key={i}>
                <PendingUsersDisplay user={user}/>
              </div>
          ))}
        </div>
        )}
        <button onClick={handlePrint} className="pdfbutton">Download Report</button>
      </div>
  )
}

export default PendingUsers
