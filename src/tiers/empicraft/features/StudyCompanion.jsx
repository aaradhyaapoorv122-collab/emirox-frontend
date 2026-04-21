import React, { useState, useEffect } from "react";
import api from "../../../utils/api.js";
import { aiRequest } from "@/utils/aiRequest";
import { supabase } from "@/lib/supabaseClient";


export default function StudyCompanion() {
  const [dailyTip, setDailyTip] = useState("");
  const [progress, setProgress] = useState({
    Maths: 60,
    Science: 35,
    English: 80,
  });
  const [focusSubject, setFocusSubject] = useState("");
  const [sessionStarted, setSessionStarted] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [activityLog, setActivityLog] = useState([]);
   
  
  const handleAskAI = async (message) => {

    const result = await aiRequest(message, async (msg) => {
      return await fetch("http://localhost:5000/ai/core", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: msg }),
      }).then(r => r.json());
    });

    if (result.blocked) {
      alert("🔒 Daily AI limit reached. Upgrade to EmpiLab ⚡");
      return;
    }

    console.log(result.data);
  };

  

  // AI-generated daily tip & focus subject
  useEffect(() => {
    const encouragements = [
      "Consistency beats intensity! 💪",
      "Focus on weak areas first 🚀",
      "Quick revision > Long sessions 🔥",
      "Smart study > Hard study 🧠",
      "Reward yourself after milestones 🏆",
    ];
    const subjects = Object.keys(progress);
    const weakest = subjects.reduce(
      (a, b) => (progress[a] < progress[b] ? a : b),
      subjects[0]
    );
    setFocusSubject(weakest);
    setDailyTip(
      `Today's Focus: ${weakest}. ${encouragements[Math.floor(Math.random() * encouragements.length)]}`
    );
  }, []);

  const startSession = () => {
    setSessionStarted(true);
    logActivity("Started today's session 🚀");
  };

  const updateProgress = (subject, change) => {
    setProgress((prev) => {
      const newVal = Math.min(100, Math.max(0, prev[subject] + change));
      logActivity(`${subject} progress ${change > 0 ? "increased" : "decreased"} by ${Math.abs(change)}%`);
      if (newVal === 100) grantReward(subject);
      return { ...prev, [subject]: newVal };
    });
  };

  const grantReward = (subject) => {
    const reward = `🏆 Mastered ${subject}!`;
    if (!rewards.includes(reward)) {
      setRewards([...rewards, reward]);
      logActivity(reward);
    }
  };

  const logActivity = (msg) => {
    setActivityLog((prev) => [msg, ...prev]);
  };

  const suggestNextStep = () => {
    const subjects = Object.keys(progress);
    const nextFocus = subjects.reduce(
      (a, b) => (progress[a] < progress[b] ? a : b),
      subjects[0]
    );
    return `Next, focus on ${nextFocus} for maximum improvement.`;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>🌟 AI Study Companion</h1>

        {/* Daily Tip */}
        <div style={styles.dailyTip}>{dailyTip}</div>

        {/* Subject Progress Bars */}
        <h3 style={styles.subTitle}>📊 Subject Progress</h3>
        {Object.keys(progress).map((subj) => (
          <div key={subj} style={styles.progressRow}>
            <span style={{ width: 90 }}>{subj}</span>
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${progress[subj]}%`,
                  background: subj === focusSubject ? "#22d3ee" : "#3b82f6",
                }}
              />
            </div>
            <span style={{ width: 40, textAlign: "right" }}>{progress[subj]}%</span>
            <button style={styles.progressBtn} onClick={() => updateProgress(subj, 5)}>+5</button>
            <button style={styles.progressBtn} onClick={() => updateProgress(subj, -5)}>-5</button>
          </div>
        ))}

        {/* Start Session */}
        <button onClick={startSession} style={styles.mainBtn}>
          {sessionStarted ? "Session In Progress 🚀" : "Start Today's Session"}
        </button>

        {/* AI Companion Suggestion */}
        {sessionStarted && (
          <div style={styles.aiBox}>
            <h4>💡 AI Companion Suggestion</h4>
            <p>{suggestNextStep()}</p>
            <p>Use Pomodoro: 25min study + 5min break. Stay consistent!</p>
            <p>Celebrate small wins to stay motivated 🎉</p>
          </div>
        )}

        {/* Rewards & Achievements */}
        {rewards.length > 0 && (
          <div style={styles.rewardsBox}>
            <h4>🏆 Achievements</h4>
            {rewards.map((r, idx) => (
              <p key={idx}>{r}</p>
            ))}
          </div>
        )}

        {/* Activity Log */}
        {activityLog.length > 0 && (
          <div style={styles.logBox}>
            <h4>📝 Activity Log</h4>
            {activityLog.map((a, idx) => (
              <p key={idx}>{a}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 30,
  },
  card: {
    width: "100%",
    maxWidth: 750,
    background: "#111827",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
    color: "#e0e0f0",
    fontFamily: "'Poppins', sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 20,
    color: "#22d3ee",
    textShadow: "0 0 8px #22d3ee",
  },
  dailyTip: {
    fontSize: 16,
    marginBottom: 20,
    color: "#a5f3fc",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 12,
    color: "#f0f9ff",
  },
  progressRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 16,
    background: "#374151",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 8,
    transition: "width 0.4s ease",
  },
  progressBtn: {
    padding: "4px 8px",
    borderRadius: 8,
    background: "#22d3ee",
    border: "none",
    color: "#0f172a",
    fontWeight: 600,
    cursor: "pointer",
  },
  mainBtn: {
    marginTop: 20,
    width: "100%",
    padding: 16,
    borderRadius: 16,
    background: "#22d3ee",
    color: "#0f172a",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    fontSize: 16,
  },
  aiBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    background: "#1e293b",
    border: "1px solid #22d3ee",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },
  rewardsBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    background: "#111827",
    border: "1px solid #22d3ee",
  },
  logBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    background: "#111827",
    border: "1px solid #3b82f6",
    maxHeight: 200,
    overflowY: "auto",
  },
};