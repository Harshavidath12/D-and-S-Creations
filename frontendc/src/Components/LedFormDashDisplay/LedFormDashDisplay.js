import React from "react";
import "../AdminProfile/AdminProfile.css"



function LedFormDashDisplay(props) {
    const {ownerId, outDoor, inDoor, p3, p6} = props.ledBoard;


  return (
      <div>
        <h1>My Boards</h1>

          <div>
            <h2>Owner ID: {ownerId}</h2>

            <label>Out Door Boards</label>
            <h3>{outDoor}</h3>

            <label>In Door Boards</label>
            <h3>{inDoor}</h3>

            <label>P3 Boards</label>
            <h3>{p3}</h3>

            <label>P6 Boards</label>
            <h3>{p6}</h3>

            <button>Edit Profile</button>
          </div>
      </div>
  )
}

export default LedFormDashDisplay

    