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
      </Routes>
     </React.Fragment>
    </div>
  );
}

export default App;

