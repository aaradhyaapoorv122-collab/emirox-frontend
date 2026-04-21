import React, { useState, useEffect, useRef } from "react";

// Sample data structure simplified for demonstration
const DATA = {
  India: {
    subjects: ["Mathematics", "Science", "English", "Hindi / Regional Language"],
    boards: ["NCERT", "CBSE", "ICSE", "State Board"],
    standards: ["6", "7", "8", "9", "10"],
  },
  Japan: {
    subjects: ["Mathematics", "Science", "Japanese Language", "English"],
    boards: ["National Curriculum"],
    standards: ["6", "7", "8", "9", "10"],
  },
  // Add other countries similarly
};

const TABS = ["Study", "Doubt Chat", "Clarifications", "Continue"];

export default function SubjectPortal() {
  // --- Selections
  const [country, setCountry] = useState("");
  const [subject, setSubject] = useState("");
  const [board, setBoard] = useState("");
  const [standard, setStandard] = useState("");
  const [topic, setTopic] = useState("");

  // --- Session state
  const SESSION_LENGTH = 45 * 60; // 45 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(SESSION_LENGTH);
  const [sessionActive, setSessionActive] = useState(false);
  const [activeTab, setActiveTab] = useState("Study");

  // --- Chat messages for doubt chat
  const [chatMessages, setChatMessages] = useState([
    { from: "system", text: "Welcome! Ask your doubts here." },
  ]);
  const [chatInput, setChatInput] = useState("");

  // Timer interval ref
  const timerRef = useRef(null);

  // --- Start session timer
  useEffect(() => {
    if (sessionActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      if (timeLeft === 0) setActiveTab("Continue");
    }
    return () => clearInterval(timerRef.current);
  }, [sessionActive, timeLeft]);

  // --- Handle chat send
  const sendChatMessage = () => {
    if (!chatInput.trim()) return;
    setChatMessages((msgs) => [...msgs, { from: "user", text: chatInput.trim() }]);
    setChatInput("");
    // Simulate AI response (placeholder)
    setTimeout(() => {
      setChatMessages((msgs) => [
        ...msgs,
        { from: "ai", text: "That's an interesting question! Here's a quick explanation..." },
      ]);
    }, 1200);
  };

  // --- Start / Reset Session
  const startSession = () => {
    if (!country || !subject || !board || !standard || !topic) {
      alert("Please complete all selections before starting the session.");
      return;
    }
    setSessionActive(true);
    setTimeLeft(SESSION_LENGTH);
    setActiveTab("Study");
    setChatMessages([{ from: "system", text: "Welcome! Ask your doubts here." }]);
  };

  // --- Continue session beyond 45 mins (simple reset for now)
  const continueSession = () => {
    setTimeLeft(SESSION_LENGTH);
    setSessionActive(true);
    setActiveTab("Study");
  };

  // --- Format time for display mm:ss
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Subject Portal</h2>

        {/* Selection Form */}
        <div style={styles.formRow}>
          <select
            style={styles.select}
            value={country}
            onChange={(e) => {
              setCountry(e.target.value);
              setSubject("");
              setBoard("");
              setStandard("");
            }}
          >
            <option value="">Select Country</option>
            {Object.keys(DATA).map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            style={styles.select}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={!country}
          >
            <option value="">Select Subject</option>
            {country &&
              DATA[country].subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        </div>

        <div style={styles.formRow}>
          <select
            style={styles.select}
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            disabled={!country}
          >
            <option value="">Select Board</option>
            {country &&
              DATA[country].boards.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
          </select>

          <select
            style={styles.select}
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
            disabled={!country}
          >
            <option value="">Select Standard</option>
            {country &&
              DATA[country].standards.map((std) => (
                <option key={std} value={std}>
                  {std}
                </option>
              ))}
          </select>
        </div>

        <input
          style={styles.input}
          placeholder="Enter topic (e.g. Light)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          disabled={!subject}
        />

        {!sessionActive && (
          <button style={styles.startBtn} onClick={startSession}>
            Start 45-Min Study Session
          </button>
        )}

        {sessionActive && (
          <>
            {/* Timer Display */}
            <div style={styles.timerWrapper}>
              <div style={styles.timerText}>Time Left: {formatTime(timeLeft)}</div>
              <div style={styles.timerBarContainer}>
                <div
                  style={{
                    ...styles.timerBar,
                    width: `${(timeLeft / SESSION_LENGTH) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Tabs */}
            <div style={styles.tabs}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    ...styles.tabBtn,
                    ...(activeTab === tab ? styles.tabActive : {}),
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={styles.tabContent}>
              {activeTab === "Study" && (
                <div>
                  <h3>{topic} - {subject} Overview</h3>
                  <p>
                    This is a placeholder for the detailed explanation of <strong>{topic}</strong> in <strong>{subject}</strong> as per <strong>{board}</strong> board for class <strong>{standard}</strong> in <strong>{country}</strong>. 
                    AI-powered summaries and interactive lessons coming soon!
                  </p>
                </div>
              )}

              {activeTab === "Doubt Chat" && (
                <div style={styles.chatContainer}>
                  <div style={styles.chatMessages}>
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          ...styles.chatMessage,
                          ...(msg.from === "user" ? styles.chatUser : styles.chatAi),
                        }}
                      >
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <div style={styles.chatInputWrapper}>
                    <input
                      style={styles.chatInput}
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your doubt here..."
                    />
                    <button style={styles.chatSendBtn} onClick={sendChatMessage}>
                      Send
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "Clarifications" && (
                <div>
                  <p>Here you will see your clarified doubts and feedback from AI tutor.</p>
                  <p>(Feature coming soon)</p>
                </div>
              )}

              {activeTab === "Continue" && (
                <div style={{ textAlign: "center" }}>
                  <p>Your 45-minute session ended.</p>
                  <button style={styles.continueBtn} onClick={continueSession}>
                    Continue for Another 45 Minutes
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* 🎨 STYLES */
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0a1428, #031021)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: 24,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 720,
    background: "#0e1a38",
    borderRadius: 24,
    padding: 28,
    color: "#e0e7f3",
    boxShadow: "0 35px 75px rgba(0,0,0,0.8)",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#4fd1c5",
    marginBottom: 20,
    textAlign: "center",
    letterSpacing: 1,
  },
  formRow: {
    display: "flex",
    gap: 14,
    marginBottom: 16,
  },
  select: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "none",
    background: "#0b1330",
    color: "#a0cbdc",
    fontSize: 16,
    cursor: "pointer",
    boxShadow: "inset 0 0 10px #0f1a45",
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 14,
    border: "none",
    background: "#0b1330",
    color: "#a0cbdc",
    fontSize: 16,
    marginBottom: 20,
    boxShadow: "inset 0 0 12px #0f1a45",
  },
  startBtn: {
    width: "100%",
    padding: 16,
    background: "#22d3ee",
    color: "#031021",
    fontWeight: "700",
    border: "none",
    borderRadius: 16,
    cursor: "pointer",
    letterSpacing: 1.2,
    transition: "background 0.3s ease",
  },
  timerWrapper: {
    marginBottom: 16,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    color: "#67e8f9",
  },
  timerBarContainer: {
    height: 12,
    borderRadius: 10,
    background: "#0b1330",
    overflow: "hidden",
  },
  timerBar: {
    height: "100%",
    background: "#22d3ee",
    transition: "width 1s linear",
  },
  tabs: {
    display: "flex",
    gap: 12,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    padding: 12,
    background: "#0b1330",
    color: "#8fbddf",
    fontWeight: "600",
    borderRadius: 12,
    cursor: "pointer",
    border: "none",
    transition: "all 0.3s ease",
  },
  tabActive: {
    background: "#22d3ee",
    color: "#031021",
    boxShadow: "0 0 15px #22d3ee",
  },
  tabContent: {
    minHeight: 160,
  },
  chatContainer: {
    display: "flex",
    flexDirection: "column",
    height: 250,
    background: "#0b1330",
    borderRadius: 14,
    padding: 12,
  },
  chatMessages: {
    flex: 1,
    overflowY: "auto",
    paddingRight: 10,
    marginBottom: 12,
    color: "#e5e7eb",
    fontSize: 14,
  },
  chatMessage: {
    padding: 8,
    borderRadius: 10,
    marginBottom: 8,
    maxWidth: "75%",
    lineHeight: 1.4,
  },
  chatUser: {
    background: "#22d3ee",
    color: "#031021",
    alignSelf: "flex-end",
  },
  chatAi: {
    background: "#1a2c42",
    color: "#a0cbdc",
    alignSelf: "flex-start",
  },
  chatInputWrapper: {
    display: "flex",
    gap: 8,
  },
  chatInput: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    border: "none",
    background: "#020c20",
    color: "#a0cbdc",
    fontSize: 14,
  },
  chatSendBtn: {
    background: "#22d3ee",
    border: "none",
    color: "#031021",
    borderRadius: 14,
    padding: "12px 20px",
    cursor: "pointer",
    fontWeight: "600",
  },
  continueBtn: {
    marginTop: 16,
    padding: 14,
    background: "#22d3ee",
    color: "#031021",
    borderRadius: 16,
    fontWeight: "700",
    cursor: "pointer",
  },
};
