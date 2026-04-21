import React, { useState, useEffect, useRef } from "react";

const roboAvatarURL =
  "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";

export default function EmpiLabPTMConsole() {
  const [query, setQuery] = useState("");
  const [conversation, setConversation] = useState([
    {
      from: "mentor",
      text: "Welcome to EmpiLab Parent Intelligence Console. I am your AI Mentor. How may I assist you today?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation, loading]);

  // Simulated AI response
  const simulateAIResponse = (question) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          "Performance analysis indicates stable academic growth. Science comprehension is strong. Mathematics requires structured revision. Overall engagement level is positive."
        );
      }, 1800);
    });
  };

  // Text to speech
  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const handleAsk = async () => {
    if (!query.trim()) return;

    const userMessage = { from: "user", text: query };
    setConversation((prev) => [...prev, userMessage]);
    setLoading(true);
    setQuery("");

    const aiReply = await simulateAIResponse(query);
    const mentorMessage = { from: "mentor", text: aiReply };

    setConversation((prev) => [...prev, mentorMessage]);
    speakText(aiReply);
    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        {/* HEADER */}
        <header style={styles.header}>
          <div>
            <h2 style={styles.title}>
              EmpiLab Parent Intelligence Console
            </h2>
            <span style={styles.subTitle}>Live AI Mentor Session</span>
          </div>

          <div style={styles.sessionIndicator}>
            <span style={styles.greenDot}></span>
            Session Active
          </div>
        </header>

        {/* CONTENT */}
        <div style={styles.contentArea}>
          <div style={styles.avatarContainer}>
            <img src={roboAvatarURL} alt="AI Mentor" style={styles.avatar} />
            <p style={styles.avatarName}>AI Mentor</p>
          </div>

          <div style={styles.chatContainer}>
            <div style={styles.chatBox}>
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  style={{
                    ...styles.message,
                    ...(msg.from === "mentor"
                      ? styles.mentorMsg
                      : styles.userMsg),
                  }}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div style={{ ...styles.message, ...styles.mentorMsg }}>
                  AI Mentor analyzing performance...
                </div>
              )}

              <div ref={chatEndRef}></div>
            </div>

            <div style={styles.inputRow}>
              <input
                type="text"
                placeholder="Ask about academic performance..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAsk()}
                style={styles.input}
                disabled={loading}
              />
              <button
                onClick={handleAsk}
                style={styles.askBtn}
                disabled={loading}
              >
                {loading ? "..." : "Analyze"}
              </button>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <footer style={styles.footer}>
          🔒 Secure AI Processing • EmpiLab Advanced Layer
        </footer>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    background:
      "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: 900,
    backdropFilter: "blur(15px)",
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 20,
    padding: 30,
    color: "white",
    boxShadow: "0 0 40px rgba(0,0,0,0.6)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: 700,
  },

  subTitle: {
    fontSize: 14,
    opacity: 0.8,
  },

  sessionIndicator: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: 14,
  },

  greenDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: "#00ff88",
    boxShadow: "0 0 10px #00ff88",
  },

  contentArea: {
    display: "flex",
    gap: 25,
  },

  avatarContainer: {
    width: 140,
    textAlign: "center",
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    border: "3px solid #00c6ff",
    boxShadow: "0 0 20px #00c6ff",
  },

  avatarName: {
    marginTop: 10,
    fontWeight: 600,
  },

  chatContainer: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  chatBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 20,
    overflowY: "auto",
    marginBottom: 15,
  },

  message: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    maxWidth: "75%",
    fontSize: 14,
    lineHeight: 1.4,
  },

  mentorMsg: {
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    alignSelf: "flex-start",
  },

  userMsg: {
    background: "rgba(255,255,255,0.2)",
    alignSelf: "flex-end",
  },

  inputRow: {
    display: "flex",
    gap: 10,
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "none",
    outline: "none",
  },

  askBtn: {
    padding: "12px 20px",
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(90deg, #00c6ff, #0072ff)",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },

  footer: {
    marginTop: 25,
    textAlign: "center",
    fontSize: 13,
    opacity: 0.8,
  },
};