import React, { useEffect, useState } from 'react'
import axios from "axios";
import AdminNav from '../AdminNav/AdminNav'
import PendingUsersDisplay from "../PendingUsersDisplay/PendingUsersDisplay"
const URL = "http://localhost:5000/users";

const fetchHandler = async () =>{
    return await axios.get(URL).then((res) => res.data);
}

function PendingUsers() {
  const [users, setUsers] = useState();
  useEffect(() => {
    fetchHandler().then((data) => setUsers(data.users));
  }, [])
  return (
    <div>
      <AdminNav/>
      <h1>Users List</h1>
      <div>
        {users && users.map((user, i) => (
            <div key={i}>
            <PendingUsersDisplay user={user}/>
            </div>
        ))}
      </div>
    </div>
  )
}

export default PendingUsers
