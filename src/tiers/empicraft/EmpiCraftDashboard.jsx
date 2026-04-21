import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { updateUserActivity } from "../../utils/updateUserActivity";
import { generateDashboardAI } from "../../utils/dashboardAI";

export default function EmpiCraftDashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [standard, setStandard] = useState("");

  const [activityData, setActivityData] = useState(null);
  const [dailyData, setDailyData] = useState(null);
  const [aiData, setAiData] = useState(null);

  useEffect(() => {
    async function init() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      // 👤 PROFILE
      const { data: profile } = await supabase
        .from("profiles")
        .select("name, standard")
        .eq("id", user.id)
        .single();

      setUserName(profile?.name || user.email || "User");
      setStandard(profile?.standard || "");

      // 🔥 UPDATE ACTIVITY
      const result = await updateUserActivity(
        supabase,
        user.id,
        "dashboard"
      );

      setActivityData(result);

      // 📊 GET TODAY USAGE
      const today = new Date().toISOString().split("T")[0];

      const { data: daily } = await supabase
        .from("daily_activity")
        .select("feature_usage")
        .eq("user_id", user.id)
        .eq("date", today)
        .single();

      setDailyData(daily);

      // 🧠 GENERATE AI
      const ai = generateDashboardAI({
        current_streak: result?.current_streak || 0,
        strictness_score: result?.strictness_score || 0,
        feature_usage: daily?.feature_usage || {},
        last_feature_used: result?.last_feature_used,
      });

      setAiData(ai);

      setLoading(false);
    }

    init();
  }, [navigate]);
  const getStrictnessData = (score) => {
  if (score >= 80) return { label: "🔥 Very Strict", color: "red" };
  if (score >= 60) return { label: "⚡ Strict", color: "orange" };
  if (score >= 40) return { label: "🙂 Balanced", color: "blue" };
  if (score >= 20) return { label: "😌 Relaxed", color: "green" };

  return { label: "😴 Very Relaxed", color: "gray" };
};
  if (loading) {
    return <div style={styles.loading}>🚀 Loading your dashboard...</div>;
  }

  return (
    <div style={styles.page}>
      
      {/* 🔝 HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.welcome}>Welcome, {userName} 👋</h2>
          <p style={styles.subText}>{standard}</p>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.streak}>
            🔥 {activityData?.current_streak || 0} days
          </div>

          <button
            style={styles.backBtn}
            onClick={() => navigate("/tier-selector")}
          >
            ⬅ Back
          </button>
        </div>
      </div>

      {/* ⚡ DISCIPLINE */}
      <div style={styles.card}>
        <h3>⚡ Discipline Score</h3>
        <p style={styles.bigText}>
          {activityData?.strictness_score || 0}
        </p>
        <p>{getStrictnessLabel(activityData?.strictness_score)}</p>

        {/* ✅ SHOW ONLY AFTER DAY 1 */}
        {activityData?.current_streak > 1 && (
          <div style={{ marginTop: 10 }}>
            <p>Discipline Progress</p>
            <div style={styles.progressBg}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${activityData.strictness_score}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 🤖 AI FOCUS (MAIN INTELLIGENCE) */}
      <div style={styles.focusCard}>
        <div>
          <h3>🤖 AI Focus Today</h3>
          <h4>{aiData?.title}</h4>
          <p>{aiData?.action}</p>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            {aiData?.insight}
          </p>
        </div>

        <button
          style={styles.primaryBtn}
          onClick={() => navigate("/empicraft/smart-chat")}
        >
          Start →
        </button>
      </div>

      {/* 🚀 MAIN FEATURES */}
      <h3 style={styles.sectionTitle}>🚀 Main Actions</h3>
      <div style={styles.grid}>
        {[
          { label: "Smart Chat", icon: "🧠", route: "/empicraft/smart-chat" },
          { label: "Planner", icon: "📅", route: "/empicraft/study-planner" },
          { label: "Quiz", icon: "🎯", route: "/empicraft/quiz-arena" },
          { label: "Test Review", icon: "📊", route: "/empicraft/test-review" },
        ].map((f) => (
          <div
            key={f.label}
            onClick={() => navigate(f.route)}
            style={styles.featureCard}
          >
            <div style={styles.icon}>{f.icon}</div>
            <p>{f.label}</p>
          </div>
        ))}
      </div>

      {/* 🛠️ TOOLS */}
      <h3 style={styles.sectionTitle}>🛠️ Tools</h3>
      <div style={styles.grid}>
        {[
          { label: "Concept", icon: "🧱", route: "/empicraft/concept-block-builder" },
          { label: "Summary", icon: "📄", route: "/empicraft/AI-Summary-Mode" },
          { label: "Doubt Solver", icon: "❓", route: "/empicraft/doubt-solver" },
          { label: "AI Companion", icon: "🤖", route: "/empicraft/study-companion" },
        ].map((f) => (
          <div
            key={f.label}
            onClick={() => navigate(f.route)}
            style={styles.featureCardSecondary}
          >
            <div style={styles.icon}>{f.icon}</div>
            <p>{f.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🔥 LABEL
function getStrictnessLabel(score = 0) {
  if (score >= 80) return "🔥 Highly Consistent";
  if (score >= 50) return "⚡ Improving";
  if (score >= 20) return "🟢 Getting Started";
  return "⚠️ Needs Focus";
}

// 🎨 STYLES
const styles = {
  page: {
    minHeight: "100vh",
    padding: "25px",
    fontFamily: "Segoe UI, sans-serif",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "white",
  },

  loading: {
    padding: 50,
    textAlign: "center",
    color: "white",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
  },

  headerRight: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  welcome: {
    fontSize: "24px",
  },

  subText: {
    opacity: 0.7,
    fontSize: "14px",
  },

  streak: {
    background: "rgba(255,255,255,0.1)",
    padding: "6px 12px",
    borderRadius: "10px",
  },

  backBtn: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    background: "rgba(255,255,255,0.15)",
    color: "white",
  },

  card: {
    padding: "18px",
    borderRadius: "14px",
    marginBottom: "20px",
    background: "rgba(255,255,255,0.08)",
  },

  bigText: {
    fontSize: "26px",
    fontWeight: "bold",
  },

  progressBg: {
    height: "8px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "linear-gradient(90deg, #00f260, #0575e6)",
  },

  focusCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "25px",
    background: "rgba(255,255,255,0.1)",
  },

  primaryBtn: {
    background: "linear-gradient(90deg, #00f260, #0575e6)",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },

  sectionTitle: {
    margin: "20px 0 10px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px,1fr))",
    gap: "16px",
    marginBottom: "20px",
  },

  featureCard: {
    padding: "16px",
    borderRadius: "16px",
    textAlign: "center",
    cursor: "pointer",
    background: "rgba(255,255,255,0.1)",
  },

  featureCardSecondary: {
    padding: "16px",
    borderRadius: "16px",
    textAlign: "center",
    cursor: "pointer",
    background: "rgba(255,255,255,0.05)",
  },

  icon: {
    fontSize: "26px",
    marginBottom: "6px",
  },
};