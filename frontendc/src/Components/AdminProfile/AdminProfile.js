import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminNav from "../AdminNav/AdminNav";
import "./AdminProfile.css";

import AdminProfileDisplay from "../AdminProfileDisplay/AdminProfileDisplay";

function AdminProfile() {
  const [user, setUser] = useState();

  useEffect(() => {
  const fetchUser = async () => {
    const username = localStorage.getItem("username");
    if (!username) return;

    try {
      const res = await axios.get(`http://localhost:5000/users/username/${username}`);
      console.log("API returned:", res.data);  // <--- add this
      setUser(res.data.user);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  fetchUser();
}, []);

  return (
    <div>
      <AdminNav />
      <div>
        {user && <AdminProfileDisplay user={user} className="profile-container"/>}
      </div>
    </div>
  );
}

export default AdminProfile;
