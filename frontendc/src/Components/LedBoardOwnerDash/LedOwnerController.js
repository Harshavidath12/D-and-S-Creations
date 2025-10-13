import React, { useEffect, useState } from "react";
import axios from "axios";
import LedFormDash from "../LedBoardOwnerDash/LedFormDash";
import LedBoardOwnerDash from "../LedBoardOwnerDash/LedBoardOwnerDash";

function LedOwnerController() {
  const [hasData, setHasData] = useState(null); // null = loading, true = has data, false = no data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLedData = async () => {
      const ownerId = localStorage.getItem("ownerId");
      if (!ownerId) {
        setHasData(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`http://localhost:5000/ledboards/ownerId/${ownerId}`);
        if (res.data && res.data.ledBoard) {
          setHasData(true);
        } else {
          setHasData(false);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setHasData(false);
        } else {
          console.error("Error checking LED data:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    checkLedData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return hasData ? <LedFormDash /> : <LedBoardOwnerDash />;
}

export default LedOwnerController;
