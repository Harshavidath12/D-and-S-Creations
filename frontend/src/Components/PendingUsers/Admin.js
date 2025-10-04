import React, { useEffect, useState } from 'react';
import axios from "axios";
import AdminNav from '../AdminNav/AdminNav';
import './PendingUsers.css'
import JobRollNav from './JobRollNav'
import PendingUsersDisplay from "../PendingUsersDisplay/PendingUsersDisplay";


const URL = "http://localhost:5000/users";

const fetchHandler = async () =>{
    return await axios.get(URL).then((res) => res.data);
}

function Admin() {
    const [users, setUsers] = useState();
    useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
    }, [])

  return (
    <div className="fro">
          <AdminNav/>
          <br />
          <JobRollNav/>
        <h1>Admin List</h1>
        <div className="userlist">
          {users && users
            .filter(user => user.whoareyou === "Admin" && user.status === "Active")
            .map((user, i) => (
              <div key={i}>
                <PendingUsersDisplay user={user}/>
              </div>
          ))}
        </div>
      </div>
  )
}

export default Admin
