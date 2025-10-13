import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./Components/Home/Home";
import AfterHome from "./Components/Home/AfterHome";
import User from "./Components/User/User";
import Users from "./Components/UserDetails/Users";
import AddUser from "./Components/AddUser/AddUser";
import UpdateUser from "./Components/UpdateUser/UpdateUser";
import LedBoard from "./Components/LedBoard/LedBoard";
import LedBoard2 from "./Components/LedBoard/LedBoard2";
import PricingManager from "./Components/PricingManager/PricingManager";
import Payment from "./Components/Payment/Payment";
import InventoryManager from "./Components/Inventory/InventoryManager";



//import {Route, Routes} from "react-router";

//import Nav from "./Components/Nav/Nav";

import MyReservations from "./Components/MyReservations/MyReservations";
import MyReservations2 from "./Components/MyReservations/MyReservations2";
import NewReservation from "./Components/NewReservation/NewReservation";
import NewReservation2 from "./Components/NewReservation/NewReservation2";
import CinemaManagement from "./Components/CinemaManagement/CinemaManagement";

// Chenul’s components
import Register from "./Components/Register/Register";
import AdminProfile from "./Components/AdminProfile/AdminProfile";
import AdminProfile2 from "./Components/AdminProfile/AdminProfile2";
import AdminProfile3 from "./Components/AdminProfile/AdminProfile3";
import AdminProfile4 from "./Components/AdminProfile/AdminProfile4";
import UpdateAdmin from "./Components/UpdateAdmin/UpdateAdmin";
import Login from "./Components/Login/Login";
import Client from "./Components/PendingUsers/Client";
import LedBoardOwners from "./Components/PendingUsers/LedBoardOwners";
import Designer from "./Components/PendingUsers/Designer";
import FilmhallOwners from "./Components/PendingUsers/FilmhallOwners";
import Admin from "./Components/PendingUsers/Admin";
import DesignerDash from "./Components/DesignerDash/DesignerDash";
import LedBoardOwnerDash from "./Components/LedBoardOwnerDash/LedBoardOwnerDash";
import ClientDash from "./Components/ClientDash/ClientDash";
import AdminDash from "./Components/AdminDash/AdminDash";
import PendingUsers from "./Components/PendingUsers/PendingUsers";
import Roll from "./Components/PendingUsers/Roll";
import SetLogin from "./Components/SetLogin/SetLogin";
import PaymentChirath from "./Components/Payment/PaymentChirath";
import DesignerBackend from "./Components/DesignerBackend"

// Rashali’s components
import DesignerList from "./Components/DesignerList";
import ComplaintList from "./Components/ComplaintList";
import ClientDesignerList from "./Components/ClientDesignerList";
import "./style.css";
import ClientDesignerList2 from "./Components/ClientDesignerList2";
import ComplaintList2 from "./Components/ComplaintList2";
import AdminProfile5 from "./Components/AdminProfile/AdminProfile5";
import AdminProfile6 from "./Components/AdminProfile/AdminProfile6";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />
        <Route path="/mainhome" element={<Home />} />
        <Route path="/AfterHome" element={<AfterHome />} />

        {/* User Management */}
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/userdetails" element={<Users />} />
        <Route path="/userdetails/:id" element={<UpdateUser />} />
        <Route path="/users/:id" element={<UpdateUser />} />

        {/* Dashboard / Inventory / Pricing */}
        <Route path="/ledboard" element={<LedBoard />} />
        <Route path="/ledboard2" element={<LedBoard2 />} />
        <Route path="/pricing-manager" element={<PricingManager />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/PaymentChirath" element={<PaymentChirath />} />
        <Route path="/inventory-manager" element={<InventoryManager />} />
        
       


        {/* Chenul's Components */}
        <Route path="/Register" element={<Register />} />
        <Route path="/PendingUsers" element={<PendingUsers />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
        <Route path="/AdminProfile2" element={<AdminProfile2 />} />
        <Route path="/AdminProfile3" element={<AdminProfile3 />} />
        <Route path="/AdminProfile4" element={<AdminProfile4 />} />
        <Route path="/AdminProfile5" element={<AdminProfile5 />} />
        <Route path="/PendingUsers/:id" element={<UpdateAdmin />} />
        <Route path="/LedBoardOwners/:id" element={<UpdateAdmin />} />
        <Route path="/FilmhallOwners/:id" element={<UpdateAdmin />} />
        <Route path="/Client/:id" element={<UpdateAdmin />} />
        <Route path="/Designer/:id" element={<UpdateAdmin />} />
        <Route path="/Admin/:id" element={<UpdateAdmin />} />

        <Route path="/Roll" element={<Roll />} />
        <Route path="/SetLogin" element={<SetLogin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Client" element={<Client />} />
        <Route path="/LedBoardOwners" element={<LedBoardOwners />} />
        <Route path="/Designer" element={<Designer />} />
        <Route path="/FilmhallOwners" element={<FilmhallOwners />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/DesignerDash" element={<DesignerDash />} />
        <Route path="/LedBoardOwnerDash" element={<LedBoardOwnerDash />} />
        <Route path="/ClientDash" element={<ClientDash />} />

        <Route path="/AdminDash" element={<AdminDash />} />

        {/* Other Pages */}
        <Route path="/designers" element={<DesignerList />} />
        <Route path="/complaints" element={<ComplaintList />} />
        <Route path="/complaints2" element={<ComplaintList2 />} />
        <Route path="/client-designers" element={<ClientDesignerList />} />
        <Route path="/client-designers2" element={<ClientDesignerList2 />} />

        <Route path="/mainhome" element={<Home/>}/>
        <Route path="/my-reservations" element={<MyReservations/>}/>
        <Route path="/my-reservations2" element={<MyReservations2/>}/>
        <Route path="/new-reservation" element={<NewReservation/>}/>
        <Route path="/new-reservation2" element={<NewReservation2/>}/>
        <Route path="/cinema-management" element={<CinemaManagement/>}/>
        <Route path="/DesignerBackend" element={<DesignerBackend/>}/>
        <Route path="/AdminProfile6" element={<AdminProfile6/>}/>
      </Routes>
    </Router>

  );
}

export default App;