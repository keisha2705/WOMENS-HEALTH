import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Notes.css"; // Save style file below

export default function Notes() {
  const [notes, setNotes] = useState([
    { id: 1, title: "Symptom Tracking Note", content: "Felt minor cramps during morning workout routine. Sticking to warm teas today." },
    { id: 2, title: "Gynaecologist Questions", content: "Ask about variations in cycle lengths next appointment checkup." }
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);

  const handleCreateOrUpdateNote = (e) => {
    e.preventDefault();
    if (!title || !content) return;

    if (editingId) {
      setNotes(notes.map(n => n.id === editingId ? { ...n, title, content } : n));
      setEditingId(null);
    } else {
      setNotes([...notes, { id: Date.now(), title, content }]);
    }
    setTitle("");
    setContent("");
  };

  const startEditFlow = (note) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  return (
    <main className="homepage">
      <div className="homepage-container">
        <Navbar />

        <header className="page-section-header">
          <h1 className="homepage-hero-title">Wellness Journal</h1>
          <p className="homepage-hero-description">
            Your private journal workspace to record symptoms, thoughts, and personal health logs.
          </p>
        </header>

        <div className="notes-layout-grid">
          {/* Note Form */}
          <form onSubmit={handleCreateOrUpdateNote} className="note-editor-card">
            <h3>{editingId ? "Modify Note Entry" : "Create New Journal Entry"}</h3>
            <div className="input-field-group" style={{ marginBottom: "1rem" }}>
              <label>Journal Title</label>
              <input 
                type="text" 
                placeholder="e.g., Morning Health Log"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
              />
            </div>
            <div className="input-field-group" style={{ marginBottom: "1.5rem" }}>
              <label>Your Notes</label>
              <textarea 
                rows="5"
                placeholder="Write down how you're feeling today..."
                value={content} 
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <button type="submit" className="hero-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
              {editingId ? "Save Variations" : "Publish to Journal"}
            </button>
          </form>

          {/* Notes Workspace Listing Cards */}
          <div className="notes-items-column">
            {notes.length === 0 ? (
              <p className="empty-logs-text">No notes or journal entries written yet.</p>
            ) : (
              notes.map(note => (
                <div key={note.id} className="feature-card note-item-card">
                  <h4 className="feature-title" style={{ fontSize: "1.2rem" }}>{note.title}</h4>
                  <p className="feature-desc" style={{ marginBottom: "1rem" }}>{note.content}</p>
                  <div className="note-card-actions-row">
                    <button type="button" onClick={() => startEditFlow(note)} className="note-action-btn edit">Modify</button>
                    <button type="button" onClick={() => handleDeleteNote(note.id)} className="note-action-btn delete">Remove</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
