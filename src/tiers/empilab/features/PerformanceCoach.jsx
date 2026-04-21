import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api.js";

export default function PerformanceCoachFeature({
  userStats = {},
  plannerData = {},
}) {
  const [completion, setCompletion] = useState(0);
  const [aiReport, setAiReport] = useState("");
  const [loading, setLoading] = useState(false);

  const user = {
    name: userStats.name || "Apoorv",
    xp: userStats.xp || 28,
    projects: userStats.projects || 3,
    overallProgress: userStats.overallProgress ?? 75,
    subjects: userStats.subjects || [
      { name: "Maths", score: 68 },
      { name: "Science", score: 82 },
      { name: "English", score: 91 },
    ],
  };

  const todayTasks =
    plannerData.todayTasks || [
      { subject: "Maths", task: "Practice algebra" },
      { subject: "Science", task: "Revise chemistry" },
      { subject: "English", task: "Essay writing" },
    ];

  /* ================= ANIMATION ================= */
  useEffect(() => {
    let current = 0;
    const target = user.overallProgress;

    const interval = setInterval(() => {
      if (current <= target) {
        setCompletion(current);
        current++;
      } else clearInterval(interval);
    }, 15);

    return () => clearInterval(interval);
  }, [user.overallProgress]);

  /* ================= AI CALL ================= */
  const generateReport = async () => {
    setLoading(true);
    setAiReport("");

    const message = `
Student Performance Data:

Name: ${user.name}
XP: ${user.xp}
Overall Progress: ${user.overallProgress}%

Subjects:
${user.subjects.map((s) => `${s.name}: ${s.score}%`).join("\n")}

Today's Tasks:
${todayTasks.map((t) => `${t.subject}: ${t.task}`).join("\n")}

TASK:
Analyze performance deeply and give coaching report.
`;

    try {
      const reply = await api.sendAI({
        feature: "Performance_Coach",
        message,
        context: user,
      });

      setAiReport(reply);
    } catch (err) {
      setAiReport("⚠️ AI Error");
    }

    setLoading(false);
  };

  return (
    <div style={styles.container}>
      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>Performance Coach AI</h1>
          <p>Real-time student growth intelligence 🚀</p>
        </div>

        <button onClick={generateReport} style={styles.btn}>
          {loading ? "Analyzing..." : "Generate AI Report"}
        </button>
      </header>

      {/* ORB */}
      <motion.div style={styles.orbCard}>
        <svg width="180" height="180">
          <circle cx="90" cy="90" r="70" stroke="#0d1f33" strokeWidth="14" fill="none" />
          <circle
            cx="90"
            cy="90"
            r="70"
            stroke="#4ea0ff"
            strokeWidth="14"
            fill="none"
            strokeDasharray={440}
            strokeDashoffset={440 - (440 * completion) / 100}
            strokeLinecap="round"
          />
        </svg>

        <div style={styles.orbCenter}>
          <h2>{completion}%</h2>
          <p>Progress</p>
        </div>
      </motion.div>

      {/* SUBJECTS */}
      <div style={styles.grid}>
        {user.subjects.map((sub) => (
          <motion.div
            key={sub.name}
            whileHover={{ scale: 1.05 }}
            style={styles.card}
          >
            <h3>{sub.name}</h3>
            <p>{sub.score}%</p>
          </motion.div>
        ))}
      </div>

      {/* TASKS */}
      <div style={styles.box}>
        <h3>Today's Tasks</h3>
        {todayTasks.map((t, i) => (
          <p key={i}>• {t.subject}: {t.task}</p>
        ))}
      </div>

      {/* AI REPORT */}
      {aiReport && (
        <div style={styles.aiBox}>
          <h3>🧠 AI Coaching Report</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{aiReport}</pre>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    minHeight: "100vh",
    padding: 40,
    background: "linear-gradient(135deg, #081520, #0c2538)",
    color: "#e6f3ff",
    fontFamily: "Inter",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  title: { fontSize: 28, fontWeight: 600 },

  btn: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    background: "#4ea0ff",
    color: "#000",
    fontWeight: 700,
    cursor: "pointer",
  },

  orbCard: {
    margin: "auto",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: "rgba(15,30,55,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  orbCenter: {
    position: "absolute",
    textAlign: "center",
  },

  grid: {
    marginTop: 40,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
    gap: 20,
  },

  card: {
    padding: 20,
    borderRadius: 18,
    background: "rgba(255,255,255,0.06)",
    textAlign: "center",
  },

  box: {
    marginTop: 40,
    padding: 25,
    borderRadius: 18,
    background: "rgba(20,40,70,0.7)",
  },

  aiBox: {
    marginTop: 30,
    padding: 20,
    borderRadius: 18,
    background: "rgba(0,150,255,0.15)",
    border: "1px solid rgba(0,150,255,0.3)",
  },
};