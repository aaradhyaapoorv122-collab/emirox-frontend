import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabaseClient";
import { updateUserActivity } from "../../utils/updateUserActivity";
import { generateDashboardAI } from "../../utils/dashboardAI";

/* ===============================
   Info Card - Floating Glass
================================ */
function InfoCard({ title, value }) {
  return (
    <motion.div
      whileHover={{
        y: -10,
        scale: 1.05,
        boxShadow: "0 25px 60px rgba(0,200,255,0.35)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={styles.infoCard}
    >
      <p style={styles.infoTitle}>{title}</p>
      <h2 style={styles.infoValue}>{value}</h2>
    </motion.div>
  );
}

/* ===============================
   Feature Button
================================ */
function FeatureButton({ label, icon, route, navigate, index }) {
  return (
    <motion.button
      onClick={() => navigate(route)}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      whileHover={{
        scale: 1.08,
        boxShadow: "0 20px 50px rgba(0,180,255,0.45)",
      }}
      whileTap={{ scale: 0.95 }}
      style={styles.featureButton}
    >
      <motion.span
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
        style={styles.featureIcon}
      >
        {icon}
      </motion.span>
      <span>{label}</span>
    </motion.button>
  );
}

/* ===============================
   Dashboard
================================ */
export default function EmpiLabDashboard() {
  const navigate = useNavigate();

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
    { label: "Performance Coach", icon: "📊", route: "/empilab/performance-coach" },
    { label: "Challenge Generator", icon: "⚡", route: "/empilab/challenge-generator" },
  ];

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }
      const { data: profile } = await supabase
  .from("profiles")
  .select("tier, subscription_status, name")
  .eq("id", user.id)
  .single();


      
      // PROJECT COUNT
      const { count } = await supabase
        .from("projects")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // 🔥 ACTIVITY SYSTEM
      const activityRes = await updateUserActivity(
        supabase,
        user.id,
        "empilab_dashboard"
      );

      setActivity(activityRes);

      // 🤖 AI BRAIN
      const ai = generateDashboardAI({
        current_streak: activityRes?.current_streak || 0,
        strictness_score: activityRes?.strictness_score || 0,
        last_feature_used: activityRes?.last_feature_used,
      });

      setAiData(ai);

      setUserData({
        name: profile?.name || user.email,
        studyHours: profile?.study_hours || 5,
        projects: count || 0,
        career: profile?.career_goal || "Explorer",
        testScore: profile?.last_score || 0,
      });
    }

    loadData();
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.particleBG}></div>

      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.userBlock}>
          <div style={styles.avatar}></div>
          <div>
            <div style={styles.userName}>{userData.name}</div>
            <div style={styles.userSub}>EmpiLab Premium</div>
          </div>
        </div>

        <div style={styles.headerStats}>
          🔥 {activity?.current_streak || 0} days
          <span>{userData.projects} Projects</span>
        </div>
      </header>

      {/* BACK */}
      <button
        style={{
          ...styles.primaryButton,
          marginBottom: 40,
          background: "linear-gradient(90deg, #FF416C, #FF4B2B)",
        }}
        onClick={() => navigate("/tier-selector")}
      >
        ← Back
      </button>

      {/* 🤖 AI FOCUS (REPLACED MENTOR) */}
      <motion.section style={styles.mentorSection}>
        <div>
          <h2 style={styles.mentorTitle}>🤖 AI Focus</h2>
          <h3>{aiData?.title}</h3>
          <p>{aiData?.action}</p>
          <p style={{ opacity: 0.7 }}>{aiData?.insight}</p>
        </div>

        <motion.button
          onClick={() => navigate("/empilab/smart-mentor")}
          style={styles.primaryButton}
        >
          Start →
        </motion.button>
      </motion.section>

      {/* ⚡ STRICTNESS */}
      <motion.section style={styles.infoCard}>
        <p style={styles.infoTitle}>Discipline Score</p>
        <h2 style={styles.infoValue}>
          {activity?.strictness_score || 0}
        </h2>
        <p>{getStrictnessLabel(activity?.strictness_score)}</p>

        <div style={styles.progressBg}>
          <div
            style={{
              ...styles.progressFill,
              width: `${activity?.strictness_score || 0}%`,
            }}
          />
        </div>
      </motion.section>

      {/* ANALYTICS */}
      <section style={styles.analyticsGrid}>
        <InfoCard title="Study Hours" value={`${userData.studyHours} hrs`} />
        <InfoCard title="Test Score" value={`${userData.testScore}%`} />
        <InfoCard title="Career" value={userData.career} />
      </section>

      {/* FEATURES */}
      <section style={styles.featureGrid}>
        {features.map((item, idx) => (
          <FeatureButton key={item.label} index={idx} {...item} navigate={navigate} />
        ))}
      </section>
    </div>
  );
}

/* ===============================
   LABEL
================================ */
function getStrictnessLabel(score = 0) {
  if (score >= 80) return "🔥 Elite";
  if (score >= 50) return "⚡ Improving";
  if (score >= 20) return "🟢 Building";
  return "⚠️ Weak";
}


/* ===============================
   STYLES (UNCHANGED)
================================ */
const styles = {
  container: {
    minHeight: "100vh",
    padding: 32,
    background: "linear-gradient(135deg, #081520, #0c2538)",
    color: "#e6f3ff",
    fontFamily: "Inter, sans-serif",
    position: "relative",
    overflowX: "hidden",
  },
  particleBG: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "radial-gradient(circle, rgba(0,50,100,0.05) 1px, transparent 1px), radial-gradient(circle, rgba(0,50,100,0.05) 1px, transparent 1px)",
    backgroundSize: "50px 50px",
    zIndex: 0,
    pointerEvents: "none",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
    position: "relative",
    zIndex: 1,
  },
  userBlock: {
    display: "flex",
    alignItems: "center",
    gap: 14,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #4ea0ff, #00c6ff)",
    boxShadow: "0 5px 25px rgba(0,200,255,0.3)",
  },
  userName: { fontWeight: 700, fontSize: 16 },
  userSub: { fontSize: 12, opacity: 0.7 },
  headerStats: { display: "flex", gap: 22, fontSize: 13, opacity: 0.85 },
  mentorSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(20,40,70,0.7)",
    padding: 34,
    borderRadius: 24,
    backdropFilter: "blur(16px)",
    boxShadow: "0 18px 55px rgba(0,120,255,0.25)",
    marginBottom: 40,
    position: "relative",
    zIndex: 1,
  },
  mentorTitle: { marginBottom: 8, fontSize: 20, fontWeight: 600 },
  mentorStatus: { opacity: 0.75, fontSize: 14 },
  primaryButton: {
    padding: "16px 36px",
    borderRadius: 18,
    border: "none",
    background: "linear-gradient(135deg, #4ea0ff, #00c6ff)",
    color: "#002347",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  },
  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 26,
    marginBottom: 40,
    position: "relative",
    zIndex: 1,
  },
  infoCard: {
    padding: 28,
    borderRadius: 22,
    background: "rgba(15,30,55,0.78)",
    backdropFilter: "blur(14px)",
    boxShadow: "0 12px 35px rgba(0,120,255,0.22)",
    cursor: "default",
  },
  infoTitle: { fontSize: 14, opacity: 0.65, marginBottom: 10 },
  infoValue: { fontSize: 28, fontWeight: 700 },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 24,
    position: "relative",
    zIndex: 1,
  },
  featureButton: {
    padding: 26,
    borderRadius: 22,
    border: "none",
    background: "linear-gradient(145deg, #132b45, #0d1f33)",
    color: "#d4ecff",
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 14,
    transition: "all 0.3s ease",
    boxShadow: "0 10px 30px rgba(0,120,255,0.25)",
  },
  featureIcon: {
    fontSize: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
}