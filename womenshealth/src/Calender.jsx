import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./calender.css"; // Save style file below

export default function Calender() {
  const [logs, setLogs] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  const cycleLength = 25;
  useEffect(() => {
    async function fetchLogs() {
      const storedToken = localStorage.getItem("authToken");
      
      try {
       
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/tracker/log`, {
          method: "GET",
          headers: {
            "Authorization": `Basic ${storedToken}`,
            "Content-Type": "application/json",
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          setLogs(data); 
        }
      } catch (err) {
        console.error("Failed to read logs for calendar matrix:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  const getDayPhase = (date) => {
    if (!logs || logs.length === 0) return null;
    
    const sortedLogs = [...logs].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    const targetTime = date.setHours(0,0,0,0);

    for (let log of sortedLogs) {
      const start = new Date(log.startDate);
      start.setHours(0,0,0,0);

      const diffTime = targetTime - start.getTime();
      const daysSinceStart = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (daysSinceStart >= 0) {
        const currentCycleDay = (daysSinceStart % cycleLength) + 1;
        
        if (currentCycleDay <= 5) return "menstruation";
        if (currentCycleDay >= 12 && currentCycleDay <= 15) return "ovulation";
        if (currentCycleDay >= cycleLength - 4) return "pms";
      }
    }
    return null;
  };

  // Calendar Layout Builder Parameters
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDayOfMonth; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(new Date(year, month, i));

  const monthsList = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <main className="homepage">
      <div className="homepage-container">
        <Navbar />
        
        <header className="page-section-header">
          <h1 className="homepage-hero-title">Cycle Calendar</h1>
          <p className="homepage-hero-description">
            Your dynamic biological calendar preview generated automatically from your tracker log sheets.
          </p>
        </header>

        <section className="calendar-card-frame">
          <div className="calendar-nav-toolbar">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>← Prev</button>
            <h2>{monthsList[month]} {year}</h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>Next →</button>
          </div>

          <div className="calendar-grid-labels">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <span key={d}>{d}</span>)}
          </div>

          <div className="calendar-grid-cells">
            {daysArray.map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} className="empty-cell" />;
              const phase = getDayPhase(new Date(date));
              return (
                <div key={idx} className={`day-cell ${phase ? `phase-${phase}` : ""}`}>
                  <span className="day-number-text">{date.getDate()}</span>
                  {phase && <span className="phase-indicator-dot" />}
                </div>
              );
            })}
          </div>

          <div className="calendar-legend-guide">
            <div className="legend-item"><span className="legend-dot color-menstruation" /> Menstruation (Period)</div>
            <div className="legend-item"><span className="legend-dot color-ovulation" /> Ovulation Window</div>
            <div className="legend-item"><span className="legend-dot color-pms" /> PMS Active Phase</div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}
