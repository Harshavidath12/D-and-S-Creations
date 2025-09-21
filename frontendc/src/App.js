
import './App.css';
import { Routes, Route } from "react-router-dom";
import PendingUsers from './Components/PendingUsers/PendingUsers';
import Register from "./Components/Register/Register";
import Home from "./Components/Home/Home"
import AdminDash from "./Components/AdminDash/AdminDash"
import AdminProfile from "./Components/AdminProfile/AdminProfile"

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />} />    {/*Default route*/}
        <Route path="/Register" element={<Register />} />
        <Route path="/AdminDash" element={<AdminDash />} />
        <Route path="/PendingUsers" element={<PendingUsers />} />
        <Route path="/AdminProfile" element={<AdminProfile />} />
      </Routes>
  );
}

export default App;
