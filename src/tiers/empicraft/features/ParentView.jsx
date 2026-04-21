import React from "react";

export default function ParentViewLight({ userProgress }) {
  // Sample data fallback if no props passed
  const progress = userProgress || {
    xp: 1200,
    streakDays: 5,
    sessionsCompleted: 12,
    quizzesTaken: 4,
  };

  return (
    <div style={{
      border: "2px solid #27ae60",
      borderRadius: "12px",
      padding: "20px",
      maxWidth: "350px",
      backgroundColor: "#f0f9f5",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <h3 style={{ color: "#27ae60", marginBottom: "10px" }}>Parent View Light</h3>

      <p><strong>XP Earned:</strong> {progress.xp}</p>
      <p><strong>Current Streak:</strong> {progress.streakDays} days</p>
      <p><strong>Study Sessions Completed:</strong> {progress.sessionsCompleted}</p>
      <p><strong>Quizzes Taken:</strong> {progress.quizzesTaken}</p>
    </div>
  );
}
