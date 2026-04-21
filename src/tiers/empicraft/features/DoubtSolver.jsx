import React, { useState } from "react";
import api from "../../../utils/api.js";
import { aiRequest } from "@/utils/aiRequest";
import { supabase } from "@/lib/supabaseClient";


export default function AIDoubtResolver() {
  const [fileText, setFileText] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  
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

 

  const handleFileUpload = async (file) => {
    if (!file) return;
    const text = await file.text();
    setFileText(text);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    setDragOver(e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleAsk = async () => {
  if (!question && !fileText)
    return alert("Please type a question or upload a file!");

  setLoading(true);

  try {
    const fullQuery = `
Doubt: ${question}
File Context: ${fileText}
    `;

    const reply = await api.sendAIMessage({
      message: fullQuery,
      feature: "solver_ai", // 🔥 IMPORTANT
      standard: "8",
      context: "doubt_solver",
    });

    setAnswers((prev) => [
      ...prev,
      {
        q: question || "File-based query",
        a: reply,
        concept: "🧠 AI-generated explanation",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    setQuestion("");
    setFileText("");

  } catch (err) {
    console.error("Solver AI Error:", err);

    setAnswers((prev) => [
      ...prev,
      {
        q: question || "File-based query",
        a: "⚠️ AI failed to respond. Try again.",
        concept: "Error fallback",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  }

  setLoading(false);
};
  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>AI Doubt Resolver 🚀</h1>

        {/* File Drag & Drop */}
        <div
          style={{
            ...styles.dragDrop,
            borderColor: dragOver ? "#22d3ee" : "#555",
            backgroundColor: dragOver ? "#0a0a12" : "#111",
          }}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {fileText ? (
            <p style={{ color: "#67e8f9" }}>📄 File uploaded!</p>
          ) : (
            <p style={{ color: "#888" }}>Drag & drop a file here (optional)</p>
          )}
        </div>

        {/* Question Input */}
        <textarea
          placeholder="Or type your question here (optional)"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          style={styles.textInput}
        />

        {/* Submit Button */}
        <button
          onClick={handleAsk}
          disabled={loading}
          style={{ ...styles.mainBtn, opacity: loading ? 0.6 : 1 }}
        >
          {loading ? "🤖 Thinking..." : "Ask AI"}
        </button>

        {/* Answers */}
        <div style={styles.answers}>
          {answers.length === 0 && (
            <p style={{ color: "#555", textAlign: "center" }}>
              Your AI answers will appear here.
            </p>
          )}

          {answers.map((item, idx) => (
            <div key={idx} style={styles.answerCard}>
              <div style={styles.header}>
                <span style={styles.timestamp}>{item.timestamp}</span>
              </div>
              <p><strong>Q:</strong> {item.q}</p>
              <p><strong>A:</strong> {item.a}</p>
              <p style={styles.concept}><strong>💡 Key Concept:</strong> {item.concept}</p>
              <div style={styles.actions}>
                <button style={styles.subBtn} onClick={() => navigator.clipboard.writeText(item.a)}>Copy Answer</button>
                <button style={styles.subBtn} onClick={() => setQuestion(item.q)}>Ask Again</button>
                <button style={styles.subBtn}>Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #1c1c2e, #0b0b12)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 30,
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "#0f0f1c",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
    color: "#e0e0f0",
  },
  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 20,
    color: "#22d3ee",
    textShadow: "0 0 8px #22d3ee",
  },
  dragDrop: {
    padding: 20,
    border: "2px dashed #555",
    borderRadius: 16,
    marginBottom: 16,
    textAlign: "center",
    transition: "all 0.3s ease",
    cursor: "pointer",
  },
  textInput: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #333",
    background: "#111",
    color: "#e0e0f0",
    fontSize: 16,
    minHeight: 80,
    resize: "vertical",
    marginBottom: 16,
  },
  mainBtn: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    background: "#22d3ee",
    color: "#0b0b12",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    marginBottom: 20,
    fontSize: 16,
    transition: "all 0.3s ease",
  },
  answers: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  answerCard: {
    padding: 18,
    borderRadius: 16,
    background: "#141426",
    border: "1px solid #333",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  concept: {
    marginTop: 10,
    background: "#1c1c2e",
    padding: 12,
    borderRadius: 10,
    fontStyle: "italic",
    color: "#67e8f9",
  },
  actions: {
    display: "flex",
    gap: 12,
    marginTop: 12,
  },
  subBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 12,
    background: "#141426",
    border: "1px solid #22d3ee",
    color: "#67e8f9",
    cursor: "pointer",
    fontWeight: 600,
    transition: "all 0.2s ease",
  },
};