import React, { useState } from "react";
import api from "../../../utils/api.js";

/* ================= THEME (PREMIUM PSYCHOLOGY COLORS) ================= */
const theme = {
  bg: "radial-gradient(circle at top left, #0f0c29, #1a1a2e, #000000)",
  card: "rgba(255,255,255,0.05)",
  border: "rgba(255,255,255,0.08)",
  text: "#e0e7ff",
  sub: "#a5b4fc",
  neon1: "#ff4ecd",
  neon2: "#00f0ff",
  accent: "#7c3aed",
};

/* ================= DATA (UNCHANGED) ================= */
// (keeping your original data exactly same)

const academicSubjects = [
  "Physics","Chemistry","Biology","Mathematics","Computer Science",
  "Economics","History","Political Science","Business Studies",
  "English","Physical Education",
];

const comfortLevels = ["Easy", "Medium", "Hard but Interesting"];
const learningPaces = ["Fast", "Balanced", "Slow but Deep"];

const skillOptions = [
  "Communication","Coding","Designing","Analysis","Public Speaking",
  "Leadership","Research","Sports Skills","Political Awareness",
  "Security / Defense","Business Skills",
];

const thinkingSliders = [
  { id: "logicCreative", label: "Logical ↔ Creative" },
  { id: "theoryPractical", label: "Theory ↔ Practical" },
  { id: "soloTeam", label: "Solo ↔ Team" },
  { id: "fastDeep", label: "Fast Execution ↔ Deep Thinking" },
  { id: "leadershipSupport", label: "Leadership ↔ Support Role" },
];

const countries = [
  "India"
];

const classesGrades = ["8th","9th","10th","11th","12th","Undergraduate"];

/* ================= CAREER LOGIC (UNCHANGED) ================= */
const generatePlans = async () => {
  try {
    const message = `
You are Career Intelligence AI.

Analyze this student profile:

Subjects: ${favSubjects.join(", ")}
Best Skills: ${skillsBest.join(", ")}
Skills Learning: ${skillsLearn.join(", ")}
Thinking Profile: ${JSON.stringify(sliders)}
Country: ${country}

TASK:
1. Suggest top 3 career paths
2. Explain why each fits
3. List required skills
4. Give future scope

OUTPUT FORMAT STRICT:

[
  {
    "name": "",
    "domain": "",
    "reason": "",
    "skillsNeeded": []
  }
]
`;

    const res = await api.sendAI({
      feature: "career_detector_ai",
      message,
      context: {
        country,
        classGrade,
      },
    });

    // SAFE PARSING (VERY IMPORTANT)
    let parsed;
    try {
      parsed = JSON.parse(res);
    } catch (e) {
      console.log("AI RAW:", res);
      parsed = [];
    }

    setPlans(Array.isArray(parsed) ? parsed : []);
    setStep(3);

  } catch (err) {
    console.log(err);
  }
};


  

/* ================= MAIN COMPONENT ================= */

export default function CareerDetectorPro() {
  const [step, setStep] = useState(1);

  const [favSubjects, setFavSubjects] = useState([]);
  const [comfortLevel, setComfortLevel] = useState({});
  const [learningPace, setLearningPace] = useState("Balanced");

  const [sliders, setSliders] = useState({
    logicCreative: 50,
    theoryPractical: 50,
    soloTeam: 50,
    fastDeep: 50,
    leadershipSupport: 50,
  });

  const [skillsBest, setSkillsBest] = useState([]);
  const [skillsLearn, setSkillsLearn] = useState([]);

  const [classGrade, setClassGrade] = useState("12th");
  const [country, setCountry] = useState("India");

  const [plans, setPlans] = useState(null);

  /* ================= HANDLERS ================= */

  const toggleSubject = (sub) => {
    if (favSubjects.includes(sub)) {
      setFavSubjects(favSubjects.filter((s) => s !== sub));
    } else {
      setFavSubjects([...favSubjects, sub]);
      setComfortLevel((p) => ({ ...p, [sub]: "Medium" }));
    }
  };

  const toggleSkill = (skill, setter, list) => {
    if (list.includes(skill)) {
      setter(list.filter((s) => s !== skill));
    } else {
      setter([...list, skill]);
    }
  };

const generatePlans = async () => {
  try {
    const message = `
You are Career Intelligence AI.

Analyze this student profile and suggest top 3 careers.

Subjects: ${favSubjects.join(", ")}
Skills (best): ${skillsBest.join(", ")}
Skills (learning): ${skillsLearn.join(", ")}
Thinking Profile: ${JSON.stringify(sliders)}
Country: ${country}

Return ONLY valid JSON:
[
  {
    "name": "Career Name",
    "reason": "why this fits",
    "skillsNeeded": ["skill1", "skill2"]
  }
]
`;

    const reply = await api.sendAI({
      feature: AI_FEATURES.SKILL_HUB, // OR create CAREER_AI later
      message,
      context: { favSubjects, skillsBest, sliders, country },
    });

    let parsed;

    try {
      parsed = JSON.parse(reply);
    } catch (e) {
      console.log("AI RAW RESPONSE:", reply);
      throw new Error("AI did not return valid JSON");
    }

    setPlans(parsed);
    setStep(3);

  } catch (err) {
    console.error("Career AI error:", err);
    alert("AI failed. Check backend logs.");
  }
};

  /* ================= UI ================= */

  return (
    <div style={ui.wrapper}>
      <div style={ui.container}>

        {/* HEADER */}
        <div style={ui.header}>
          🎯 Career Intelligence System
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <div style={ui.section}>
              <h2>Academic Strength</h2>

              <div style={ui.grid}>
                {academicSubjects.map((sub) => (
                  <div
                    key={sub}
                    style={{
                      ...ui.card,
                      border:
                        favSubjects.includes(sub)
                          ? `1px solid ${theme.neon1}`
                          : `1px solid ${theme.border}`,
                    }}
                    onClick={() => toggleSubject(sub)}
                  >
                    {sub}
                  </div>
                ))}
              </div>
            </div>

            <button style={ui.btnPrimary} onClick={() => setStep(2)}>
              Continue →
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <div style={ui.section}>
              <h2>Thinking & Skills</h2>

              {thinkingSliders.map((s) => (
                <div key={s.id} style={ui.sliderBox}>
                  <label>{s.label}</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliders[s.id]}
                    onChange={(e) =>
                      setSliders({ ...sliders, [s.id]: +e.target.value })
                    }
                  />
                </div>
              ))}

              <h3>Skills</h3>
              <div style={ui.chips}>
                {skillOptions.map((skill) => (
                  <div
                    key={skill}
                    style={{
                      ...ui.chip,
                      background: skillsBest.includes(skill)
                        ? theme.neon2
                        : theme.card,
                    }}
                    onClick={() =>
                      toggleSkill(skill, setSkillsBest, skillsBest)
                    }
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            <div style={ui.row}>
              <button style={ui.btnSecondary} onClick={() => setStep(1)}>
                Back
              </button>
              <button style={ui.btnPrimary} onClick={generatePlans}>
                Generate Plans
              </button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && plans && (
          <div style={ui.section}>
            <h2>Your Career Plans</h2>

            <div style={ui.grid}>
              {plans.map((p, i) => (
                <div key={p.name} style={ui.planCard}>
                  <h3>
                    Plan {String.fromCharCode(65 + i)} — {p.name}
                  </h3>

                  <p>{p.reason}</p>

                  <div style={ui.skills}>
                    {p.skillsNeeded.map((s) => (
                      <span key={s}>{s}</span>
                    ))}
                  </div>

                  <div style={ui.actions}>
                    <button style={ui.btnPrimarySmall}>
                      🚀 Roadmap
                    </button>
                    <button style={ui.btnSecondarySmall}>
                      📘 Skills
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= UI STYLES ================= */

const ui = {
  wrapper: {
    minHeight: "100vh",
    background: theme.bg,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    fontFamily: "Inter",
  },

  container: {
    width: "1200px",
    padding: 30,
    borderRadius: 30,
    background: theme.card,
    border: `1px solid ${theme.border}`,
    boxShadow: "0 40px 120px rgba(0,0,0,0.9)",
  },

  header: {
    fontSize: 30,
    fontWeight: 800,
    marginBottom: 30,
    background: `linear-gradient(90deg,${theme.neon1},${theme.neon2})`,
    WebkitBackgroundClip: "text",
    color: "transparent",
  },

  section: { marginBottom: 30 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 16,
  },

  card: {
    padding: 16,
    borderRadius: 14,
    background: theme.card,
    cursor: "pointer",
  },

  sliderBox: {
    marginBottom: 20,
  },

  chips: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },

  chip: {
    padding: "8px 14px",
    borderRadius: 20,
    cursor: "pointer",
  },

  planCard: {
    padding: 20,
    borderRadius: 20,
    background: theme.card,
    border: `1px solid ${theme.border}`,
  },

  skills: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 15,
  },

  btnPrimary: {
    padding: "12px 24px",
    borderRadius: 20,
    border: "none",
    background: theme.neon1,
    cursor: "pointer",
  },

  btnSecondary: {
    padding: "12px 24px",
    borderRadius: 20,
    border: "1px solid white",
    background: "transparent",
    cursor: "pointer",
  },

  btnPrimarySmall: {
    padding: "8px 16px",
    borderRadius: 12,
    background: theme.neon1,
    border: "none",
  },

  btnSecondarySmall: {
    padding: "8px 16px",
    borderRadius: 12,
    background: theme.neon2,
    border: "none",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
  },
};