import React from 'react'

function AdminProfileDisplay(props) {
 const {_id, username, email, phonenumber, whoareyou, gender, birthday, status} = props.user;
  return (
    <div>
      <h3>Id:{_id}</h3>
      <h3>User Name:{username}</h3>
      <h3>E-Maile:{email}</h3>
      <h3>Phone Number:{phonenumber}</h3>
      <h3>Who Are You:{whoareyou}</h3>
      <h3>Gender:{gender}</h3>
      <h3>Birthday:{birthday}</h3>
      <h3>Status:{status}</h3>
      <button>Accept</button>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <button>Reject</button>
      <br/><br/><br/>
    </div>
  )
}

export default AdminProfileDisplay
