import React from "react";
import { Link } from "react-router-dom"; 
import "./homepage.css";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function HomePage() {

  // Ensure it matches your ProtectedRoute variables perfectly:
const savedToken = localStorage.getItem("authToken");
const savedRole = localStorage.getItem("userRole");

  return (
    <main className="homepage">
      <div className="homepage-container">
        <Navbar/>

        {/* Hero Section */}
        <section className="homepage-hero">
          <div className="homepage-hero-grid">
            <div className="homepage-hero-content">
              <span className="hero-tagline">HEALTH LITERACY, NOT ADVERTISING</span>
              <h1 className="homepage-hero-title">
                Know exactly what you are putting in and on your body.
              </h1>
              <p className="homepage-hero-description">
                We explain menstrual and reproductive health products — pads, tampons, cups, 
                the pill, IUDs — with balanced benefits, risks, and real costs. When you need a 
                professional, we connect you to gynaecologists who publish their fees.
              </p>
              
             
              <div className="hero-actions">
                <Link to="/products" className="hero-btn-primary">Explore products →</Link>
                {/* Updated to match your App router layout path */}
                <Link to="/doctor-dashboard" className="hero-btn-secondary">Find a gynaecologist</Link>
              </div>

           
              <div className="hero-stats">
                <div className="stat-item">
                  <span className="stat-number">12</span>
                  <span className="stat-label">products explained</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">6</span>
                  <span className="stat-label">care categories</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">24/7</span>
                  <span className="stat-label">assistant access</span>
                </div>
              </div>
            </div>

            <div className="homepage-hero-visual">
              <img 
                src="/api/placeholder/500/480" 
                alt="Menstrual products and wellness flatlay" 
                className="hero-main-image"
              />
            </div>
          </div>
        </section>

        <div className="homepage-divider" />

        {/* Features Section */}
        <section className="homepage-features">
          <span className="features-tagline">WHAT YOU CAN DO HERE</span>
          <h2 className="features-heading">Two ways Vitalis helps you decide</h2>
          
          <div className="features-grid">
            <Link to="/doctor-dashboard" className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 448 512">
                  <path d="M0 0h448v512H0z" fill="none" />
                  <path fill="currentColor" d="M224 256a128 128 0 1 0 0-256a128 128 0 1 0 0 256m-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512h388.6c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16s7.2-16 16-16v-24c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16h-16c-8.8 0-16-7.2-16-16v-40c0-29.8 20.4-54.9 48-62v-57.1q-9-.9-18.3-.9h-91.4q-9.3 0-18.3.9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7zM144 448a24 24 0 1 0 0-48a24 24 0 1 0 0 48" />
                </svg>
              </div>
              <h3 className="feature-title">Reach an affordable doctor</h3>
              <p className="feature-desc">
                A directory of gynaecologists with published fees. Send a consultation request by email straight from the listing.
              </p>
              <span className="feature-link-text">Find a doctor →</span>
            </Link>

            {/* Path updated to match your router's "/ask-her" path */}
            <Link to="/ask-her" className="feature-card">
              <div className="feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2 6s1.5-2 5-2s5 2 5 2v14s-1.5-1-5-1s-5 1-5 1zm10 0s1.5-2 5-2s5 2 5 2v14s-1.5-1-5-1s-5 1-5 1z" />
                </svg>
              </div>
              <h3 className="feature-title">Ask anything, privately</h3>
              <p className="feature-desc">
                Vitalis Assist answers questions about products, cycles and symptoms in plain language, any hour of the day.
              </p>
              <span className="feature-link-text">Ask a question →</span>
            </Link>
          </div>
        </section>

        <div className="homepage-divider" />

        {/* Action Hub & Main Dynamic Layout Links */}
        <section className="homepage-action-hub">
          <div className="homepage-welcome-circle">
            <h2 className="homepage-welcome-title">Welcome Hub</h2>
            <p className="homepage-welcome-text">
              Log your last period and we tell you the next
            </p>
          </div>

          <div className="homepage-get-started">
            <h3 className="homepage-get-started-heading">Let&apos;s get started</h3>
            <ul className="homepage-get-started-list">
              <li>
                <Link to="/calendar" className="list-action-link">
                  Book your first appointment <span className="arrow">→</span>
                </Link>
              </li>
              <li>
                <Link to="/tracker" className="list-action-link">
                  Track your period <span className="arrow">→</span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="list-action-link">
                  Find a healthier feminine product <span className="arrow">→</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="homepage-cta">
            <Link to="/tracker" className="homepage-cta-button">
              get started
            </Link>
          </div>
        </section>

      
     
        <section className="homepage-tiles">
          {TILES.map(({ label, href, imgSrc, desc }) => (
            <Link key={label} to={href || "#"} className="homepage-tile">
              <div className="tile-image-placeholder">
                <img src={imgSrc} alt={`${label} context thumbnail`} className="tile-img" />
              </div>
              <div className="tile-content">
                <span className="homepage-tile-label">{label}</span>
                <p className="tile-subtext">{desc || "Explore diagnostic tools and clinical guides."}</p>
              </div>
            </Link>
          ))}
        </section>


      </div>
      <Footer/>
    </main>
  );
}

const TILES = [
  { 
    label: "Menstrual Cups", 
    imgSrc: "/WhImages/wh30.jpg", 
    href: "/products",            
    desc: "Compare reusable silicone models and sizing guidelines." 
  },
  { 
    label: "Hormonal IUDs", 
    imgSrc: "/WhImages/wh4.jpg", 
    href: "/tracker", 
    desc: "Understand long-term efficacy rates and symptom profiles." 
  },
  { 
    label: "Organic Care", 
    imgSrc: "/WhImages/wh21.jpg", 
    href: "/products", 
    desc: "Sourced lists of chemical-free bio-degradable cotton pads." 
  },
  { 
    label: "Fertility Tracking", 
    imgSrc: "/WhImages/wh24.jpg", 
    href: "/calendar", 
    desc: "Basal body temperature guides and cycle prediction charts." 
  }
];
