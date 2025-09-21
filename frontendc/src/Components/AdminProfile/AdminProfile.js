import React, { useEffect, useState } from 'react'
import axios from "axios";
import AdminNav from '../AdminNav/AdminNav'
import AdminProfileDisplay from "../AdminProfileDisplay/AdminProfileDisplay"
const URL = "http://localhost:5000/users";


const fetchHandler = async () =>{
    return await axios.get(URL).then((res) => res.data);
}

function AdminProfile() {
    const [users, setUsers] = useState();
      useEffect(() => {
        fetchHandler().then((data) => setUsers(data.users));
      }, [])
  return (
    <div>
        <AdminNav/>
        <h1>My Profile</h1>
       
      <div>
        {users && users.map((user, i) => (
            <div key={i}>
            <AdminProfileDisplay user={user}/>
            </div>
        ))}
      </div>
      
    </div>
  )
}

export default AdminProfile
