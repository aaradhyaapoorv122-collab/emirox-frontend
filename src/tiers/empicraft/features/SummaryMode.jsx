import React, { useState, useEffect } from "react";
import api from "../../../utils/api.js";
import { aiRequest } from "@/utils/aiRequest";
import { supabase } from "@/lib/supabaseClient";


const MAX_CHARS = 1800;

const countries = {
  India: ["NCERT", "CBSE", "ICSE", "State Board"],

};

const modes = [
  { id: "short", label: "Short Revision" },
  { id: "medium", label: "Medium Understanding" },
  { id: "bullet", label: "Bullet Notes" },
  { id: "deep", label: "Deep Lesson Mode" },
];

export default function AiSummaryMode({ smartChatMemory = "" }) {
  const [country, setCountry] = useState("India");
  const [board, setBoard] = useState("NCERT");
  const [mode, setMode] = useState("short");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔗 Smart Chat → Auto Fill
  useEffect(() => {
    if (smartChatMemory) {
      setInput(smartChatMemory);
    }
  }, [smartChatMemory]);

  const remaining = MAX_CHARS - input.length;
 

  const handleAskAI = async (message) => {

    const result = await aiRequest(message, async (msg) => {
      return await fetch("http://localhost:5000/ai/core", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: msg }),
      }).then(r => r.json());
    });

    if (result.blocked) {
      alert("🔒 Daily AI limit reached. Upgrade to EmpiLab ⚡");
      return;
    }

    console.log(result.data);
  };

  

  const fakeSummarize = async () => {
  if (!input.trim()) return;

  setLoading(true);
  setOutput("");

  try {
    const response = await api.sendAIMessage({
      message: `
Summarize this content based on selected mode:

Content:
${input}

Instructions:
- Mode: ${mode}
- Country: ${country}
- Board: ${board}

Rules:
- Keep exam oriented
- Follow selected mode strictly
- Make it structured and easy to revise
      `,
      feature: "summary_ai",
      standard: "8th",
      context: `Board: ${board}, Country: ${country}, Mode: ${mode}`,
    });

    setOutput(`(${country} – ${board})\n\n${response}`);

  } catch (err) {
    console.error("Summary AI Error:", err);

    setOutput("⚠️ AI failed to generate summary. Try again.");
  }

  setLoading(false);
};
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>AI Summary Mode</h2>

        {/* Country & Board */}
        <div style={styles.row}>
          <select
            style={styles.select}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setBoard(countries[e.target.value][0]);
            }}
          >
            {Object.keys(countries).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            style={styles.select}
            value={board}
            onChange={(e) => setBoard(e.target.value)}
          >
            {countries[country].map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </div>

        {/* Input */}
        <textarea
          style={styles.textarea}
          placeholder="Paste lesson, notes, or type: 'Light – Reflection and Refraction'"
          value={input}
          onChange={(e) => {
            if (e.target.value.length <= MAX_CHARS) {
              setInput(e.target.value);
            }
          }}
        />

        <div style={styles.counter}>
          {remaining} characters left
        </div>

        {/* Modes */}
        <div style={styles.modes}>
          {modes.map((m) => (
            <button
              key={m.id}
              style={{
                ...styles.modeBtn,
                ...(mode === m.id ? styles.modeActive : {}),
              }}
              onClick={() => setMode(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Action */}
        <button
          style={styles.mainBtn}
          disabled={!input || loading}
          onClick={fakeSummarize}
        >
          {loading ? "Analyzing…" : "Summarize"}
        </button>

        {/* Output */}
        {output && (
          <div style={styles.output}>
            <pre style={{ whiteSpace: "pre-wrap" }}>{output}</pre>

            <div style={styles.actions}>
              <button style={styles.subBtn}>Save as Notes</button>
              <button style={styles.subBtn}>Ask Doubt</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🎨 PREMIUM STYLES */
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #020617)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "#0b1220",
    borderRadius: 18,
    padding: 24,
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    color: "#e5e7eb",
  },
  title: {
    marginBottom: 16,
    fontSize: 22,
    fontWeight: 600,
    textAlign: "center",
    color: "#67e8f9",
  },
  row: {
    display: "flex",
    gap: 12,
    marginBottom: 12,
  },
  select: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #1e293b",
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    padding: 14,
    borderRadius: 12,
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #1e293b",
    resize: "none",
  },
  counter: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "right",
    marginTop: 4,
  },
  modes: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    margin: "14px 0",
  },
  modeBtn: {
    padding: "8px 12px",
    borderRadius: 20,
    background: "#020617",
    border: "1px solid #1e293b",
    color: "#cbd5f5",
    cursor: "pointer",
  },
  modeActive: {
    background: "#06b6d4",
    color: "#020617",
    border: "none",
  },
  mainBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    background: "#22d3ee",
    color: "#020617",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    marginTop: 10,
  },
  output: {
    marginTop: 18,
    padding: 16,
    borderRadius: 14,
    background: "#020617",
    border: "1px solid #1e293b",
  },
  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },
  subBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    background: "#020617",
    border: "1px solid #22d3ee",
    color: "#67e8f9",
    cursor: "pointer",
  },
};
