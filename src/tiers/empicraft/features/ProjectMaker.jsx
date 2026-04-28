import React, { useEffect, useRef, useState } from "react";
import api from "../../../utils/api.js";

const PROJECT_TYPES = [
  "2D Art",
  "3D Model",
  "Digital Design",
  "Practical Experiment",
  "Utility App",
  "Other",
];

const SUBJECTS = [
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Computer Science",
  "Environmental Science",
  "Other",
];

export default function ProjectMakerAI() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [subject, setSubject] = useState("");
  const [projectType, setProjectType] = useState("");
  const [title, setTitle] = useState("");
  const [daysToComplete, setDaysToComplete] = useState(7);

  const [aiOverview, setAiOverview] = useState("");
  const [aiSteps, setAiSteps] = useState([]);
  const [aiMaterials, setAiMaterials] = useState([]);

  const recognitionRef = useRef(null);
  const [listening, setListening] = useState(false);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = "en-IN";
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setListening(true);
    recognitionRef.current.onend = () => setListening(false);

    recognitionRef.current.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTitle((prev) => (prev ? prev + " " + text : text));
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  const generateProjectAI = async () => {
    try {
      setLoading(true);

      const message = `
You are Project Builder AI inside Empirox.

Create a practical school-level project plan.

Subject: ${subject}
Type: ${projectType}
Title: ${title}
Days: ${daysToComplete}

Return format:

OVERVIEW:
STEPS:
MATERIALS:
`;

      const reply = await api.sendAIMessage({
        feature: "project_builder_ai",
        message,
      });

      const text = reply || "";

      const overviewMatch = text.match(/OVERVIEW:(.*?)(STEPS:|$)/s);
      const stepsMatch = text.match(/STEPS:(.*?)(MATERIALS:|$)/s);
      const materialsMatch = text.match(/MATERIALS:(.*)/s);

      setAiOverview(overviewMatch?.[1]?.trim() || text);

      setAiSteps(
        stepsMatch?.[1]
          ?.split("\n")
          .map((s) => s.replace(/^\d+\.\s*/, "").trim())
          .filter(Boolean) || []
      );

      setAiMaterials(
        materialsMatch?.[1]
          ?.split("\n")
          .map((m) => m.replace("-", "").trim())
          .filter(Boolean) || []
      );

      setStep(2);
    } catch (err) {
      setAiOverview("AI temporarily unavailable.");
      setAiSteps([]);
      setAiMaterials([]);
      setStep(2);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!subject || !projectType || !title) {
      alert("Please fill all fields.");
      return;
    }
    await generateProjectAI();
  };

  return (
    <div style={pageStyle}>
      <div style={wrapperStyle}>
        <div style={cardStyle}>
          {step === 1 ? (
            <>
              <h1 style={headerTitle}>⚡ Project Maker AI</h1>

              <label>Subject</label>
              <select
                style={selectStyle}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option value="">Select Subject</option>
                {SUBJECTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <label>Project Type</label>
              <select
                style={selectStyle}
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
              >
                <option value="">Select Type</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <label>Title (Voice supported 🎤)</label>
              <input
                style={inputStyle}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter project title"
              />

              <button style={primaryBtn} onClick={startListening}>
                {listening ? "🎙 Listening..." : "Start Voice Input"}
              </button>

              <label>Days to Complete</label>
              <input
                type="number"
                style={inputStyle}
                value={daysToComplete}
                onChange={(e) => setDaysToComplete(e.target.value)}
              />

              <button style={primaryBtn} onClick={handleGenerate}>
                {loading ? "Generating..." : "Generate Project 🚀"}
              </button>
            </>
          ) : (
            <>
              <h2 style={{ color: "#d4af37" }}>AI Project Plan</h2>

              <p>{aiOverview}</p>

              <h3>Steps</h3>
              <ul>
                {aiSteps.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <h3>Materials</h3>
              <ul>
                {aiMaterials.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>

              <button style={primaryBtn} onClick={() => setStep(1)}>
                ← Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* Styles */
const pageStyle = {
  minHeight: "100vh",
  background: "#0b0b0b",
  color: "#e5e7eb",
  padding: "30px 16px",
};

const wrapperStyle = {
  maxWidth: "860px",
  margin: "0 auto",
};

const cardStyle = {
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(212,175,55,0.25)",
  borderRadius: "22px",
  padding: "28px",
};

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  margin: "8px 0 18px",
  borderRadius: "14px",
  border: "1px solid rgba(212,175,55,0.2)",
  background: "#111827",
  color: "white",
};

const selectStyle = { ...inputStyle };

const primaryBtn = {
  padding: "14px 22px",
  borderRadius: "14px",
  border: "none",
  fontWeight: "700",
  background: "linear-gradient(90deg,#d4af37,#f5d76e)",
  color: "#0b0b0b",
  cursor: "pointer",
  marginTop: "10px",
};

const headerTitle = {
  fontSize: "34px",
  color: "#d4af37",
};