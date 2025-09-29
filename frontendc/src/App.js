
import './App.css';
import { Routes, Route } from "react-router-dom";
import PendingUsers from './Components/PendingUsers/PendingUsers';
import Register from "./Components/Register/Register";
import Home from "./Components/Home/Home"
import AdminDash from "./Components/AdminDash/AdminDash"
import AdminProfile from "./Components/AdminProfile/AdminProfile"
import UpdateAdmin from './Components/UpdateAdmin/UpdateAdmin';
import SetLogin from './Components/SetLogin/SetLogin';
import Roll from './Components/PendingUsers/Roll';
import Login from './Components/Login/Login';
import Client from './Components/PendingUsers/Client';
import LedBoardOwners from './Components/PendingUsers/LedBoardOwners';
import Designer from './Components/PendingUsers/Designer';
import FilmhallOwners from './Components/PendingUsers/FilmhallOwners';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />    {/*Default route*/}
        <Route path="/Register" element={<Register />} />
        <Route path="/AdminDash" element={<AdminDash />} />
        <Route path="/PendingUsers" element={<PendingUsers />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
        <Route path="/PendingUsers/:id" element={<UpdateAdmin />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Roll" element={<Roll />} />
        <Route path="/SetLogin" element={<SetLogin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Client" element={<Client />} />
        <Route path="/LedBoardOwners" element={<LedBoardOwners />} />
        <Route path="/Designer" element={<Designer />} />
        <Route path="/FilmhallOwners" element={<FilmhallOwners />} />

      </Routes>
  );
}

export default App;
