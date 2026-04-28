import React, { useState, useEffect, useRef, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../utils/api.js";
import { aiRequest } from "@/utils/aiRequest";
import { supabase } from "@/lib/supabaseClient";
import { BrainCore } from "@/utils/memoryEngine";

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

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* ================= SESSION TIMER ================= */
  function formatSessionTime() {
    const s = Math.floor((Date.now() - sessionStartTime.current) / 1000);
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  }

  /* ================= FILE HANDLER ================= */
  function handleFileSelect(e) {
    const files = Array.from(e.target.files);
    if (uploadedFiles.length + files.length > MAX_FILES) return;

    setUploadedFiles((prev) => [...prev, ...files]);

    setMessages((prev) => [
      ...prev,
      { type: "system", text: `📎 ${files.length} file(s) uploaded` },
    ]);
  }

  /* ================= AI CALL ================= */
  async function handleSend() {
    if (!input.trim()) return;

    const question = input.trim();

    setMessages((prev) => [...prev, { type: "question", text: question }]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, { type: "question", text: question }]
        .filter((m) => m.type === "question" || m.type === "answer")
        .map((m) => ({
          role: m.type === "question" ? "user" : "assistant",
          content: m.text,
        }));

      const reply = await api.sendAIMessage({
        message: question,
        feature: "smart_chat_v3",
        standard: "8",
        context:
          "Empirox Smart Chat v3 — use updated knowledge and reasoning",
        history,
      });

      const finalReply =
        typeof reply === "string"
          ? reply
          : reply?.reply || JSON.stringify(reply);

      setMessages((prev) => [
        ...prev,
        { type: "answer", text: finalReply },
      ]);

      /* ================= BRAINC CORE MEMORY ================= */
      if (user?.id) {
        await BrainCore.log(user.id, "smart_chat_v3", {
          question,
          answer: finalReply,
          sessionTime: formatSessionTime(),
          fileCount: uploadedFiles.length,
        });
      }

    } catch (err) {
      console.log(err);

      setMessages((prev) => [
        ...prev,
        {
          type: "answer",
          text: "⚠️ AI error occurred. Try again.",
        },
      ]);
    }

    setLoading(false);
  }

  /* ================= AI WRAPPER (optional fallback layer) ================= */
  const handleAskAI = async (msg) => {
    return await aiRequest(msg, async (m) => {
      return await fetch("http://localhost:5000/ai/core", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: m }),
      }).then((r) => r.json());
    });
  };

  /* ================= UI ================= */
  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h2>🧠 Empirox Smart Chat v3</h2>
          <span style={styles.status}>🟢 AI Active Mode</span>
        </div>
        <div style={styles.session}>
          ⏱ {formatSessionTime()}
        </div>
      </div>

      {/* CHAT BOX */}
      <div style={styles.chatBox}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent:
                m.type === "question"
                  ? "flex-end"
                  : "flex-start",
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

      {/* INPUT */}
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

        <button
          onClick={handleSend}
          disabled={loading}
          style={styles.sendBtn}
        >
          ➤
        </button>
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        📎 {uploadedFiles.length}/{MAX_FILES} files connected
      </div>

      {/* ANIMATION */}
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

/* ================= STYLES ================= */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0A0A0A",
    color: "#EAEAEA",
    fontFamily: "Segoe UI",
    padding: 10,
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 12px",
    borderBottom: "1px solid rgba(255, 215, 0, 0.15)",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
  },

  status: {
    fontSize: 12,
    opacity: 0.7,
    color: "#D4AF37",
  },

  session: {
    fontSize: 13,
    opacity: 0.8,
    color: "#D4AF37",
  },

  chatBox: {
    flex: 1,
    overflowY: "auto",
    padding: 15,
    borderRadius: 15,
    background: "rgba(255, 215, 0, 0.04)",
    border: "1px solid rgba(255, 215, 0, 0.08)",
    backdropFilter: "blur(10px)",
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  userBubble: {
    background: "linear-gradient(135deg, #D4AF37, #8B6B00)",
    padding: "10px 16px",
    borderRadius: 18,
    maxWidth: "70%",
    color: "#000",
    fontWeight: 500,
  },

  aiBubble: {
    background: "rgba(255, 215, 0, 0.08)",
    border: "1px solid rgba(255, 215, 0, 0.15)",
    padding: "10px 16px",
    borderRadius: 18,
    maxWidth: "70%",
    color: "#EAEAEA",
  },

  systemBubble: {
    background: "rgba(255, 215, 0, 0.05)",
    border: "1px solid rgba(255, 215, 0, 0.1)",
    padding: 8,
    borderRadius: 12,
    fontSize: 12,
    color: "#D4AF37",
  },

  typing: {
    display: "flex",
    gap: 5,
  },

  dot: {
    width: 6,
    height: 6,
    background: "#D4AF37",
    borderRadius: "50%",
    animation: "blink 1.4s infinite both",
  },

  inputWrapper: {
    display: "flex",
    gap: 10,
    padding: "12px",
    background: "rgba(0,0,0,0.8)",
    borderRadius: 30,
    border: "1px solid rgba(255, 215, 0, 0.15)",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 20,
    border: "none",
    background: "transparent",
    color: "#EAEAEA",
    outline: "none",
  },

  attachBtn: {
    width: 40,
    borderRadius: "50%",
    border: "1px solid rgba(255, 215, 0, 0.2)",
    background: "rgba(0,0,0,0.5)",
    color: "#D4AF37",
    cursor: "pointer",
  },

  sendBtn: {
    width: 40,
    borderRadius: "50%",
    border: "none",
    background: "linear-gradient(135deg, #D4AF37, #8B6B00)",
    color: "#000",
    fontWeight: "bold",
    boxShadow: "0 0 10px rgba(255, 215, 0, 0.3)",
    cursor: "pointer",
  },

  footer: {
    textAlign: "center",
    fontSize: 12,
    opacity: 0.6,
    marginTop: 5,
    color: "#D4AF37",
  },
};