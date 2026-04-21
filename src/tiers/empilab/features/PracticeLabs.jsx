import React, { useState } from "react";

const labsData = [
  {
    id: 1,
    title: "Mathematics Lab",
    description: "Practice math problems and exercises to boost skills.",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    title: "Science Lab",
    description: "Explore experiments and concepts with interactive questions.",
    color: "linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)",
  },
  {
    id: 3,
    title: "Writing Lab",
    description: "Improve your writing with guided prompts and feedback.",
    color: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  },
  {
    id: 4,
    title: "Communication Lab",
    description: "Practice speaking and communication skills interactively.",
    color: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
  },
  {
    id: 5,
    title: "Arts Lab",
    description: "Explore creative tasks and visual arts exercises.",
    color: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
  },
];

export default function InteractivePracticeLabs() {
  const [selectedLab, setSelectedLab] = useState(null);
  const [userInput, setUserInput] = useState("");
  const [practiceOutput, setPracticeOutput] = useState([]);

  function handleStartLab(lab) {
    setSelectedLab(lab);
    setUserInput("");
    setPracticeOutput([
      {
        from: "system",
        text: `Welcome to the ${lab.title}! Type your practice input below to get started.`,
      },
    ]);
  }

  function handleUserSubmit() {
    if (!userInput.trim()) return;

    // Add user input
    setPracticeOutput((prev) => [
      ...prev,
      { from: "user", text: userInput },
      {
        from: "system",
        text: `Great input! (Fake AI response placeholder) We'll improve this soon with real AI.`,
      },
    ]);
    setUserInput("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #f9fafc, #d9e2ec, #cbd6e2)",
        padding: "2rem 1rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#1f2937",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontWeight: "700",
          fontSize: "2.4rem",
          marginBottom: "1rem",
          color: "#334155",
        }}
      >
        Interactive Practice Labs
      </h1>

      {/* Lab grid */}
      {!selectedLab && (
        <div
          style={{
            width: "100%",
            maxWidth: 960,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            paddingBottom: "3rem",
          }}
        >
          {labsData.map((lab) => (
            <div
              key={lab.id}
              onClick={() => handleStartLab(lab)}
              style={{
                cursor: "pointer",
                borderRadius: 20,
                color: "white",
                padding: "1.8rem 1.5rem",
                background: lab.color,
                boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 180,
                transition: "transform 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <h3 style={{ margin: 0, fontWeight: "700", fontSize: "1.3rem" }}>
                {lab.title}
              </h3>
              <p style={{ marginTop: 8, fontSize: "1rem", fontWeight: "500" }}>
                {lab.description}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Selected lab interactive area */}
      {selectedLab && (
        <div
          style={{
            width: "100%",
            maxWidth: 700,
            background: "white",
            borderRadius: 20,
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            padding: "2rem 2.5rem",
            color: "#334155",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            minHeight: 400,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0 }}>{selectedLab.title}</h2>
            <button
              onClick={() => setSelectedLab(null)}
              style={{
                background: "#e5e7eb",
                border: "none",
                borderRadius: "50%",
                width: 32,
                height: 32,
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "1.2rem",
                color: "#475569",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
              title="Close Lab"
            >
              ×
            </button>
          </div>

          {/* Practice chat/output area */}
          <div
            style={{
              flexGrow: 1,
              overflowY: "auto",
              border: "1.5px solid #cbd6e2",
              borderRadius: 14,
              padding: "1rem",
              background: "#f1f5f9",
              fontSize: 15,
              lineHeight: 1.4,
              maxHeight: 250,
            }}
          >
            {practiceOutput.map((msg, i) => (
              <div
                key={i}
                style={{
                  textAlign: msg.from === "system" ? "left" : "right",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    backgroundColor:
                      msg.from === "system" ? "#dbeafe" : "#c8e6c9",
                    color: msg.from === "system" ? "#1e3a8a" : "#256029",
                    padding: "0.5rem 1rem",
                    borderRadius: 20,
                    maxWidth: "80%",
                    boxShadow:
                      msg.from === "system"
                        ? "0 2px 8px rgba(66, 139, 202, 0.3)"
                        : "0 2px 8px rgba(76, 175, 80, 0.3)",
                    fontSize: 14,
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}
          </div>

          {/* Input + submit */}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <input
              type="text"
              placeholder="Type your practice answer or question here..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUserSubmit()}
              style={{
                flexGrow: 1,
                padding: "0.6rem 1rem",
                borderRadius: 20,
                border: "1.5px solid #a5b4fc",
                fontSize: 16,
                outline: "none",
              }}
            />
            <button
              onClick={handleUserSubmit}
              style={{
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: 20,
                color: "#fff",
                fontWeight: "600",
                padding: "0 1.3rem",
                cursor: "pointer",
                fontSize: 16,
                boxShadow: "0 5px 15px rgba(102, 126, 234, 0.6)",
                transition: "background 0.3s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #5a6fdc 0%, #6b3e8b 100%)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background =
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)")
              }
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
