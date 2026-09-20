import { useState, useMemo } from "react";
import Navbar from "./Navbar"
import { DOCTORS_DATA } from "./doctorsData";
import "./doctorspage.css";

export default function DoctorsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(DOCTORS_DATA[0]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const getSecureHeaderToken = () => {
    let storedToken =
      localStorage.getItem("authToken") ||
      sessionStorage.getItem("authToken");

    if (
      !storedToken ||
      storedToken === "null" ||
      storedToken === "undefined"
    ) {
      return null;
    }

    if (!storedToken.startsWith("Basic ")) {
      storedToken = `Basic ${storedToken}`;
    }

    return storedToken;
  };

  const getDoctorImage = (image) => {
    if (!image) {
      return "/dtc.jpg";
    }

    return image;
  };

  const handleImageError = (event) => {
    if (event.currentTarget.src.endsWith("/dtc.jpg")) {
      return;
    }

    event.currentTarget.src = "/dtc.jpg";
  };

  // Form Fields Parameters

  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("09:00");
  const [reason, setReason] = useState("General Consultation");
  const [notes, setNotes] = useState("");

  const filteredDoctors = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return DOCTORS_DATA;
    }

    return DOCTORS_DATA.filter(
      (doc) =>
        doc.name.toLowerCase().includes(query) ||
        doc.title.toLowerCase().includes(query) ||
        doc.location.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  // BOOKING SUBMISSION

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!bookingDate) {
      return alert("Please select a convenient date for your appointment.");
    }

    if (!selectedDoctor || !selectedDoctor.id) {
      return alert("Technical error: Doctor selection missing.");
    }

    setSubmitting(true);

    const token = getSecureHeaderToken();

    if (!token) {
      setSubmitting(false);

      return alert(
        "Authentication session has expired. Please log out and sign back in to book a consultation.",
      );
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/bookings/new`, {
        method: "POST",

        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          doctorId: selectedDoctor.id,
          appointmentDate: `${bookingDate}T${bookingTime}:00`,
          reason: reason,
          notes: notes,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || `Server returned code failure: ${res.status}`,
        );
      }

      alert(
        data.message ||
          `Appointment with ${selectedDoctor.name} booked successfully!`,
      );

      setShowBookingModal(false);
      setBookingDate("");
      setNotes("");
    } catch (err) {
      console.error("Booking Error Trace:", err);

      alert(
        `Reservation Failed: ${err.message}. Ensure your backend server is active on port 3000.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="doctors-page">
      <Navbar/>
      <div className="doctors-fullscreen-container">
        <section className="directory-list-column">
          <header className="directory-header">
            <h1 className="canva-title">
              Find your doctor
            </h1>

            <div className="canva-search-container">
              
              <input
                type="text"
                placeholder="Search by profession, by location, by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="canva-search-input"
              />

            </div>
          </header>

          {/* Doctor Cards */}

          <div className="canva-doctors-grid">
            {filteredDoctors.map((doc) => (
              <div
                key={doc.id}
                className={`canva-doctor-card ${
                  selectedDoctor?.id === doc.id
                    ? "focused-selection"
                    : ""
                }`}
                onClick={() => setSelectedDoctor(doc)}
              >
                <div className="canva-card-avatar-box">
                  <img
                    src={getDoctorImage(doc.image)}
                    alt={doc.name}
                    className="canva-avatar-img"
                    onError={handleImageError}
                  />
                </div>

                <div className="canva-card-info-box">
                  <h2 className="canva-doc-name">
                    {doc.name}
                  </h2>

                  <p className="canva-doc-specialty">
                    {doc.title}
                  </p>

                  <div className="canva-doc-metadata-row">
                    <span className="meta-item rating">
                       {doc.rating}
                    </span>

                    <span className="meta-item location">
                      - {doc.location}
                    </span>

                    <span className="meta-item experience">
                      {doc.experience}
                    </span>
                  </div>

                  <div className="canva-card-action-row">
                    <button
                      type="button"
                      className="canva-book-trigger-btn"
                      onClick={(e) => {
                        e.stopPropagation();

                        setSelectedDoctor(doc);

                        setShowBookingModal(true);
                      }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredDoctors.length === 0 && (
              <p className="no-results-text">
                No specialists found matching your search terms.
              </p>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Doctor Profile */}

        <section className="doctor-profile-column">
          {selectedDoctor ? (
            <div className="profile-expanded-workspace">
              <div className="profile-hero-block">

                <div className="profile-large-img-box">
                  <img
                    src={getDoctorImage(selectedDoctor.image)}
                    alt={selectedDoctor.name}
                    className="profile-large-img"
                    onError={handleImageError}
                  />
                </div>

                <div className="profile-hero-titles">
                  <span className="profile-tagline-status">
                    Consultant Review
                  </span>

                  <h2>
                    {selectedDoctor.name}
                  </h2>

                  <p className="profile-specialty-subtext">
                    {selectedDoctor.title}
                  </p>

                  <p className="profile-credentials-tag">
                    {selectedDoctor.credentials}
                  </p>
                </div>
              </div>

              <div className="profile-body-divider" />

              <div className="profile-details-section">
                <h3>
                  Biography
                </h3>

                <p className="profile-bio-text">
                  {selectedDoctor.biography}
                </p>

                <div className="financial-transparency-card">
                 
                  <div className="transparency-text">
                    <h4>
                      Published Consultation Fee: $
                      {selectedDoctor.consultationFee}.00
                    </h4>

                    <p>
                      Transparent pricing metrics guaranteed across all
                      platform appointments.
                    </p>
                  </div>
                </div>

                <div className="profile-action-row">
                  <button
                    type="button"
                    className="book-now-primary-btn"
                    onClick={() => setShowBookingModal(true)}
                  >
                    Book Appointment Now →
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="empty-profile-placeholder">
              <p>
                Select a medical professional card to review credentials
                parameters.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* BOOKING MODAL */}

      {showBookingModal && (
        <div
          className="modal-overlay-shroud"
          onClick={() => setShowBookingModal(false)}
        >
          <div
            className="booking-modal-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="modal-panel-header">
              <div className="modal-title-wrapper">
                <h2>
                  Confirm Appointment Slot
                </h2>

                <p>
                  Registering metrics with{" "}
                  <strong>
                    {selectedDoctor.name}
                  </strong>
                </p>
              </div>

              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </header>

            <form
              onSubmit={handleBookingSubmit}
              className="modal-form-transition-box"
            >
              <div className="modal-form-grid">

                <div className="modal-input-group">
                  <label htmlFor="appt-date">
                    Appointment Date
                  </label>

                  <input
                    id="appt-date"
                    type="date"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    required
                  />
                </div>

                <div className="modal-input-group">
                  <label htmlFor="appt-time">
                    Preferred Time Window
                  </label>

                  <select
                    id="appt-time"
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                  >
                    <option value="09:00">
                      09:00 AM
                    </option>

                    <option value="11:30">
                      11:30 AM
                    </option>

                    <option value="14:00">
                      14:00 PM
                    </option>

                    <option value="16:30">
                      16:30 PM
                    </option>
                  </select>
                </div>

                <div className="modal-input-group structural-fullwidth">
                  <label htmlFor="appt-reason">
                    Reason for Booking
                  </label>

                  <select
                    id="appt-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  >
                    <option value="General Consultation">
                      General Consultation checkup
                    </option>

                    <option value="Cycle Irregularity Review">
                      Cycle Irregularity evaluation
                    </option>

                    <option value="PCOS / Endometriosis Tracking">
                      PCOS / Endometriosis tracking review
                    </option>
                  </select>
                </div>

                <div className="modal-input-group structural-fullwidth">
                  <label htmlFor="appt-notes">
                    Additional Notes (Optional)
                  </label>

                  <textarea
                    id="appt-notes"
                    placeholder="Provide any context variables here..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-action-footer-row">
                <button
                  type="button"
                  className="cancel-modal-btn"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="confirm-modal-btn"
                  disabled={submitting}
                >
                  {submitting
                    ? "Processing..."
                    : "Confirm & Book Securely"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}