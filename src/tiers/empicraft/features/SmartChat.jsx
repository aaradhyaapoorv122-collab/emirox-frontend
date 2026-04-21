import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../utils/api.js";
import { aiRequest } from "@/utils/aiRequest";
import { supabase } from "@/lib/supabaseClient";


const MAX_FILES = 6;

export default function SmartChat() {
  const { user } = useContext(AuthContext);

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const messagesEndRef = useRef(null);
  const sessionStartTime = useRef(Date.now());


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



  /* ===================== AUTO SCROLL ===================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ===================== SESSION TIMER ===================== */
  function formatSessionTime() {
    const s = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  }

  /* ===================== FILE SELECT ===================== */
  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (uploadedFiles.length + files.length > MAX_FILES) return;

    setUploadedFiles((prev) => [...prev, ...files]);

    setMessages((prev) => [
      ...prev,
      { type: "system", text: `📎 ${files.length} file(s) uploaded` },
    ]);
  }

  /* ===================== SEND MESSAGE ===================== */
  async function handleSend() {
    if (!input.trim()) return;

    const question = input.trim();

    // Show user message
    setMessages((prev) => [
      ...prev,
      { type: "question", text: question },
    ]);

    setInput("");
    setLoading(true);

    try {
      // 🔥 Build conversation history
      const history = messages
        .filter((m) => m.type === "question" || m.type === "answer")
        .map((m) => ({
          role: m.type === "question" ? "user" : "assistant",
          content: m.text,
        }));

      // 🔥 CALL REAL AI
      const reply = await api.sendAIMessage({
        message: question,
        standard: "8",
        context: "",
        history,
      });

      // ✅ Show AI response
      setMessages((prev) => [
        ...prev,
        { type: "answer", text: reply },
      ]);

    } catch (err) {
     console.log("ERROR DETAILS:", err?.message || err);

      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: "⚠️ Something went wrong. Try again.",
        },
      ]);
    }

    setLoading(false);
  }

  /* ===================== UI ===================== */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2 style={{ margin: 0 }}>Empi AI</h2>
          <span style={styles.status}>🟢 Active • Real AI Mode</span>
        </div>
        <div style={styles.session}>⏱ {formatSessionTime()}</div>
      </div>

      {/* CHAT AREA */}
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                m.type === "question" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={
                m.type === "question"
                  ? styles.userBubble
                  : m.type === "system"
                  ? styles.systemBubble
                  : styles.aiBubble
              }
            >
              {m.text}
            </div>
          </div>
        ))}

        {loading && (
          <div style={styles.typing}>
            <span style={styles.dot}></span>
            <span style={styles.dot}></span>
            <span style={styles.dot}></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT BAR */}
      <div style={styles.inputWrapper}>
        <button
          onClick={() => fileRef.current.click()}
          disabled={uploadedFiles.length >= MAX_FILES}
          style={styles.attachBtn}
        >
          📎
        </button>

        <input
          ref={fileRef}
          type="file"
          multiple
          hidden
          onChange={handleFileSelect}
        />

        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything..."
          style={styles.input}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <button onClick={handleSend} disabled={loading} style={styles.sendBtn}>
          ➤
        </button>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        📎 {uploadedFiles.length}/{MAX_FILES} files connected
      </div>

      {/* DOT ANIMATION */}
      <style>
        {`
          @keyframes blink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
}

/* ===================== STYLES ===================== */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    color: "white",
    fontFamily: "Segoe UI",
    padding: "10px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 15px",
  },
  status: {
    fontSize: "12px",
    opacity: 0.7,
  },
  session: {
    fontSize: "13px",
    opacity: 0.8,
  },
  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: "15px",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  userBubble: {
    background: "linear-gradient(90deg, #00f260, #0575e6)",
    padding: "10px 16px",
    borderRadius: "18px",
    maxWidth: "70%",
  },
  aiBubble: {
    background: "rgba(255,255,255,0.1)",
    padding: "10px 16px",
    borderRadius: "18px",
    maxWidth: "70%",
  },
  systemBubble: {
    background: "rgba(255,255,255,0.05)",
    padding: "8px 12px",
    borderRadius: "12px",
    fontSize: "12px",
  },
  typing: {
    display: "flex",
    gap: "5px",
    paddingLeft: "10px",
  },
  dot: {
    width: "6px",
    height: "6px",
    background: "white",
    borderRadius: "50%",
    animation: "blink 1.4s infinite both",
  },
  inputWrapper: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    marginTop: "10px",
    background: "rgba(0,0,0,0.3)",
    borderRadius: "30px",
  },
  input: {
    flex: 1,
    borderRadius: "20px",
    padding: "10px 15px",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "white",
  },
  attachBtn: {
    background: "rgba(255,255,255,0.1)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    cursor: "pointer",
  },
  sendBtn: {
    background: "linear-gradient(90deg, #00f260, #0575e6)",
    border: "none",
    borderRadius: "50%",
    width: "40px",
    cursor: "pointer",
    color: "white",
  },
  footer: {
    textAlign: "center",
    fontSize: "12px",
    opacity: 0.6,
    marginTop: "5px",
  },
};