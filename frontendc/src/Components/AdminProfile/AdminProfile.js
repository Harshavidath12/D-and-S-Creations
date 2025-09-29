import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminProfile.css";
import AdminNav from "../AdminNav/AdminNav";
import AdminProfileDisplay from "../AdminProfileDisplay/AdminProfileDisplay";

function AdminProfile() {
  const [user, setUser] = useState();

  useEffect(() => {
    axios
      .get("http://localhost:5000/users/68d45316d8aaac622bf0de65") // fixed id
      .then((res) => {
        setUser(res.data.users);
      })
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
