import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import DesignerList from "./components/DesignerList";
import ComplaintList from "./components/ComplaintList";
import ClientDesignerList from "./components/ClientDesignerList"; // ✅ new import
import "./style.css";

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

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to Our Advertising Agency</h1>
        <h3>
          Grow your brand with impactful advertising solutions! We connect
          your business with creative designers and expert marketing strategies
          to deliver maximum impact.
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
          audience effectively. We prioritize creativity, quality, and measurable
          results.
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

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar /> {/* left sidebar */}
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/designers" element={<DesignerList />} />
            <Route path="/complaints" element={<ComplaintList />} />
            <Route path="/client-designers" element={<ClientDesignerList />} /> {/* ✅ new route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
