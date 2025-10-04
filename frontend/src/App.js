
import './App.css';
import { Routes, Route } from "react-router-dom";
import PendingUsers from './Components/PendingUsers/PendingUsers';
import Register from "./Components/Register/Register";
import Home from "./Components/Home/Home";
import AdminProfile from "./Components/AdminProfile/AdminProfile";
import UpdateAdmin from './Components/UpdateAdmin/UpdateAdmin';
import SetLogin from './Components/SetLogin/SetLogin';
import Roll from './Components/PendingUsers/Roll';
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



function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />    {/*Default route*/}
        <Route path="/Register" element={<Register />} />
        <Route path="/PendingUsers" element={<PendingUsers />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
        <Route path="/PendingUsers/:id" element={<UpdateAdmin />} />
        <Route path="/LedBoardOwners/:id" element={<UpdateAdmin />} />
        <Route path="/FilmhallOwners/:id" element={<UpdateAdmin />} />
        <Route path="/Client/:id" element={<UpdateAdmin />} />
        <Route path="/Designer/:id" element={<UpdateAdmin />} />
        <Route path="/Admin/:id" element={<UpdateAdmin />} />
        <Route path="/Home" element={<Home />} />
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
  );
}

export default App;
