import React, { useState, useEffect } from "react";
import axios from "axios";
import LedNav2 from "./LedNav2";
import LedFormDashDisplay from "../LedFormDashDisplay/LedFormDashDisplay";

function LedFormDash() {
  const [ledBoard, setLedBoard] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const ownerId = localStorage.getItem("ownerId");
      if (!ownerId) return;

      try {
        const res = await axios.get(`http://localhost:5000/ledboards/ownerId/${ownerId}`);
        console.log("API returned:", res.data);
        setLedBoard(res.data.ledBoard);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div>
      <LedNav2 />
      <div>
        {ledBoard ? (
          <LedFormDashDisplay ledBoard={ledBoard} className="profile-container" />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default LedFormDash;
