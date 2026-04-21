// TeamStudyHub.jsx
import React, { useState } from "react";

/* ---------------- UTILITIES ---------------- */
const generateMeetingID = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const fakeAISessionSummary = (messages) => {
  const important = messages.filter(m => m.type === "important").map(m => m.text);
  const confusion = messages.filter(m => m.type === "confusion").map(m => m.text);
  const normal = messages.filter(m => m.type === "chat").map(m => m.text);

  return `
📌 SESSION SUMMARY (SESSION-BOUND)

🧠 Topics Discussed:
${normal.slice(0, 5).map(t => `• ${t}`).join("\n")}

⭐ Important Points:
${important.length ? important.map(t => `• ${t}`).join("\n") : "• None"}

❓ Confusions:
${confusion.length ? confusion.map(t => `• ${t}`).join("\n") : "• None"}

🧪 Quiz Focus:
• Derived from important + confusion
`;
};

const fakeAINotesGenerator = (summary) => `
📘 PERMANENT NOTES (FROM SESSION)

${summary}

📝 Cleaned & Structured:
• Quiz-oriented
• Revision-ready
• Career-aligned
`;

/* ---------------- COMPONENT ---------------- */
export default function TeamStudyHub() {
  const [meetingID] = useState(generateMeetingID());
  const [joined, setJoined] = useState(false);
  const [duration, setDuration] = useState(60);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const [sessionSummary, setSessionSummary] = useState("");
  const [finalNotes, setFinalNotes] = useState("");

  const sendMessage = (type) => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, type }]);
    setInput("");
  };

  const endSession = () => {
    const summary = fakeAISessionSummary(messages);
    setSessionSummary(summary);
    setFinalNotes(fakeAINotesGenerator(summary));
  };

  return (
    <div className="page">
      {/* ---------------- STYLES ---------------- */}
      <style>{`
        .page {
          min-height: 100vh;
          padding: 30px;
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          font-family: "Inter", system-ui;
          color: #fff;
          animation: fadeIn 0.6s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.25);
          animation: fadeIn 0.5s ease;
        }

        h1, h2, h3 {
          margin-top: 0;
        }

        button {
          background: linear-gradient(135deg, #7f5cff, #5f9cff);
          border: none;
          border-radius: 10px;
          padding: 10px 16px;
          color: white;
          cursor: pointer;
          margin-right: 8px;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(0,0,0,0.3);
        }

        input, select {
          padding: 8px;
          border-radius: 8px;
          border: none;
          margin-right: 8px;
          margin-top: 6px;
        }

        .flex {
          display: flex;
          gap: 20px;
        }

        .chatBox {
          background: rgba(0,0,0,0.25);
          border-radius: 10px;
          padding: 10px;
          min-height: 120px;
          margin-bottom: 10px;
        }

        pre {
          white-space: pre-wrap;
        }
      `}</style>

      <h1>🧠 EmpiLab — Friend Study</h1>

      {!joined ? (
        <div className="card">
          <p><b>Meeting ID:</b> {meetingID}</p>

          <label>Duration:</label><br />
          <select value={duration} onChange={e => setDuration(+e.target.value)}>
            <option value={30}>30 min — Quiz Prep</option>
            <option value={60}>60 min — Concept Clarity</option>
            <option value={90}>90 min — Deep + Career</option>
          </select>

          <br /><br />
          <button onClick={() => setJoined(true)}>Start / Join Session</button>
          <p>🎟 Invite Pass • Discount Applied (fake)</p>
        </div>
      ) : (
        <>
          <div className="card">
            <b>Room:</b> {meetingID} | ⏱ {duration} min | 🔴 Recording ON
          </div>

          <div className="card">
            🎥 Live Video Grid (Zoom-like UI placeholder)
          </div>

          <div className="flex">
            <div className="card" style={{ flex: 2 }}>
              <h3>💬 Chat</h3>
              <div className="chatBox">
                {messages.map((m, i) => (
                  <div key={i}>
                    {m.type === "important" && "⭐ "}
                    {m.type === "confusion" && "❓ "}
                    {m.text}
                  </div>
                ))}
              </div>

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type message"
              />
              <br /><br />
              <button onClick={() => sendMessage("chat")}>Send</button>
              <button onClick={() => sendMessage("important")}>⭐ Important</button>
              <button onClick={() => sendMessage("confusion")}>❓ Confusion</button>
            </div>

            <div className="card" style={{ flex: 1 }}>
              <h3>🧠 Tools</h3>
              <p>✏️ Pen</p>
              <p>📄 Screen Share</p>
              <p>🎯 Career Tools</p>
              <p>🧪 Quiz Prep</p>
            </div>
          </div>

          <button onClick={endSession}>End Session</button>

          {sessionSummary && (
            <div className="card">
              <h3>📄 Session Summary</h3>
              <pre>{sessionSummary}</pre>

              <h3>📘 Notes Generator Output</h3>
              <pre>{finalNotes}</pre>
            </div>
          )}
        </>
      )}
    </div>
  );
}
