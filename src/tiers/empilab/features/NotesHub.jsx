import React, { useState } from "react";
import api from "../../../utils/api.js";

export default function NotesHub() {
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [noteType, setNoteType] = useState("Exam Oriented");
  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  const noteTypes = [
    "Exam Oriented",
    "Bullet Notes",
    "Quick Revision",
    "Short Notes",
    "Long Notes",
    "Conceptual",
  ];

 const generateNotes = async () => {
  if (!topic) return alert("Topic is required");

  try {
    const response = await api.sendAIMessage({
      message: `Generate ${noteType} notes for:
Subject: ${subject}
Topic: ${topic}
Subtopic: ${subtopic}

Make it exam-ready, structured, and easy to revise.`,
      feature: "notes_ai",
      standard: "8",
      context: {
        subject,
        topic,
        subtopic,
        noteType,
      },
    });

    const newNote = {
      id: Date.now(),
      subject,
      topic,
      subtopic,
      noteType,
      content: response,
      date: new Date().toLocaleDateString(),
      pinned: false,
      favourite: false,
    };

    setNotes((prev) => [newNote, ...prev]);
  } catch (err) {
    alert("⚠️ AI failed. Try again.");
    console.error(err);
  }
};
  const togglePin = (id) => {
    setNotes((prev) =>
  prev.map((n) =>
    n.id === id ? { ...n, pinned: !n.pinned } : n
  )
);
    
  };

  const toggleFavourite = (id) => {
    setNotes(
      notes.map((n) =>
        n.id === id ? { ...n, favourite: !n.favourite } : n
      )
    );
  };

  const visibleNotes = notes
    .filter((n) =>
      `${n.topic} ${n.subject}`.toLowerCase().includes(search.toLowerCase())
    )
    .filter((n) =>
      filterType === "All" ? true : n.noteType === filterType
    )
    .sort((a, b) => b.pinned - a.pinned);

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📘 Notes Hub</h1>
      <p style={styles.subtitle}>Smart notes. Saved forever.</p>

      <div style={styles.card}>
        <input placeholder="Subject (optional)" style={styles.input}
          value={subject} onChange={(e) => setSubject(e.target.value)} />

        <input placeholder="Topic (required)" style={styles.input}
          value={topic} onChange={(e) => setTopic(e.target.value)} />

        <input placeholder="Subtopic (optional)" style={styles.input}
          value={subtopic} onChange={(e) => setSubtopic(e.target.value)} />

        <div style={styles.typeRow}>
          {noteTypes.map((type) => (
            <button key={type}
              style={{
                ...styles.typeBtn,
                background: noteType === type ? "#6366f1" : "#1e293b",
              }}
              onClick={() => setNoteType(type)}>
              {type}
            </button>
          ))}
        </div>

        <button style={styles.generateBtn} onClick={generateNotes}>
          ✨ Generate Notes
        </button>
      </div>

      <div style={styles.controls}>
        <input
          placeholder="🔍 Search notes"
          style={styles.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          style={styles.filter}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option>All</option>
          {noteTypes.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div style={styles.library}>
        {visibleNotes.map((note) => (
          <div key={note.id} style={styles.noteCard}>
            <div style={styles.noteTop}>
              <strong>{note.topic}</strong>
              <div>
                <button onClick={() => togglePin(note.id)} style={styles.icon}>
                  {note.pinned ? "📌" : "📍"}
                </button>
                <button onClick={() => toggleFavourite(note.id)} style={styles.icon}>
                  {note.favourite ? "❤️" : "🤍"}
                </button>
              </div>
            </div>

            <p style={styles.meta}>
              {note.subject} • {note.noteType} • {note.date}
            </p>
            <pre style={styles.content}>{note.content}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "30px",
    background: "linear-gradient(135deg, #0f172a, #1e293b, #312e81)",
    color: "#e5e7eb",
    fontFamily: "Segoe UI, sans-serif",
  },
  title: { fontSize: "36px", fontWeight: "700" },
  subtitle: { opacity: 0.8, marginBottom: "30px" },
  card: {
    background: "#020617aa",
    padding: "20px",
    borderRadius: "16px",
    maxWidth: "700px",
    marginBottom: "30px",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#1e293b",
    color: "white",
  },
  typeRow: { display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "16px" },
  typeBtn: {
    padding: "8px 12px",
    borderRadius: "999px",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
  generateBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    background: "#4f46e5",
    color: "white",
    fontWeight: "600",
    border: "none",
  },
  controls: {
    display: "flex",
    gap: "12px",
    marginBottom: "20px",
  },
  search: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#1e293b",
    color: "white",
  },
  filter: {
    padding: "10px",
    borderRadius: "10px",
    background: "#1e293b",
    color: "white",
    border: "none",
  },
  library: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "16px",
  },
  noteCard: {
    background: "#020617cc",
    padding: "16px",
    borderRadius: "14px",
  },
  noteTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  icon: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
  },
  meta: { fontSize: "12px", opacity: 0.7 },
  content: { whiteSpace: "pre-wrap", fontSize: "13px", marginTop: "10px" },
};
