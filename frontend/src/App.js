import React from "react";
import {Route, Routes} from "react-router";
import './App.css';
import Home from "./Components/Home/Home";
import User from "./Components/User/User";
import Users from "./Components/UserDetails/Users";
import AddUser from "./Components/AddUser/AddUser";
import UpdateUser from "./Components/UpdateUser/UpdateUser";
import LedBoard from "./Components/LedBoard/LedBoard";
import PricingManager from "./Components/PricingManager/PricingManager";
import Payment from "./Components/Payment/Payment";
import InventoryManager from "./Components/Inventory/InventoryManager";

// Chenul’s components
import Register from "./Components/Register/Register";
import AdminProfile from "./Components/AdminProfile/AdminProfile";
import UpdateAdmin from './Components/UpdateAdmin/UpdateAdmin';
import Login from './Components/Login/Login';
import Client from './Components/PendingUsers/Client';
import LedBoardOwners from './Components/PendingUsers/LedBoardOwners';
import Designer from './Components/PendingUsers/Designer';
import FilmhallOwners from './Components/PendingUsers/FilmhallOwners';
import Admin from './Components/PendingUsers/Admin';
import DesignerDash from './Components/DesignerDash/DesignerDash';
import LedBoardOwnerDash from './Components/LedBoardOwnerDash/LedBoardOwnerDash';
import ClientDash from './Components/ClientDash/ClientDash';
import FilmHallOwnerDash from './Components/FilmHallOwnerDash/FilmHallOwnerDash';
import AdminDash from './Components/AdminDash/AdminDash';
import PendingUsers from './Components/PendingUsers/PendingUsers';
import Roll from './Components/PendingUsers/Roll';
import SetLogin from './Components/SetLogin/SetLogin';

function App() {

  return (
    <div>

     <React.Fragment>
      <Routes>
        <Route path="/" element={<Home/>}/>  
       <Route path="/mainhome" element={<Home/>}/>
       

       <Route path="/adduser" element={<AddUser/>}/>
       <Route path="/userdetails" element={<Users/>}/>
        <Route path="/userdetails/:id" element={<UpdateUser/>}/>
       <Route path="/users/:id" element={<UpdateUser/>}/> 
          <Route path="/ledboard" element={<LedBoard/>} />
         <Route path="/pricing-manager" element={<PricingManager />} />
         <Route path="/payment" element={<Payment />} />
         <Route path="/inventory-manager" element={<InventoryManager />} />

         <Route path="/Register" element={<Register />} />
   
      <Route path="/PendingUsers" element={<PendingUsers />} />
      <Route path="/AdminProfile" element={<AdminProfile />} />
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
      <Route path="/FilmHallOwnerDash" element={<FilmHallOwnerDash />} />
      <Route path="/AdminDash" element={<AdminDash />} />
      </Routes>
     </React.Fragment>
    </div>
  );
}

export default App;