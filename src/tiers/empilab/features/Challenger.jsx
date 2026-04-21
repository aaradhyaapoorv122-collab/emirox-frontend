import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../../../utils/api.js";

export default function ChallengeGenerator() {
  const challenges = [
    "Solve 5 AI Problems",
    "Complete 2 Study Sessions",
    "Revise 1 Chapter + Notes",
    "Build 1 Mini Project",
    "Take a Mock Test",
  ];

  const [current, setCurrent] = useState("Click Generate");

  const generateChallenge = async () => {
  try {
    setCurrent("🧠 AI is analyzing your performance...");

    const message = `
You are Challenge Generator AI inside Empirox.

Generate a DAILY PERSONALIZED CHALLENGE for the student.

Rules:
- Must depend on skill improvement
- Must include study + skill + thinking task
- Must be achievable in 1 day
- Must increase difficulty slightly if student is strong
- Must focus on weak areas if present

Output ONLY ONE challenge.

Format:
🎯 Challenge Title:
🧠 Task:
⏱ Duration:
🔥 Bonus XP condition:
`;

    const res = await api.sendAI({
      feature: "challenge_generator_ai",
      message,
      context: {
        mode: "daily_challenge",
      },
    });

    setCurrent(res);

  } catch (err) {
    setCurrent("⚠️ AI failed to generate challenge");
  }
};

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Challenge Generator</h1>

      {/* MAIN CARD */}
      <motion.div
        style={styles.card}
        whileHover={{ scale: 1.05, rotate: 1 }}
      >
        <motion.div
          style={styles.energyBG}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%"],
          }}
          transition={{ repeat: Infinity, duration: 2 }}
        />

        <h2 style={styles.challengeText}>{current}</h2>

        <motion.button
          onClick={generateChallenge}
          whileTap={{ scale: 0.9 }}
          style={styles.button}
        >
          Generate Challenge ⚡
        </motion.button>
      </motion.div>

      {/* EXTRA ACTION */}
      <motion.div style={styles.tipBox} whileHover={{ scale: 1.02 }}>
        💡 Tip: Complete daily challenges to boost XP faster
      </motion.div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    minHeight: "100vh",
    padding: 40,
    background: "linear-gradient(135deg, #081520, #0c2538)",
    color: "#fff",
    fontFamily: "Inter",
    textAlign: "center",
  },
  title: {
    fontSize: 28,
    marginBottom: 40,
  },
  card: {
    position: "relative",
    margin: "auto",
    width: 320,
    height: 320,
    borderRadius: 25,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #132b45, #0d1f33)",
    boxShadow: "0 20px 60px rgba(255,200,0,0.3)",
  },
  energyBG: {
    position: "absolute",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(45deg, rgba(255,255,0,0.2), transparent, rgba(255,255,0,0.2))",
    zIndex: 0,
  },
  challengeText: {
    position: "relative",
    zIndex: 1,
    marginBottom: 20,
  },
  button: {
    position: "relative",
    zIndex: 1,
    padding: "12px 22px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #ffdd00, #ffc700)",
    cursor: "pointer",
    fontWeight: 700,
  },
  tipBox: {
    marginTop: 40,
    padding: 20,
    borderRadius: 16,
    background: "rgba(20,40,70,0.7)",
  },
};