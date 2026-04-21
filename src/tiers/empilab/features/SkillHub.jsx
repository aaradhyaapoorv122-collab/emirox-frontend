import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import api from "../../../utils/api.js";
/* ================= TRENDING SKILLS ================= */
const TRENDING_SKILLS = [
  { name: "Critical Thinking", color: "#ff6ec7" },
  { name: "Python Coding", color: "#00f0ff" },
  { name: "Public Speaking", color: "#ff9f43" },
  { name: "Creative Writing", color: "#a78bfa" },
  { name: "Data Analysis", color: "#00ff9f" },
];

/* ================= COMPONENT ================= */
export default function SkillHubProPlusAI() {
  const [search, setSearch] = useState("");
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [subSkills, setSubSkills] = useState([]);
  const [progress, setProgress] = useState({});
  const [selectedTime, setSelectedTime] = useState(30);
  const [schedule, setSchedule] = useState(null);
  const [aiThinking, setAiThinking] = useState(false);

  /* === AI Teaching Chat === */
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);

  /* ===== AI SEARCH & PATH ===== */
 const handleSearch = async () => {
  if (!search.trim()) return;

  setAiThinking(true);
  setSchedule(null);
  setMessages([]);
  setSelectedSkill(null);

  try {
    const res = await api.sendAI({
      feature: "skill_hub_ai",
      message: `
You are Skill Intelligence + Teaching AI.

TASK:
1. Create learning roadmap for skill: ${search}
2. Adjust difficulty for student level
3. Suggest career path using this skill
4. Break into 4 levels:
   - Basics
   - Intermediate
   - Advanced
   - Job Ready

OUTPUT FORMAT:

📘 SKILL ROADMAP
- Basics:
- Intermediate:
- Advanced:
- Job Ready:

🎯 CAREER PATH:
- Jobs:
- Future scope:

🔥 FIRST LESSON:
Explain Basics step by step like teacher.
      `,
      context: {
        level: "student",
        mode: "teaching_arena"
      }
    });

    setSelectedSkill({ name: search });

    setMessages([
      {
        from: "ai",
        text: res
      }
    ]);

    setSubSkills([]); // AI handles structure now
  } catch (err) {
    setMessages([
      { from: "ai", text: "⚠️ AI failed to generate roadmap" }
    ]);
  }

  setAiThinking(false);
};
  

  /* ===== AI SCHEDULE GENERATION ===== */
  const generateSchedule = async () => {
  setAiThinking(true);

  try {
    const res = await api.sendAI({
      feature: "skill_hub_ai",
      message: `
Create a personalized 7-day mastery plan for: ${selectedSkill?.name}

Include:
- daily learning steps
- practice tasks
- revision
- mini project
- career alignment

Also ensure:
- difficulty increases daily
- focus on real-world skills
      `,
      context: {
        time_per_day: selectedTime,
        mode: "career_learning"
      }
    });

    setSchedule(res);
  } catch (err) {
    setSchedule("⚠️ Failed to generate schedule");
  }

  setAiThinking(false);
};
  /* ===== USER DOUBT INPUT ===== */
const handleUserDoubt = async (doubt) => {
  if (!doubt.trim()) return;

  setMessages((prev) => [...prev, { from: "user", text: doubt }]);

  try {
    const res = await api.sendAI({
      feature: "skill_hub_ai",
      message: `
You are a strict but friendly teacher.

Student is learning: ${selectedSkill?.name}

Doubt:
${doubt}

Explain:
- simple steps
- real example
- mini practice question
      `,
      context: {
        mode: "teaching_arena"
      }
    });

    setMessages((prev) => [
      ...prev,
      { from: "ai", text: res }
    ]);
  } catch (err) {
    setMessages((prev) => [
      ...prev,
      { from: "ai", text: "⚠️ AI error while answering doubt" }
    ]);
  }
};
  const resetHub = () => {
    setSelectedSkill(null);
    setSubSkills([]);
    setSchedule(null);
    setSearch("");
    setSelectedTime(30);
    setProgress({});
    setMessages([]);
  };

  /* ===== PROGRESS UPDATE ===== */
  const updateProgress = (skill) => {
    setProgress((prev) => ({
      ...prev,
      [skill]: Math.min(prev[skill] + 25, 100),
    }));
    // Auto next AI lesson
    const currentIndex = subSkills.indexOf(skill);
    if (currentIndex + 1 < subSkills.length) {
      const nextSkill = subSkills[currentIndex + 1];
      setMessages((prev) => [...prev, { from: "ai", text: `🎯 Next up: ${nextSkill}. Let's dive in!` }]);
    } else {
      setMessages((prev) => [...prev, { from: "ai", text: `🏆 Congrats! You've completed the learning path for ${selectedSkill.name}.` }]);
    }
  };

  /* ===== AUTO SCROLL CHAT ===== */
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  return (
    <div style={ui.wrapper}>
      <div style={ui.container}>
        {/* HEADER */}
        <div style={ui.header}>
          {(selectedSkill || schedule) && (
            <button style={ui.backBtn} onClick={resetHub}>
              <FaArrowLeft /> Back
            </button>
          )}
          <h1 style={ui.title}>Skill Development Hub</h1>
          <p style={ui.subtitle}>
            AI-guided learning · Pro-level efficiency · Master your skills
          </p>
        </div>

        {/* SEARCH & TRENDING */}
        {!selectedSkill && !schedule && (
          <div style={ui.searchSection}>
            <div style={ui.searchBox}>
              <input
                style={ui.searchInput}
                placeholder="Search skill you want to master..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <button style={ui.searchBtn} onClick={handleSearch}>
                <FaSearch />
              </button>
            </div>
            <p style={ui.trendText}>Trending & Effective Skills:</p>
            <div style={ui.trendingGrid}>
              {TRENDING_SKILLS.map((s) => (
                <div
                  key={s.name}
                  style={{ ...ui.trendCard, borderColor: s.color }}
                  onClick={() => {
                    setSearch(s.name);
                    handleSearch();
                  }}
                >
                  {s.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SKILL PATH */}
        {selectedSkill && !schedule && !aiThinking && (
          <div style={ui.treeBox}>
            <p style={ui.pathText}>
              Skill Path · {selectedSkill.name}
            </p>

            <div style={ui.subSkillList}>
              {subSkills.map((s, i) => (
                <div key={i} style={ui.subSkillCard}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>🌿 {s}</span>
                    <span>{progress[s]}%</span>
                  </div>
                  <div style={ui.progressBarWrapper}>
                    <div
                      style={{
                        ...ui.progressBar,
                        width: `${progress[s]}%`,
                        background: `linear-gradient(90deg, #ff6ec7, #22d3ee)`,
                      }}
                    />
                  </div>
                  <button
                    style={ui.completeBtn}
                    onClick={() => updateProgress(s)}
                  >
                    Mark +25% Complete
                  </button>
                </div>
              ))}
            </div>

            <div style={ui.timeBox}>
              <p style={ui.timeText}>
                Session Duration (15–60 min)
              </p>
              <input
                type="range"
                min="15"
                max="60"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                style={ui.slider}
              />
              <p style={ui.timeValue}>{selectedTime} min per session</p>
            </div>

            <button style={ui.primaryBtn} onClick={generateSchedule}>
              Let AI Generate Learning Plan
            </button>
          </div>
        )}

        {/* AI THINKING */}
        {aiThinking && (
          <div style={ui.aiBox}>
            🧠 AI is analyzing skill structure and creating a personalized learning plan…
          </div>
        )}

        {/* AI SCHEDULE */}
        
            {/* AI SCHEDULE */}
{Array.isArray(schedule) && schedule.length > 0 && (
  <div style={ui.scheduleBox}>
    <p style={ui.pathText}>AI-Generated Learning Schedule</p>

    {schedule.map((s, index) => (
      <div key={s.day || index} style={ui.scheduleItem}>
        <span>Day {s.day}</span>
        <span>{s.skill}</span>
        <span>{s.duration} min</span>
      </div>
    ))}
  


            {/* AI TEACHING CONSOLE */}
            <div style={ui.chatWrapper}>
              <p style={ui.consoleTitle}>AI Teaching Console</p>
              <div style={ui.chatArea} ref={chatRef}>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    style={m.from === "user" ? ui.messageUser : ui.messageAI}
                  >
                    {m.text}
                  </div>
                ))}
              </div>
              <div style={ui.chatInputArea}>
                <input
                  style={ui.chatInput}
                  placeholder="Ask a doubt (AI will guide you)…"
                  onKeyDown={(e) => e.key === "Enter" && handleUserDoubt(e.target.value)}
                />
              </div>
            </div>

            <button style={ui.secondaryBtn} onClick={resetHub}>
              Back to Skill Hub
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= UI / UX ================= */
const ui = {
  wrapper: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, #ff6ec7, #22d3ee 70%, #ff9f43 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    fontFamily: "Inter, sans-serif",
    color: "#e5e7eb",
    padding: 30,
  },
  container: {
    width: 1100,
    padding: 36,
    borderRadius: 28,
    background: "rgba(6,8,20,0.95)",
    boxShadow: "0 80px 200px rgba(0,0,0,0.95)",
    display: "flex",
    flexDirection: "column",
    gap: 24,
  },
  header: { display: "flex", flexDirection: "column", gap: 6 },
  title: { fontSize: 34, fontWeight: 700 },
  subtitle: { fontSize: 16, color: "#f0f0ff" },
  backBtn: {
    border: "none",
    background: "transparent",
    color: "#f0f0ff",
    cursor: "pointer",
    marginBottom: 8,
    fontWeight: 500,
    fontSize: 14,
  },
  searchSection: { display: "flex", flexDirection: "column", gap: 16 },
  searchBox: { position: "relative" },
  searchInput: {
    padding: "16px 18px",
    borderRadius: 22,
    border: "1.5px solid #ffffff44",
    background: "#1e293b",
    color: "#f0f0ff",
    fontSize: 15,
    outline: "none",
    width: "100%",
  },
  searchBtn: {
    position: "absolute",
    right: 8,
    top: 8,
    padding: "10px 14px",
    borderRadius: 16,
    border: "none",
    background: "#ff6ec7",
    color: "#fff",
    cursor: "pointer",
    fontSize: 14,
  },
  trendText: { fontSize: 14, color: "#f0f0ff", marginBottom: 6 },
  trendingGrid: { display: "flex", gap: 12, flexWrap: "wrap" },
  trendCard: {
    padding: "10px 16px",
    borderRadius: 20,
    border: "2px solid",
    cursor: "pointer",
    background: "rgba(255,255,255,0.05)",
    transition: "all 0.3s",
    fontWeight: 500,
  },
  treeBox: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 22,
    padding: 26,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  pathText: { fontSize: 16, color: "#f0f0ff", marginBottom: 12 },
  subSkillList: { display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 16 },
  subSkillCard: {
    padding: 16,
    borderRadius: 18,
    background: "rgba(15,23,42,0.85)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  progressBarWrapper: { width: "100%", height: 8, borderRadius: 6, background: "#334155", overflow: "hidden" },
  progressBar: { height: 8, borderRadius: 6 },
  completeBtn: {
    padding: 8,
    borderRadius: 12,
    border: "none",
    background: "#ff9f43",
    color: "#020617",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 13,
    alignSelf: "flex-start",
  },
  timeBox: { marginBottom: 20 },
  timeText: { fontSize: 14, marginBottom: 6 },
  slider: { width: "100%" },
  timeValue: { fontSize: 13, color: "#f0f0ff", marginTop: 4 },
  primaryBtn: {
    width: "100%",
    padding: 16,
    borderRadius: 20,
    border: "none",
    background: "linear-gradient(135deg,#ff6ec7,#22d3ee,#ff9f43)",
    color: "#020617",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 15,
  },
  aiBox: { padding: 40, textAlign: "center", fontSize: 16, color: "#f0f0ff" },
  scheduleBox: {
    background: "rgba(255,255,255,0.05)",
    borderRadius: 22,
    padding: 26,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  scheduleItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 14,
    background: "rgba(15,23,42,0.85)",
    fontSize: 14,
  },
  secondaryBtn: {
    marginTop: 18,
    width: "100%",
    padding: 14,
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.4)",
    background: "transparent",
    color: "#f0f0ff",
    cursor: "pointer",
  },

  /* === CHAT UI === */
  chatWrapper: { marginTop: 20, display: "flex", flexDirection: "column", gap: 10 },
  consoleTitle: { fontSize: 16, fontWeight: 600, marginBottom: 6, color: "#f0f0ff" },
  chatArea: {
    minHeight: 200,
    maxHeight: 300,
    overflowY: "auto",
    padding: 12,
    borderRadius: 12,
    background: "rgba(15,23,42,0.85)",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  messageUser: {
    alignSelf: "flex-end",
    background: "linear-gradient(135deg,#22d3ee,#6366f1)",
    color: "#020617",
    padding: "8px 14px",
    borderRadius: "18px 18px 6px 18px",
    fontSize: 14,
  },
  messageAI: {
    alignSelf: "flex-start",
    background: "#1e293b",
    border: "1px solid #334155",
    color: "#f0f0ff",
    padding: "10px 14px",
    borderRadius: "18px 18px 18px 6px",
    fontSize: 14,
  },
  chatInputArea: { marginTop: 6 },
  chatInput: {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 22,
    border: "1.5px solid #ffffff44",
    outline: "none",
    fontSize: 14,
    background: "#1e293b",
    color: "#f0f0ff",
  },
};