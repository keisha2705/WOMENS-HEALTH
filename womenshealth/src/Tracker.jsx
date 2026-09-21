import { useState, useEffect, useMemo } from "react";
import "./trackerpage.css";
import Footer from "./Footer.jsx";"./Footer.jsx"
import Navbar from "./Navbar.jsx"

export default function TrackerPage() {
  // Data structural state configurations
  const [logs, setLogs] = useState([]);
  const [cycleLength, setCycleLength] = useState(28);
  const [loading, setLoading] = useState(true);

  // User input element tracking triggers
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedMood, setSelectedMood] = useState("Neutral");
  const [submitting, setSubmitting] = useState(false);

  // 1. Helper function to read the token safely across all layout handlers
  const getSecureHeaderToken = () => {
    let storedToken =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    if (!storedToken || storedToken === "null" || storedToken === "undefined") {
      return null;
    }

    if (!storedToken.startsWith("Basic ")) {
      storedToken = `Basic ${storedToken}`;
    }
    return storedToken;
  };

  const SYMPTOM_OPTIONS = [
    "Cramps",
    "Bloating",
    "Headache",
    "Fatigue",
    "Mood Swings",
  ];
  const MOOD_OPTIONS = [
    "Calm",
    "Neutral",
    "Optimistic",
    "Reflective",
    "Anxious",
  ];

  // 2. FETCH TRACKER LOG ENTRIES
  useEffect(() => {
    async function fetchTrackerLogs() {
      const activeToken = getSecureHeaderToken();

      if (!activeToken) {
        console.warn("No active authorization token found in storage.");
        setLogs([]); // Initialize with empty array cleanly
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://32.198.180", {

          method: "GET",
          headers: {
            Authorization: activeToken,
            "Content-Type": "application/json",
          },
        });
        
        if (!res.ok) {
          throw new Error("Could not pull logs from endpoint tracking database.");
        }
        
        const data = await res.json();
        
        // Safety check to ensure logs state is always a manageable array list
        if (data && Array.isArray(data)) {
          setLogs(data);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error("Initial load log read error:", err);
        setLogs([]); // Prevent empty server exceptions from breaking component states
      } finally {
        setLoading(false);
      }
    }
    fetchTrackerLogs();
  }, []);

  // Submit log
  const handleSaveLogEntry = async (e) => {
    e.preventDefault();
    if (!startDate) return alert("Please select a valid onset date.");
    setSubmitting(true);

    let storedToken = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    try {
      // 💡 CONNECTED TO BACKEND: POST /api/tracker/log
      const res = await fetch("http://localhost:3000/api/tracker/log", {
        method: "POST",
        headers: {
          // 🛠️ FIXED: Securely attaches the Basic Auth wrapper your server requires to accept the write
          "Authorization": `Basic ${storedToken}`, 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          startDate: startDate,
          symptoms: selectedSymptoms,
          mood: selectedMood,
          cycleLength: cycleLength // Keeps your custom threshold synchronized
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status code: ${res.status}`);
      }
      
      const responseData = await res.json();
      alert(responseData.message || "Metrics logged successfully to MongoDB!");
      window.location.reload(); 
      
    } catch (err) {
      console.error("Auth Failure Debug:", err);
      alert(`Connection Failed: ${err.message}. Your login token is unauthorized.`);
    } finally {
      setSubmitting(false);
    }
  };

const cycleData = useMemo(() => {
  // 1. FIXED: Determine the clean base date source
  let baseStartDate = new Date(startDate); // Read directly from your input date picker state by default

  // 2. If a database log history *does* exist, read the most recent entry from the array instead
  if (logs && Array.isArray(logs) && logs.length > 0) {
    const latestLog = logs[0];
    if (latestLog && latestLog.startDate) {
      baseStartDate = new Date(latestLog.startDate);
    }
  }

  // 3. Safety validation check if the target dates parse incorrectly
  if (isNaN(baseStartDate.getTime())) {
    return {
      currentCycleDay: 1,
      daysUntilNextPeriod: "—",
      daysUntilPMS: "—",
      pmsStatus: "Low Risk",
      currentPhase: "Follicular Phase",
      formattedNextPeriod: "Awaiting Log Entries",
    };
  }

  const today = new Date();
  baseStartDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - baseStartDate.getTime();
  const daysSinceStart = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 4. FIXED: The math engine will now dynamically react to whatever you type in the cycleLength input field
  const currentCycleDay = ((daysSinceStart % cycleLength) + cycleLength) % cycleLength + 1;

  const nextPeriodStart = new Date(baseStartDate.getTime());
  const completedCycles = Math.floor(daysSinceStart / cycleLength) + (daysSinceStart >= 0 ? 1 : 0);
  nextPeriodStart.setDate(baseStartDate.getDate() + (completedCycles * cycleLength));

  const daysUntilNextPeriod = Math.ceil((nextPeriodStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const pmsStartDay = cycleLength - 4;
  let daysUntilPMS = 0;
  let pmsStatus = "Low Risk";

  if (currentCycleDay >= pmsStartDay) {
    pmsStatus = "Active Phase";
    daysUntilPMS = 0;
  } else {
    daysUntilPMS = pmsStartDay - currentCycleDay + 1;
    pmsStatus = daysUntilPMS <= 3 ? "Approaching" : "Low Risk";
  }

  let currentPhase = "Follicular Phase";
  if (currentCycleDay <= 5) {
    currentPhase = "Menstruation";
  } else if (currentCycleDay <= 13) {
    currentPhase = "Follicular Phase";
  } else if (currentCycleDay <= 16) {
    currentPhase = "Ovulation";
  } else {
    currentPhase = "Luteal Phase";
  }

  const options = { month: "short", day: "numeric" };
  const formattedNextPeriod = nextPeriodStart.toLocaleDateString("en-US", options);

  return {
    currentCycleDay,
    daysUntilNextPeriod,
    daysUntilPMS,
    pmsStatus,
    currentPhase,
    formattedNextPeriod,
  };
}, [logs, cycleLength, startDate]); // Added startDate to calculation re-trigger array



  return (
    <main className="trackerpage">
      <Navbar />
      <div className="tracker-container">
        {/* Header */}
        <header className="tracker-header">
          <div className="header-greeting-block">
            <h1 className="tracker-greeting">Good morning</h1>

            <p className="tracker-subtext">
              Your body is currently in its{" "}
              <strong>{cycleData.currentPhase}</strong>. Take it easy today.
            </p>
          </div>

          <div className="header-date-badge">
            Today,{" "}
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </div>
        </header>

        {/* Input form */} 
        <section className="cycle-input-card">
          <h2 className="input-card-title">Log Today's Health Metrics</h2>

          <form onSubmit={handleSaveLogEntry}>
            <div className="input-form-grid">
              <div className="input-field-group">
                <label>Period / Cycle Start Date</label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>

              <div className="input-field-group">
                <label>Current Dominant Mood</label>

                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="custom-select-element"
                >
                  {MOOD_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

            <div className="input-field-group">
  <label>Cycle Variation Threshold (Days)</label>
  <input 
    type="number" 
    value={cycleLength} 
    onChange={(e) => setCycleLength(Number(e.target.value))} 
  />
</div>

            </div>

            {/* Symptoms */}
            <div className="symptoms-selector-row">
              <span className="checkbox-row-label">Track Symptoms:</span>

              <div className="symptoms-pill-cloud">
                {SYMPTOM_OPTIONS.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    className={`symptom-pill-btn ${
                      selectedSymptoms.includes(symptom) ? "active" : ""
                    }`}
                    onClick={() => toggleSymptom(symptom)}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div className="input-action-row" style={{ marginTop: "1.5rem" }}>
              <button type="submit" className="sync-btn" disabled={submitting}>
                {submitting ? "Logging..." : " Save Entry to Database"}
              </button>
            </div>
          </form>
        </section>

        {/* Metrics */}
        <section className="tracker-metrics-grid">
          <div className="metric-card pillar-card">
            <span className="card-tagline">Days Until Next Period</span>

            <div className="metric-radial-flex">
              <div className="radial-visual-container">
                <span className="radial-number">
                  {cycleData.daysUntilNextPeriod}
                </span>

                <span className="radial-label">Days</span>
              </div>

              <div className="radial-description-block">
                <h3>Period expected {cycleData.formattedNextPeriod}</h3>

                <p>
                  Your cycle is processing updates against your configured{" "}
                  {cycleLength}-day track loops.
                </p>
              </div>
            </div>
          </div>

          <div className="metric-card pillar-card">
            <div className="card-header-flex">
              <span className="card-tagline">PMS Indicator</span>

              <span
                className={`pms-badge status-${cycleData.pmsStatus
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {cycleData.pmsStatus}
              </span>
            </div>

            <div className="pms-counter-display">
              <h2>
                {cycleData.daysUntilPMS === 0
                  ? "Active"
                  : `${cycleData.daysUntilPMS} days away`}
              </h2>

              <p>
                Monitors tracking profiles across cycle day markers
                automatically.
              </p>
            </div>

            <div className="progress-bar-track">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.min(
                    100,
                    (cycleData.currentCycleDay / cycleLength) * 100,
                  )}%`,
                }}
              />
            </div>

            <p>
              {cycleData.currentPhase} — Day {cycleData.currentCycleDay}
            </p>
          </div>
        </section>

        {/* Phase information */}

        <div className="split-dashboard-row">
          {/* Left Column: Descriptive Educational Matrix */}
          <section className="phase-encyclopedia-column">
            <h2 className="section-heading">What to expect in each phase</h2>

            <div className="encyclopedia-grid">
              <div
                className="encyclopedia-card"
                style={{
                  borderColor:
                    cycleData.currentPhase === "Menstruation"
                      ? "var(--accent-deep)"
                      : "var(--border-light)",
                  borderWidth:
                    cycleData.currentPhase === "Menstruation" ? "2px" : "1px",
                  position: "relative",
                }}
              >
                <div className="card-title-row">
                  <h3>Menstruation</h3>
                  <span className="day-tag">Days 1-5</span>
                </div>
                <p>
                  Progesterone levels drop sharply. Expect physical fatigue,
                  mild cramps, and naturally lower energy levels. Ideal time for
                  resting.
                </p>
                {cycleData.currentPhase === "Menstruation" && (
                  <span
                    className="active-phase-dot"
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      right: "1.5rem",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "var(--accent-deep)",
                      borderRadius: "50%",
                    }}
                  ></span>
                )}
              </div>

              <div
                className="encyclopedia-card"
                style={{
                  borderColor:
                    cycleData.currentPhase === "Follicular Phase"
                      ? "var(--accent-deep)"
                      : "var(--border-light)",
                  borderWidth:
                    cycleData.currentPhase === "Follicular Phase"
                      ? "2px"
                      : "1px",
                  position: "relative",
                }}
              >
                <div className="card-title-row">
                  <h3>Follicular</h3>
                  <span className="day-tag">Days 6-13</span>
                </div>
                <p>
                  Estrogen begins rising. Your energy level, optimism, and
                  overall creativity bounce back. Excellent time for planning
                  and new starts.
                </p>
                {cycleData.currentPhase === "Follicular Phase" && (
                  <span
                    className="active-phase-dot"
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      right: "1.5rem",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "var(--accent-deep)",
                      borderRadius: "50%",
                    }}
                  ></span>
                )}
              </div>

              {/* PHASE 3: OVULATION */}
              <div
                className="encyclopedia-card"
                style={{
                  borderColor:
                    cycleData.currentPhase === "Ovulation"
                      ? "var(--accent-deep)"
                      : "var(--border-light)",
                  borderWidth:
                    cycleData.currentPhase === "Ovulation" ? "2px" : "1px",
                  position: "relative",
                }}
              >
                <div className="card-title-row">
                  <h3>Ovulation</h3>
                  <span className="day-tag">Days 14-16</span>
                </div>
                <p>
                  Estrogen levels peak. You will likely experience high energy,
                  boosted confidence, and peak sociability. Great for public
                  speaking.
                </p>
                {cycleData.currentPhase === "Ovulation" && (
                  <span
                    className="active-phase-dot"
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      right: "1.5rem",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "var(--accent-deep)",
                      borderRadius: "50%",
                    }}
                  ></span>
                )}
              </div>

              <div
                className="encyclopedia-card"
                style={{
                  borderColor:
                    cycleData.currentPhase === "Luteal Phase"
                      ? "var(--accent-deep)"
                      : "var(--border-light)",
                  borderWidth:
                    cycleData.currentPhase === "Luteal Phase" ? "2px" : "1px",
                  position: "relative",
                }}
              >
                <div className="card-title-row">
                  <h3>Luteal</h3>
                  <span className="day-tag">Days 17-28</span>
                </div>
                <p>
                  Progesterone becomes dominant. You may experience bloating,
                  moderate cravings, and PMS symptoms. Be gentle on yourself.
                </p>
                {cycleData.currentPhase === "Luteal Phase" && (
                  <span
                    className="active-phase-dot"
                    style={{
                      position: "absolute",
                      top: "1.5rem",
                      right: "1.5rem",
                      width: "8px",
                      height: "8px",
                      backgroundColor: "var(--accent-deep)",
                      borderRadius: "50%",
                    }}
                  ></span>
                )}
              </div>
            </div>
          </section>

          <aside className="navigation-history-sidebar">
            <div className="quick-actions-wrapper">
              <h2 className="section-heading">Quick Actions</h2>
              <div className="navigation-hyperlinks-grid">
                <a href="/calendar" className="nav-action-hyperlink">
                  <div className="feature-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                      >
                        <path d="M.75 12h3m-3 6h3m-3-12h3m0-5.25H17.5s1.5 0 1.5 1.5v19.5s0 1.5-1.5 1.5H3.75s-1.5 0-1.5-1.5V2.25s0-1.5 1.5-1.5" />
                        <path d="M8.25 5.25h5.25s1.5 0 1.5 1.5V9s0 1.5-1.5 1.5H8.25s-1.5 0-1.5-1.5V6.75s0-1.5 1.5-1.5M19 16.75h2.75a1.5 1.5 0 0 0 1.5-1.5V3.75a1.5 1.5 0 0 0-1.5-1.5H19zM19 7h4.25M19 12h4.25" />
                      </g>
                    </svg>
                  </div>
                  <span className="link-text-wrapper">
                    <strong>View Calendar</strong>
                    <small>Review auto-synced dates</small>
                  </span>
                  <span className="link-arrow">→</span>
                </a>
                <a href="/notes" className="nav-action-hyperlink">
                  <div className="feature-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="1em"
                      height="1em"
                      viewBox="0 0 24 24"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <g
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                      >
                        <rect width="20" height="18" x="2" y="4" rx="4" />
                        <path d="M8 2v4m8-4v4M2 10h20" />
                      </g>
                    </svg>
                  </div>
                  <span className="link-text-wrapper">
                    <strong>Open Notes</strong>
                    <small>Log system metadata entries</small>
                  </span>
                  <span className="link-arrow">→</span>
                </a>
              </div>
            </div>

            <div className="history-log-panel">
              <div className="log-panel-header">
                <h3>Cycle History Logs</h3>
              </div>
              <ul className="history-log-list">
                {logs.slice(0, 3).map((logItem, index) => (
                  <li key={logItem._id || index}>
                    <div className="log-dates">
                      {new Date(logItem.startDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </div>
                    <div
                      className="log-duration-badge"
                      style={{ textTransform: "capitalize" }}
                    >
                      {logItem.mood} / {logItem.symptoms?.length || 0} symptoms
                    </div>
                  </li>
                ))}
                {logs.length === 0 && (
                  <li
                    style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}
                  >
                    No log entries submitted yet.
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </main>
  );
}
