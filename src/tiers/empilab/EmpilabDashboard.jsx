import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { updateUserActivity } from "../../utils/updateUserActivity";
import { generateDashboardAI } from "../../utils/dashboardAI";

/* ===============================
   Info Card - JARVIS GLASS NODE
================================ */
function InfoCard({ title, value }) {
  return (
    <motion.div
      whileHover={{
        y: -8,
        scale: 1.04,
        boxShadow: "0 0 30px rgba(0,200,255,0.4)",
      }}
      style={styles.infoCard}
    >
      <div style={styles.hudLine}></div>
      <p style={styles.infoTitle}>{title}</p>
      <h2 style={styles.infoValue}>{value}</h2>
    </motion.div>
  );
}

/* ===============================
   Feature Button - NEURAL NODE
================================ */
function FeatureButton({ label, icon, route, navigate, index }) {
  return (
    <motion.button
      onClick={() => navigate(route)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{
        scale: 1.06,
        boxShadow: "0 0 25px rgba(0,200,255,0.5)",
      }}
      style={styles.featureButton}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        style={styles.featureIcon}
      >
        {icon}
      </motion.div>
      {label}
    </motion.button>
  );
}

/* ===============================
   MAIN DASHBOARD (JARVIS CORE)
================================ */
export default function EmpiLabDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [intro, setIntro] = useState(true);

  const [userData, setUserData] = useState({});
  const [activity, setActivity] = useState(null);
  const [aiData, setAiData] = useState(null);

   const features = [
    { label: "Smart Mentor", icon: "🎧", route: "/empilab/smart-mentor" },
    { label: "Skill Hub", icon: "🧪", route: "/empilab/skill-hub" },
    { label: "Test Arena", icon: "🏟️", route: "/empilab/test-arena" },
    { label: "Smart Notes AI", icon: "🧾", route: "/empilab/notes-generator" },
    { label: "Career Direction", icon: "📈", route: "/empilab/career-detector" },
    { label: "AI Project Builder", icon: "📚", route: "/empilab/project-maker" },
    { label: "Performance Coach", icon: "📊", route: "/empilab/Performance-Coach" },
    { label: "Challenge Generator", icon: "⚡", route: "/empilab/Challenge-Generator" },
  ];

  /* ===============================
     DATA LOAD
  ================================= */
  useEffect(() => {
    async function init() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return navigate("/login");

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        const finalName =
          profile?.name ||
          user?.user_metadata?.full_name ||
          "Operator";

        const { count: projectCount } = await supabase
          .from("projects")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        const { count: aiCount } = await supabase
          .from("ai_sessions")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);

        const activityRes = await updateUserActivity(
          supabase,
          user.id,
          "empilab_dashboard"
        );

        setActivity(activityRes);

        setAiData(
          generateDashboardAI({
            current_streak: activityRes?.current_streak || 0,
            strictness_score: activityRes?.strictness_score || 0,
          })
        );

        setUserData({
          name: finalName,
          projects: projectCount || 0,
          aiUsed: aiCount || 0,
          studyHours: profile?.study_hours || 0,
        });

      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
        setTimeout(() => setIntro(false), 1500);
      }
    }

    init();
  }, []);

  /* ===============================
     JARVIS BOOT SCREEN
  ================================= */
  if (intro || loading) {
    return (
      <div style={styles.bootScreen}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={styles.coreRing}
        />

        <motion.h1
          animate={{ opacity: [0, 1, 0.6, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          JARVIS CORE ONLINE
        </motion.h1>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* ENERGY BACKGROUND ORBS */}
      <div style={styles.orb1}></div>
      <div style={styles.orb2}></div>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2>🧠 {userData.name}</h2>
          <p>EMPILAB NEURAL SYSTEM</p>
        </div>

        <div style={styles.status}>
          🔥 {activity?.current_streak || 0} DAYS ACTIVE
        </div>
      </div>

      {/* AI CORE PANEL */}
      <motion.div
        animate={{ boxShadow: ["0 0 10px #00c6ff", "0 0 25px #00c6ff"] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={styles.aiCore}
      >
        <h3>🤖 JARVIS CORE</h3>
        <p>{aiData?.title}</p>
        <small>{aiData?.action}</small>

        <div style={styles.scanLine}></div>
      </motion.div>

      {/* STATS GRID */}
      <div style={styles.grid}>
        <InfoCard title="PROJECTS" value={userData.projects} />
        <InfoCard title="AI SESSIONS" value={userData.aiUsed} />
        <InfoCard title="STUDY HOURS" value={userData.studyHours} />
      </div>

      {/* FEATURES */}
      <div style={styles.featureGrid}>
        {features.map((f, i) => (
          <FeatureButton key={i} {...f} index={i} navigate={navigate} />
        ))}
      </div>
    </div>
  );
}

/* ===============================
   STYLES - JARVIS UI SYSTEM
================================ */
const styles = {

  container: {
    minHeight: "100vh",
    padding: 30,
    color: "#e6f3ff",
    background:
      "radial-gradient(circle at top left, rgba(0,200,255,0.15), transparent 40%)," +
      "radial-gradient(circle at bottom right, rgba(0,120,255,0.12), transparent 50%)," +
      "#050b14",
    position: "relative",
    overflow: "hidden",
  },

  bootScreen: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    background: "black",
    color: "#00c6ff",
  },

  coreRing: {
    width: 120,
    height: 120,
    border: "2px solid #00c6ff",
    borderRadius: "50%",
    marginBottom: 20,
  },

  orb1: {
    position: "absolute",
    top: "10%",
    left: "10%",
    width: 250,
    height: 250,
    background: "rgba(0,200,255,0.12)",
    filter: "blur(80px)",
    borderRadius: "50%",
  },

  orb2: {
    position: "absolute",
    bottom: "10%",
    right: "10%",
    width: 280,
    height: 280,
    background: "rgba(0,120,255,0.1)",
    filter: "blur(90px)",
    borderRadius: "50%",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  status: {
    color: "#00c6ff",
    fontWeight: "bold",
  },

  aiCore: {
    padding: 24,
    borderRadius: 18,
    background: "rgba(0,50,100,0.25)",
    border: "1px solid rgba(0,200,255,0.2)",
    marginBottom: 25,
    position: "relative",
    overflow: "hidden",
  },

  scanLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: 2,
    background: "linear-gradient(90deg, transparent, #00c6ff, transparent)",
    animation: "scan 2s infinite",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: 20,
    marginBottom: 30,
  },

  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 15,
  },

  infoCard: {
    padding: 20,
    borderRadius: 14,
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(0,200,255,0.1)",
    position: "relative",
  },

  hudLine: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "40%",
    height: 2,
    background: "#00c6ff",
  },

  infoTitle: { opacity: 0.7 },
  infoValue: { fontSize: 22, color: "#00c6ff" },

  featureButton: {
    padding: 18,
    borderRadius: 14,
    background: "rgba(0,80,160,0.15)",
    border: "1px solid rgba(0,200,255,0.2)",
    color: "#e6f3ff",
    cursor: "pointer",
  },

  featureIcon: {
    fontSize: 26,
    marginBottom: 8,
  },
};