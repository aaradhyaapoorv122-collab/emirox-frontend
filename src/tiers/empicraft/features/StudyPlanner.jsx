import React, { useState } from "react";
import api from "../../../utils/api";
import { aiRequest } from "@/utils/aiRequest";


export default function StudyPlanner() {
  const [subjects, setSubjects] = useState(["Math", "Science", "English"]);
  const [goal, setGoal] = useState("Upcoming Exam");
  const [duration, setDuration] = useState("2h");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState([]);

  const [customSubject, setCustomSubject] = useState("");

  const generatePlan = async () => {
    setLoading(true);
    setPlan([]);

    try {
      const response = await api.sendAIMessage({
        message: `Create a study timetable for:
        Goal: ${goal}
        Duration: ${duration}
        Subjects: ${subjects.join(", ")}
        Make it structured with time slots.`,
        feature: "planner",
        standard: "8",
        context: "study planner AI",
      });


  const handleAskAI = async (message) => {

    const result = await aiRequest(message, async (msg) => {
      return await fetch("/api/ai", {
        method: "POST",
        body: JSON.stringify({ message: msg }),
      }).then(r => r.json());
    });

    if (result.blocked) {
      alert("🔒 Daily AI limit reached. Upgrade to EmpiLab ⚡");
      return;
    }

    console.log(result.data);
  };

  return (
    <div>
      <button onClick={() => handleAskAI("Hello AI")}>
        Ask AI
      </button>
    </div>
  );

      // fake parse for now (backend upgrade later)
      const mock = [
        ["17:00", "17:30", "Math Practice"],
        ["17:30", "18:00", "Science Revision"],
        ["18:00", "18:10", "Break"],
        ["18:10", "18:40", "English Reading"],
      ];

      setPlan(mock);
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  const addSubject = () => {
    if (!customSubject) return;
    setSubjects([...subjects, customSubject]);
    setCustomSubject("");
  };

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1>📅 AI Study Planner</h1>
        <p>Smart timetable generation system</p>
      </div>

      <div style={styles.layout}>

        {/* LEFT PANEL */}
        <div style={styles.left}>
          <h3>🎯 Setup Your Plan</h3>

          <label>Study Goal</label>
          <select style={styles.input} value={goal} onChange={(e) => setGoal(e.target.value)}>
            <option>Upcoming Exam</option>
            <option>Daily Revision</option>
            <option>Deep Learning</option>
          </select>

          <label>Study Duration</label>
          <input style={styles.input} value={duration} onChange={(e) => setDuration(e.target.value)} />

          <label>Add Subject</label>
          <div style={styles.row}>
            <input
              style={styles.input}
              value={customSubject}
              onChange={(e) => setCustomSubject(e.target.value)}
              placeholder="e.g. Physics"
            />
            <button style={styles.addBtn} onClick={addSubject}>+</button>
          </div>

          <div style={styles.subjectBox}>
            {subjects.map((s, i) => (
              <span key={i} style={styles.tag}>{s}</span>
            ))}
          </div>

          <button style={styles.generate} onClick={generatePlan}>
            {loading ? "⏳ AI Generating Plan..." : "✨ Generate AI Plan"}
          </button>
        </div>

        {/* RIGHT PANEL */}
        <div style={styles.right}>

          {loading ? (
            <div style={styles.loader}>
              🤖 AI is designing your perfect timetable...
            </div>
          ) : plan.length === 0 ? (
            <div style={styles.empty}>
              Your AI-generated schedule will appear here 📅
            </div>
          ) : (
            <>
              <div style={styles.aiHeader}>
                🤖 AI Optimized Study Plan
              </div>

              <div style={styles.timeline}>
                {plan.map((p, i) => (
                  <div key={i} style={styles.block}>
                    <div style={styles.time}>
                      {p[0]} - {p[1]}
                    </div>
                    <div style={styles.task}>{p[2]}</div>
                  </div>
                ))}
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

/* ================= UI ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg,#0b1220,#0f172a)",
    color: "white",
    fontFamily: "Inter",
    padding: 20,
  },

  header: {
    textAlign: "center",
    marginBottom: 20,
  },

  layout: {
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    gap: 20,
  },

  left: {
    background: "#111827",
    padding: 20,
    borderRadius: 16,
  },

  right: {
    background: "#0f172a",
    padding: 20,
    borderRadius: 16,
    minHeight: 400,
  },

  input: {
    width: "100%",
    padding: 10,
    margin: "8px 0",
    borderRadius: 10,
    background: "#1e293b",
    border: "none",
    color: "white",
  },

  row: {
    display: "flex",
    gap: 10,
  },

  addBtn: {
    width: 40,
    borderRadius: 10,
    border: "none",
    background: "#22c55e",
    color: "black",
    fontWeight: "bold",
    cursor: "pointer",
  },

  subjectBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },

  tag: {
    background: "#1e293b",
    padding: "4px 10px",
    borderRadius: 20,
    fontSize: 12,
  },

  generate: {
    marginTop: 15,
    width: "100%",
    padding: 12,
    borderRadius: 12,
    background: "#2563eb",
    border: "none",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  loader: {
    textAlign: "center",
    padding: 40,
    color: "#38bdf8",
    fontSize: 16,
  },

  empty: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: 50,
  },

  aiHeader: {
    background: "#1e293b",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    color: "#38bdf8",
  },

  timeline: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  block: {
    display: "flex",
    justifyContent: "space-between",
    background: "#1e293b",
    padding: 12,
    borderRadius: 10,
  },

  time: {
    fontSize: 12,
    color: "#94a3b8",
  },

  task: {
    fontWeight: 500,
  },
};