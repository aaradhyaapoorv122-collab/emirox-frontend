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
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window))
      return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

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

Student Input:
Subject: ${subject}
Project Type: ${projectType}
Title: ${title}
Days: ${daysToComplete}

Return format:

OVERVIEW:
...

STEPS:
1. ...
2. ...
3. ...

MATERIALS:
- ...
- ...
`;

      const reply = await api.sendAI({
        feature: "skill_hub_ai",
        message,
      });

      const text = reply || "";

      const overviewMatch = text.match(/OVERVIEW:(.*?)(STEPS:|$)/s);
      const stepsMatch = text.match(/STEPS:(.*?)(MATERIALS:|$)/s);
      const materialsMatch = text.match(/MATERIALS:(.*)/s);

      setAiOverview(overviewMatch?.[1]?.trim() || text);

      const steps =
        stepsMatch?.[1]
          ?.split("\n")
          .map((s) => s.replace(/^\d+\.\s*/, "").trim())
          .filter(Boolean) || [];

      const materials =
        materialsMatch?.[1]
          ?.split("\n")
          .map((m) => m.replace("-", "").trim())
          .filter(Boolean) || [];

      setAiSteps(steps);
      setAiMaterials(materials);
      setStep(2);
    } catch (error) {
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

  const page = {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg,#0f172a 0%, #111827 40%, #1e1b4b 100%)",
    padding: "30px 16px",
    color: "white",
    fontFamily: "Inter, Arial, sans-serif",
  };

  const wrapper = {
    maxWidth: "860px",
    margin: "0 auto",
  };

  const card = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "22px",
    padding: "28px",
    backdropFilter: "blur(12px)",
    boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
  };

  // Replace your existing input style object with this fixed version

const input = {
  width: "100%",
  padding: "14px 16px",
  marginTop: "8px",
  marginBottom: "18px",
  borderRadius: "14px",
  border: "1px solid rgba(255,255,255,0.10)",
  background: "#1e293b",   // solid dark bg
  color: "white",
  fontSize: "15px",
  outline: "none",
};

// ADD this new style for select dropdowns
const selectInput = {
  ...input,
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  cursor: "pointer",
};

  const button = {
    padding: "14px 22px",
    border: "none",
    borderRadius: "14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "15px",
  };

  const primaryBtn = {
    ...button,
    background: "linear-gradient(90deg,#7c3aed,#2563eb)",
    color: "white",
  };

  const secondaryBtn = {
    ...button,
    background: "rgba(255,255,255,0.08)",
    color: "white",
  };

  const chip = {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    marginRight: "10px",
    marginBottom: "10px",
    fontSize: "14px",
  };

  return (
    <div style={page}>
      <div style={wrapper}>
        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div
            style={{
              color: "#a5b4fc",
              fontSize: "13px",
              fontWeight: "700",
              letterSpacing: "1px",
            }}
          >
            EMPIROX AI TOOL
          </div>

          <h1 style={{ fontSize: "36px", margin: "8px 0 10px" }}>
            Project Maker
          </h1>

          <p style={{ color: "#94a3b8", lineHeight: "1.6" }}>
            Generate smart school project plans with AI guidance.
          </p>
        </div>

        {/* Progress */}
        <div
          style={{
            height: "10px",
            background: "rgba(255,255,255,0.08)",
            borderRadius: "999px",
            marginBottom: "24px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: step === 1 ? "50%" : "100%",
              height: "100%",
              background: "linear-gradient(90deg,#7c3aed,#22d3ee)",
              transition: "0.4s",
            }}
          />
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div style={card}>
            <h2 style={{ marginBottom: "18px" }}>Create Your Project</h2>

            <label>Subject</label>
            <select
              style={input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            >
              <option value="">Select Subject</option>
              {SUBJECTS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label>Project Type</label>
            <select
              style={input}
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
            >
              <option value="">Select Type</option>
              {PROJECT_TYPES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label>Project Title</label>
            <div style={{ display: "flex", gap: "10px" }}>
              <input
                style={input}
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <button
                onClick={startListening}
                style={{
                  ...secondaryBtn,
                  height: "48px",
                  marginTop: "8px",
                  minWidth: "52px",
                }}
              >
                {listening ? "🎙️" : "🎤"}
              </button>
            </div>

            <label>Days to Complete</label>
            <input
              style={input}
              type="number"
              min="1"
              max="365"
              value={daysToComplete}
              onChange={(e) => setDaysToComplete(e.target.value)}
            />

            <button
              style={{ ...primaryBtn, width: "100%", marginTop: "8px" }}
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate AI Plan"}
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div style={card}>
            <h2 style={{ marginBottom: "18px" }}>AI Project Plan</h2>

            <div
              style={{
                background: "rgba(255,255,255,0.05)",
                padding: "18px",
                borderRadius: "16px",
                color: "#cbd5e1",
                lineHeight: "1.7",
              }}
            >
              {aiOverview}
            </div>

            <h3 style={{ marginTop: "24px" }}>Steps</h3>

            {aiSteps.map((item, index) => (
              <div
                key={index}
                style={{
                  padding: "16px",
                  marginTop: "12px",
                  borderRadius: "16px",
                  background: "rgba(255,255,255,0.05)",
                }}
              >
                <strong>Step {index + 1}</strong>
                <div style={{ marginTop: "8px", color: "#cbd5e1" }}>{item}</div>
              </div>
            ))}

            <h3 style={{ marginTop: "24px" }}>Materials</h3>

            <div style={{ marginTop: "12px" }}>
              {aiMaterials.map((item, index) => (
                <span key={index} style={chip}>
                  {item}
                </span>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "28px",
                flexWrap: "wrap",
              }}
            >
              <button
                style={secondaryBtn}
                onClick={() => setStep(1)}
              >
                ← Back
              </button>

              <button
                style={primaryBtn}
                onClick={() => alert("Plan Saved")}
              >
                Save Plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}