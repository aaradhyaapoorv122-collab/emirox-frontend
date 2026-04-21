import { useState, useEffect } from "react";

const slides = [
  {
    title: "What is Light?",
    content: [
      "Light is a form of energy",
      "It enables vision",
      "It travels in a straight line",
    ],
  },
  {
    title: "Reflection of Light",
    content: [
      "Reflection is bouncing back of light",
      "Occurs on polished surfaces",
      "Used in mirrors",
    ],
  },
  {
    title: "Mirrors in Daily Life",
    content: [
      "Plane mirrors – images",
      "Convex mirrors – vehicles",
      "Concave mirrors – focus",
    ],
  },
];

export default function AssumeBatch() {
  const [index, setIndex] = useState(0);

  return (
    <div style={ui.wrapper}>
      <div style={ui.room}>

        {/* LEFT STUDENTS PANEL */}
        <div style={ui.leftPanel}>
          <div style={ui.avatar}></div>
          <div style={ui.avatar}></div>
          <div style={ui.avatar}></div>
          <div style={ui.avatar}></div>
          <div style={{ marginTop: 10, fontSize: 11 }}>
            +21 students silent
          </div>
        </div>

        {/* MAIN */}
        <div style={ui.main}>

          {/* TOP BAR */}
          <div style={ui.topBar}>
            <span>👥 25 Students · 🔕 Silent</span>
            <span>⏱ 30:00</span>
          </div>

          {/* PHASE */}
          <div style={ui.phase}>
            Teaching Phase · Science · Light
          </div>

          {/* SLIDE */}
          <div style={ui.slide}>
            <div style={ui.heading}>
              {slides[index].title}
            </div>

            {slides[index].content.map((p, i) => (
              <div key={i} style={ui.point}>
                {p}
              </div>
            ))}

            <div
              style={{
                marginTop: 14,
                fontSize: 12,
                color: "#93c5fd",
                fontStyle: "italic",
              }}
            >
              Instructor explaining… stay focused with the batch.
            </div>
          </div>

          {/* FOOTER */}
          <div style={ui.footer}>
            <button
              style={ui.primaryBtn}
              onClick={() =>
                setIndex((i) => Math.min(i + 1, slides.length - 1))
              }
            >
              Continue with Batch
            </button>

            <button
              style={ui.skipBtn}
              onClick={() => setIndex(slides.length - 1)}
            >
              Skip (I Already Know)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== UI OBJECT (YOUR STYLE, APPLIED PROPERLY) ===== */

const ui = {
  wrapper: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top,#0b1026,#020617 70%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#e5e7eb",
    fontFamily: "Inter, system-ui, sans-serif",
  },

  room: {
    width: 820,
    height: 480,
    borderRadius: 26,
    background: "rgba(6,8,20,0.95)",
    boxShadow: "0 60px 160px rgba(0,0,0,0.95)",
    display: "flex",
    overflow: "hidden",
  },

  leftPanel: {
    width: 160,
    background: "rgba(255,255,255,0.03)",
    padding: 16,
    fontSize: 12,
    color: "#94a3b8",
  },

  avatar: {
    height: 32,
    borderRadius: 8,
    background: "rgba(99,102,241,0.15)",
    marginBottom: 8,
  },

  main: {
    flex: 1,
    padding: 26,
    display: "flex",
    flexDirection: "column",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 13,
    color: "#a5b4fc",
    marginBottom: 14,
  },

  phase: {
    alignSelf: "center",
    padding: "6px 18px",
    borderRadius: 999,
    background: "rgba(99,102,241,0.18)",
    fontSize: 13,
    marginBottom: 18,
  },

  slide: {
    flex: 1,
    background: "rgba(255,255,255,0.04)",
    borderRadius: 20,
    padding: 24,
  },

  heading: {
    fontSize: 20,
    marginBottom: 14,
  },

  point: {
    padding: 12,
    borderRadius: 14,
    background: "rgba(15,23,42,0.8)",
    marginBottom: 10,
    fontSize: 14,
  },

  footer: {
    marginTop: 18,
    display: "flex",
    gap: 12,
  },

  primaryBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    border: "none",
    background:
      "linear-gradient(135deg,#6366f1,#22d3ee)",
    color: "#020617",
    fontWeight: 600,
    cursor: "pointer",
  },

  skipBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 16,
    border: "1px solid rgba(168,85,247,0.4)",
    background: "transparent",
    color: "#c7d2fe",
    cursor: "pointer",
  },
};

