import React, { createContext, useContext, useState, useEffect } from "react";

const XPContext = createContext();

export const useXP = () => useContext(XPContext);

const XPProvider = ({ children }) => {
  const [xp, setXP] = useState({
    total: 120,
    level: 2,
  });

  // Track user streaks (example: days in a row)
  const [streak, setStreak] = useState(0);

  // Call this whenever user does something good for XP
  const addXP = (amount, reason = "activity") => {
    setXP((prev) => {
      const newTotal = prev.total + amount;
      const newLevel = Math.floor(newTotal / 100) + 1;
      console.log(`Added ${amount} XP for ${reason}. Total XP: ${newTotal}`);
      return { total: newTotal, level: newLevel };
    });
  };

  // Example: call this when user completes an achievement
  const achievementUnlocked = (achievementName) => {
    // You can assign XP by achievement type
    const xpReward = 50; // example fixed XP for achievement
    addXP(xpReward, `achievement: ${achievementName}`);
  };

  // Example: call this daily to update streak and reward XP
  const updateStreak = (didStudyToday) => {
    if (didStudyToday) {
      setStreak((prev) => {
        const newStreak = prev + 1;
        // Reward more XP for longer streaks
        const streakXp = 10 + newStreak * 2;
        addXP(streakXp, `study streak: ${newStreak} days`);
        return newStreak;
      });
    } else {
      // Reset streak if missed a day
      setStreak(0);
    }
  };

  // Example: call this when user completes a project
  const projectCompleted = (projectName) => {
    const xpReward = 100; // projects give higher XP
    addXP(xpReward, `project completed: ${projectName}`);
  };

  // Example: call this when user improves their quiz/test score
  const scoreImproved = (oldScore, newScore) => {
    const diff = newScore - oldScore;
    if (diff > 0) {
      const xpReward = diff * 5; // 5 XP per point improved
      addXP(xpReward, `score improved by ${diff}`);
    }
  };

  // For demonstration, a simple auto streak update every 24 hours (can be triggered externally)
  /*
  useEffect(() => {
    const dailyCheck = setInterval(() => {
      // Here, you could check if user studied today from your app state
      const studiedToday = true; // replace with real check
      updateStreak(studiedToday);
    }, 86400000); // 24 hours in ms

    return () => clearInterval(dailyCheck);
  }, []);
  */

  return (
    <XPContext.Provider
      value={{
        xp,
        addXP,
        achievementUnlocked,
        updateStreak,
        projectCompleted,
        scoreImproved,
        streak,
      }}
    >
      {children}
    </XPContext.Provider>
  );
};

const GlobalXPBar = () => {
  const { xp } = useXP();

  const progress = xp.total % 100;

  return (
    <div style={styles.wrapper}>
      <span style={styles.star}>⭐</span>
      <span style={styles.level}>Lv {xp.level}</span>

      <div style={styles.bar}>
        <div style={{ ...styles.fill, width: `${progress}%` }} />
      </div>

      <span style={styles.xp}>{xp.total} XP</span>
    </div>
  );
};

export default function XPSystem({ children }) {
  return (
    <XPProvider>
      <GlobalXPBar />
      {children}
    </XPProvider>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    top: 14,
    right: 18,
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "linear-gradient(135deg,#0f172a,#1e293b)",
    padding: "8px 14px",
    borderRadius: 24,
    color: "#e5e7eb",
    fontSize: 13,
    zIndex: 999,
    boxShadow: "0 6px 16px rgba(0,0,0,0.35)",
  },
  star: { fontSize: 16 },
  level: { fontWeight: 600 },
  bar: {
    width: 70,
    height: 6,
    background: "#334155",
    borderRadius: 10,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    background: "linear-gradient(90deg,#6366f1,#22d3ee)",
    transition: "width 0.4s ease",
  },
  xp: { opacity: 0.8 },
};
