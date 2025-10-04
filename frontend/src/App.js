// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./Components/Navbar";
import DesignerList from "./Components/DesignerList";
import ComplaintList from "./Components/ComplaintList";
import ClientDesignerList from "./Components/ClientDesignerList";
import "./style.css";

// Chenul’s components
import Register from "./Components/Register/Register";
import AdminProfile from "./Components/AdminProfile/AdminProfile";
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
import FilmHallOwnerDash from "./Components/FilmHallOwnerDash/FilmHallOwnerDash";
import AdminDash from "./Components/AdminDash/AdminDash";
import PendingUsers from "./Components/PendingUsers/PendingUsers";
import Roll from "./Components/PendingUsers/Roll";
import SetLogin from "./Components/SetLogin/SetLogin";

// Optional components, only if implemented
import AddUser from "./Components/AddUser/AddUser";
import Users from "./Components/UserDetails/Users";
import UpdateUser from "./Components/UpdateUser/UpdateUser";
import LedBoard from "./Components/LedBoard/LedBoard";
import PricingManager from "./Components/PricingManager/PricingManager";
import Payment from "./Components/Payment/Payment";
import InventoryManager from "./Components/Inventory/InventoryManager";

function App() {
  const mockDesigners = [
    {
      id: 1,
      name: "Alice Johnson",
      type: "Video Editing",
      qualifications: "BFA in Film and Media, 5 years experience",
      profileImage: "/images/designer1.jpeg",
    },
    {
      id: 2,
      name: "Bob Smith",
      type: "Image Editing",
      qualifications: "Certified Photoshop Expert, 7 years experience",
      profileImage: "/images/designer2.jpeg",
    },
    {
      id: 3,
      name: "David Kim",
      type: "Video Editing",
      qualifications: "Film School Graduate, 3 years experience",
      profileImage: "/images/designer3.jpeg",
    },
    {
      id: 4,
      name: "Rithika Patel",
      type: "Image Editing",
      qualifications: "Creative Director, 6 years experience",
      profileImage: "/images/designer4.jpeg",
    },
    {
      id: 5,
      name: "Jone Maxwell",
      type: "Video Editing",
      qualifications: "Film Director, 2 years experience",
      profileImage: "/images/designer5.jpeg",
    },
    {
      id: 6,
      name: "Catherine Lee",
      type: "Image Editing",
      qualifications: "Creative Director, 3 years experience",
      profileImage: "/images/designer6.jpeg",
    },
  ];

  // Home Component
  function Home() {
    return (
      <div className="home-container">
        <header className="home-header">
          <h1>Welcome to Our Advertising Agency</h1>
          <h3>
            Grow your brand with impactful advertising solutions! We connect your
            business with creative designers and expert marketing strategies.
          </h3>
          <img
            src="/images/dashboard-banner.jpeg"
            alt="Dashboard Banner"
            className="home-banner"
          />
        </header>

        <section className="agency-section">
          <h2>Who Chooses Our Agency?</h2>
          <p>
            Our clients range from startups to established brands who want to
            amplify their reach, create stunning visuals, and connect with their
            audience effectively.
          </p>
        </section>

        <section className="selection-section">
          <h2>How We Select Designers</h2>
          <p>
            We carefully vet designers based on portfolio quality, creativity, and
            experience. Only designers who demonstrate excellence in video or image
            editing and align with our agency standards are invited to join our
            team.
          </p>
        </section>

        <section className="designers-section">
          <h2>Head of our Designers</h2>
          <div className="designer-cards-container">
            {mockDesigners.map((designer) => (
              <div key={designer.id} className="designer-card">
                <img
                  src={designer.profileImage}
                  alt={designer.name}
                  className="designer-image"
                />
                <h3>{designer.name}</h3>
                <p>
                  <strong>Type:</strong> {designer.type}
                </p>
                <p>
                  <strong>Qualifications:</strong> {designer.qualifications}
                </p>
              </div>
            ))}
          </div>
          <div className="get-started-container">
            <Link to="/designers" className="get-started-button">
              Get Started
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* User Management */}
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/userdetails" element={<Users />} />
        <Route path="/userdetails/:id" element={<UpdateUser />} />
        <Route path="/users/:id" element={<UpdateUser />} />

        {/* Dashboard / Inventory / Pricing */}
        <Route path="/ledboard" element={<LedBoard />} />
        <Route path="/pricing-manager" element={<PricingManager />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/inventory-manager" element={<InventoryManager />} />

        {/* Chenul's Components */}
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

        {/* Other Pages */}
        <Route path="/designers" element={<DesignerList />} />
        <Route path="/complaints" element={<ComplaintList />} />
        <Route path="/client-designers" element={<ClientDesignerList />} />
      </Routes>
    </Router>
  );
}

export default App;
