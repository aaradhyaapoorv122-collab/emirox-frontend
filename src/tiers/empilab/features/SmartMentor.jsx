import React, { useEffect, useRef, useState } from "react";
import {
  FaMicrophone,
  FaPaperPlane,
  FaRobot,
  FaUser,
  FaBolt,
  FaBookOpen,
  FaBrain,
  FaRocket,
} from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import api from "../../../utils/api.js";

const subjects = [
  "Science",
  "Math",
  "English",
  "SST",
  "Hindi",
  "Computer",
  "Marathi",
];

const tones = [
  "Calm Mentor",
  "Energetic Mentor",
  "Professional Mentor",
];

const modes = ["Doubt Mode", "Course Mode"];

const suggestions = [
  { label: "Ask Doubt", icon: <FaBrain /> },
  { label: "Revision Booster", icon: <FaBolt /> },
  { label: "Mini Challenge", icon: <FaRocket /> },
  { label: "Pro Tips", icon: <FaBookOpen /> },
];

export default function SmartMentor() {
  const [subject, setSubject] = useState(subjects[0]);
  const [tone, setTone] = useState(tones[0]);
  const [mode, setMode] = useState(modes[0]);

  const [messages, setMessages] = useState([
    {
      from: "ai",
      text: "👋 Welcome to Smart Mentor. Ask doubts, revise faster, and learn smarter.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [micActive, setMicActive] = useState(false);

  const chatRef = useRef(null);
  const recognition = useRef(null);

  useEffect(() => {
    createSession();
  }, []);

  async function createSession() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("ai_sessions").insert([
      {
        user_id: user.id,
        created_at: new Date(),
      },
    ]);
  }

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    recognition.current = new window.webkitSpeechRecognition();
    recognition.current.lang = "en-US";

    recognition.current.onstart = () => setMicActive(true);
    recognition.current.onend = () => setMicActive(false);

    recognition.current.onresult = (e) => {
      setInput(e.results[0][0].transcript);
    };
  }, []);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  function speak(text) {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  }

  function toggleMic() {
    if (!recognition.current) return;

    micActive
      ? recognition.current.stop()
      : recognition.current.start();
  }

  async function handleSend(customText) {
    const msg = customText || input;

    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInput("");
    setLoading(true);

    try {
      const reply = await api.sendAIMessage({
        message: msg,
        feature:
          mode === "Course Mode"
            ? "mentor_ai"
            : "smart_chat",
        standard: "8th",
        context: `
Subject: ${subject}
Tone: ${tone}
Mode: ${mode}
`,
      });

      const finalReply =
        reply || "I am ready to help you learn.";

      setMessages((prev) => [
        ...prev,
        { from: "ai", text: finalReply },
      ]);

      speak(finalReply);
    } catch (error) {
      const fail = "⚠️ AI unavailable. Please try again.";
      setMessages((prev) => [
        ...prev,
        { from: "ai", text: fail },
      ]);
    } finally {
      setLoading(false);
    }
  }

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "18px",
      background:
        "linear-gradient(135deg,#0b1120,#111827,#1e1b4b)",
      fontFamily: "Inter, Arial, sans-serif",
      color: "white",
    },

    shell: {
      maxWidth: "1450px",
      height: "92vh",
      margin: "0 auto",
      display: "flex",
      borderRadius: "28px",
      overflow: "hidden",
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
      backdropFilter: "blur(14px)",
    },

    left: {
      width: "320px",
      padding: "24px",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.03)",
      display: "flex",
      flexDirection: "column",
      gap: "18px",
    },

    right: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },

    title: {
      fontSize: "28px",
      fontWeight: "800",
      marginBottom: "4px",
    },

    sub: {
      fontSize: "14px",
      color: "#94a3b8",
      lineHeight: "1.6",
    },

    select: {
      width: "100%",
      padding: "13px 14px",
      borderRadius: "14px",
      border: "1px solid rgba(255,255,255,0.08)",
      background: "#1e293b",
      color: "white",
      outline: "none",
      fontSize: "14px",
    },

    card: {
      padding: "14px",
      borderRadius: "16px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.06)",
      cursor: "pointer",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      gap: "10px",
      transition: "0.25s",
    },

    header: {
      padding: "20px 24px",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      fontWeight: "700",
      fontSize: "18px",
      color: "#e2e8f0",
    },

    chat: {
      flex: 1,
      overflowY: "auto",
      padding: "24px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
    },

    aiMsg: {
      alignSelf: "flex-start",
      maxWidth: "74%",
      padding: "15px 18px",
      borderRadius: "18px 18px 18px 6px",
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(124,58,237,0.28)",
      color: "#e2e8f0",
      lineHeight: "1.6",
    },

    userMsg: {
      alignSelf: "flex-end",
      maxWidth: "72%",
      padding: "15px 18px",
      borderRadius: "18px 18px 6px 18px",
      background:
        "linear-gradient(90deg,#7c3aed,#2563eb)",
      color: "white",
      lineHeight: "1.6",
    },

    inputWrap: {
      padding: "18px",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },

    input: {
      flex: 1,
      padding: "14px 18px",
      borderRadius: "999px",
      border: "1px solid rgba(255,255,255,0.08)",
      background: "#111827",
      color: "white",
      outline: "none",
      fontSize: "15px",
    },

    mic: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      background: micActive
        ? "#ef4444"
        : "#1e293b",
      color: "white",
      fontSize: "18px",
    },

    send: {
      padding: "13px 18px",
      borderRadius: "999px",
      border: "none",
      cursor: "pointer",
      background:
        "linear-gradient(90deg,#7c3aed,#22d3ee)",
      color: "white",
      fontWeight: "700",
    },
  };

  return (
    <div style={styles.page}>
      <div style={styles.shell}>
        {/* LEFT */}
        <div style={styles.left}>
          <div>
            <div style={styles.title}>Smart Mentor</div>
            <div style={styles.sub}>
              Your personal AI coach for faster,
              smarter learning.
            </div>
          </div>

          <select
            style={styles.select}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            {modes.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            style={styles.select}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            style={styles.select}
            value={tone}
            onChange={(e) => setTone(e.target.value)}
          >
            {tones.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <div style={{ marginTop: "6px" }}>
            {suggestions.map((item, i) => (
              <div
                key={i}
                style={{
                  ...styles.card,
                  marginBottom: "10px",
                }}
                onClick={() =>
                  handleSend(item.label)
                }
              >
                {item.icon}
                {item.label}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div style={styles.right}>
          <div style={styles.header}>
            🚀 Today we conquer {subject}
          </div>

          <div style={styles.chat} ref={chatRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={
                  m.from === "ai"
                    ? styles.aiMsg
                    : styles.userMsg
                }
              >
                {m.from === "ai" ? (
                  <>
                    <FaRobot
                      style={{
                        marginRight: "8px",
                      }}
                    />
                    {m.text}
                  </>
                ) : (
                  <>
                    <FaUser
                      style={{
                        marginRight: "8px",
                      }}
                    />
                    {m.text}
                  </>
                )}
              </div>
            ))}

            {loading && (
              <div style={styles.aiMsg}>
                🤖 Smart Mentor is thinking...
              </div>
            )}
          </div>

          <div style={styles.inputWrap}>
            <input
              style={styles.input}
              value={input}
              placeholder="Ask any doubt..."
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleSend()
              }
            />

            <button
              style={styles.mic}
              onClick={toggleMic}
            >
              <FaMicrophone />
            </button>

            <button
              style={styles.send}
              onClick={() => handleSend()}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}