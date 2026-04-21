import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "../context/AuthContext";
import { startRazorpayPayment } from "@/utils/payment";

export default function TierSelector() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);

  const [user, setLocalUser] = useState(null);

  useEffect(() => {
    async function getUser() {
      const { data } = await supabase.auth.getUser();
      setLocalUser(data?.user);
    }
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>Choose Your Power</h1>
        <p style={styles.subtitle}>
          Start free with EmpiCraft or unlock full AI power with EmpiLab ⚡
        </p>
      </div>

      <div style={styles.grid}>

        {/* 🆓 EMPICRAFT */}
        <div style={{ ...styles.card, ...styles.craft }}>
          <h2 style={styles.cardTitle}>EmpiCraft</h2>

          <p style={styles.tagline}>
            Free Learning Engine • 15 AI Uses / Day
          </p>

          <div style={styles.section}>
            <p style={styles.sectionTitle}>Core Tools</p>
            <ul style={styles.list}>
              <li>Smart Chat</li>
              <li>Study Planner</li>
              <li>Quiz Arena</li>
              <li>Concept Builder</li>
              <li>AI Summary</li>
              <li>Test Review</li>
            </ul>
          </div>

          <div style={styles.section}>
            <p style={styles.sectionTitle}>AI Features</p>
            <ul style={styles.list}>
              <li>🔥 AI Doubt Resolver</li>
              <li>🔥 AI Study Companion</li>
            </ul>
          </div>

          <button
            style={styles.freeBtn}
            onClick={() => navigate("/Empicraft/Dashboard")}
          >
            Start Free →
          </button>
        </div>

        {/* ⚡ EMPILAB */}
        <div style={{ ...styles.card, ...styles.lab }}>

          <div style={styles.premiumBadge}>⚡ PREMIUM</div>

          <h2 style={styles.labTitle}>EmpiLab</h2>

          <p style={styles.labTagline}>
            Advanced AI Intelligence System
          </p>

          <div style={styles.priceBox}>
            ₹149 / month <br />
            <span style={{ opacity: 0.7 }}>₹1199 / year (Best Value)</span>
          </div>

          <div style={styles.section}>
            <p style={styles.sectionTitle}>Full AI Suite</p>
            <ul style={styles.list}>
              <li>♾ Unlimited AI Access</li>
              <li>🎙 Smart Mentor</li>
              <li>🧪 Skill Hub</li>
              <li>🏟 Test Arena</li>
              <li>🧾 Smart Notes AI</li>
              <li>📈 Career AI</li>
              <li>📚 Project Builder</li>
              <li>📊 Performance Coach</li>
              <li>⚡ Challenge Generator</li>
            </ul>
          </div>

          <div style={styles.btnColumn}>

            <button
              style={styles.monthBtn}
              onClick={() => startRazorpayPayment(user, "monthly")}
            >
              ⚡ Pay ₹149 / month
            </button>

            <button
              style={styles.yearBtn}
              onClick={() => startRazorpayPayment(user, "yearly")}
            >
              💎 Pay ₹1199 / year
            </button>

          </div>

        </div>
      </div>

      {/* LOGOUT */}
      <div style={{ textAlign: "center", marginTop: 30 }}>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

/* =========================
   STYLES (FINAL UI SYSTEM)
========================= */

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px",
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(135deg, #eef2ff, #ffffff)",
  },

  header: {
    textAlign: "center",
    marginBottom: "50px",
  },

  title: {
    fontSize: "36px",
    fontWeight: "800",
  },

  subtitle: {
    opacity: 0.7,
    marginTop: "10px",
  },

  grid: {
    display: "flex",
    gap: "40px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  card: {
    width: "340px",
    padding: "30px",
    borderRadius: "20px",
    transition: "0.3s",
    position: "relative",
  },

  craft: {
    background: "#ffffff",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },

  lab: {
    background: "linear-gradient(145deg, #0a0f1f, #141a33)",
    color: "#e6f3ff",
    boxShadow: "0 0 40px rgba(138, 43, 226, 0.4)",
    transform: "scale(1.05)",
    border: "1px solid rgba(138, 43, 226, 0.2)",
  },

  cardTitle: {
    fontSize: "24px",
    fontWeight: "bold",
  },

  labTitle: {
    fontSize: "26px",
    fontWeight: "bold",
  },

  tagline: {
    opacity: 0.7,
    marginBottom: "15px",
  },

  labTagline: {
    opacity: 0.8,
    marginBottom: "15px",
  },

  section: {
    marginBottom: "20px",
  },

  sectionTitle: {
    fontWeight: "600",
    marginBottom: "8px",
    opacity: 0.8,
  },

  list: {
    textAlign: "left",
    lineHeight: "1.8",
    paddingLeft: "15px",
  },

  priceBox: {
    marginBottom: "15px",
    fontWeight: "bold",
    fontSize: "18px",
  },

  premiumBadge: {
    position: "absolute",
    top: "-10px",
    right: "20px",
    background: "gold",
    color: "black",
    padding: "5px 10px",
    borderRadius: "10px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  freeBtn: {
    marginTop: "10px",
    background: "#0077ff",
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    width: "100%",
    fontWeight: "bold",
  },

  btnColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "10px",
  },

  monthBtn: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#fff",
    background: "linear-gradient(90deg, #8e2de2, #4a00e0)",
    boxShadow: "0 10px 25px rgba(142, 45, 226, 0.4)",
  },

  yearBtn: {
    padding: "14px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#fff",
    background: "linear-gradient(90deg, #ff416c, #ff4b2b)",
    boxShadow: "0 10px 25px rgba(255, 75, 43, 0.3)",
  },

  logoutBtn: {
    background: "#ff4d4f",
    color: "white",
    padding: "12px 25px",
    fontWeight: "bold",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: 16,
  },
};