import React from "react";
import {Route, Routes} from "react-router";
import './App.css';
import Nav from "./Components/Nav/Nav";
import Home from "./Components/Home/Home";
import MyReservations from "./Components/MyReservations/MyReservations";
import NewReservation from "./Components/NewReservation/NewReservation";
import CinemaManagement from "./Components/CinemaManagement/CinemaManagement";

function App() {
  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Home/>}/>  
        <Route path="/mainhome" element={<Home/>}/>
        <Route path="/my-reservations" element={<MyReservations/>}/>
        <Route path="/new-reservation" element={<NewReservation/>}/>
        <Route path="/cinema-management" element={<CinemaManagement/>}/>
      </Routes>
    </div>
  );
}

export default App;

