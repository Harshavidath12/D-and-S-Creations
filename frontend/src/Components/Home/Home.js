import React from "react";
import Nav from "../Nav/Nav";
import "./Home.css"; // import css file
import AnimatedHero from "./AnimatedHero"; // import new animated hero
import { Link } from "react-router-dom";


function Home() {
  return (
    <div>
      {/* Navbar */}
      <Nav />

      {/* New Animated Hero Section */}
      <AnimatedHero />

      {/* Cinema Hall Advertising Section */}
      <section className="section" id="this">
        <h2>Cinema Hall Advertising</h2>
        <div className="section-content">
          <img src="/images/cinema.jpg" alt="Cinema Advertising" />
          <p>
            Capture your audience's attention on the big screen! With cinema
            hall advertising, your brand message is showcased to thousands of
            viewers in a distraction-free environment. Perfect for impactful
            storytelling and mass reach.
          </p>
        </div>
      </section>

      {/* LED Board Advertising Section */}
      <section className="section alt-bg">
        <h2>LED Board Advertising</h2>
        <div className="section-content reverse">
          <p>
            Light up your brand with <b>LED Board Advertising</b>! Placed in
            high-traffic areas, LED boards make sure your message shines 24/7.
            From busy streets to shopping malls, we help your brand stay visible
            and memorable.
          </p>
          <img src="/images/led.jpg" alt="LED Advertising" />
        </div>
      </section>

      {/* Services Overview */}
      <section className="services">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Cinema Ads</h3>
            <p>
              Showcase your brand on the big screen with maximum impact and
              visibility.
            </p>
          </div>
          <div className="service-card">
            <h3>LED Boards</h3>
            <p>
              Bright and eye-catching LED boards that ensure your brand stands
              out day and night.
            </p>
          </div>
          <div className="service-card">
            <h3>Custom Campaigns</h3>
            <p>
              Tailored marketing strategies to maximize reach and brand
              engagement.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} D&S Creations. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;