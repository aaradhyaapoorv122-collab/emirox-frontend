// ProfessionalStarterPack.jsx
import React, { useState } from "react";

const careersData = [
  {
    id: 1,
    category: "Technology",
    title: "Software Developer",
    shortIntro: "Build and maintain software applications.",
    criteria: "Bachelor's in CS or related field, coding skills.",
    pros: ["High demand", "Good salary", "Creative work"],
    cons: ["Requires continuous learning", "Sedentary work"],
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: 2,
    category: "Healthcare",
    title: "Nurse",
    shortIntro: "Provide medical care and support to patients.",
    criteria: "Nursing degree, compassionate attitude.",
    pros: ["Rewarding work", "High job security"],
    cons: ["Physically demanding", "Shift work"],
    color: "linear-gradient(135deg, #6dd5ed 0%, #2193b0 100%)",
  },
  {
    id: 3,
    category: "Arts",
    title: "Graphic Designer",
    shortIntro: "Create visual content for digital and print.",
    criteria: "Creativity, proficiency with design tools.",
    pros: ["Creative freedom", "Flexible work options"],
    cons: ["Deadlines pressure", "Freelance instability"],
    color: "linear-gradient(135deg, #f7971e 0%, #ffd200 100%)",
  },
  {
    id: 4,
    category: "Business",
    title: "Marketing Executive",
    shortIntro: "Plan and execute marketing strategies.",
    criteria: "Good communication, analytical skills.",
    pros: ["Dynamic work", "Networking opportunities"],
    cons: ["Performance pressure", "Long hours"],
    color: "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
  },
];

export default function ProfessionalStarterPack() {
  const [userInput, setUserInput] = useState("");
  const [filteredCareers, setFilteredCareers] = useState(careersData);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      from: "ai",
      message:
        "Welcome! Tell me about your strengths or interests, and I will suggest career options for you.",
    },
  ]);

  function handleUserSubmit() {
    if (!userInput.trim()) return;

    // Add user input to chat
    setChatHistory([...chatHistory, { from: "user", message: userInput }]);

    // Dummy AI filtering logic by keyword match on category or title
    const lower = userInput.toLowerCase();
    const filtered = careersData.filter(
      (c) =>
        c.category.toLowerCase().includes(lower) ||
        c.title.toLowerCase().includes(lower)
    );

    setFilteredCareers(filtered.length ? filtered : careersData);

    // Add AI reply with career count
    setChatHistory((prev) => [
      ...prev,
      {
        from: "ai",
        message: filtered.length
          ? `I found ${filtered.length} career options matching your interest. Scroll down to explore!`
          : "I couldn't find exact matches, but here are some popular careers.",
      },
    ]);

    setUserInput("");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, #f0f4ff, #d7e0ff, #c3d1ff)",
        padding: "2rem 1rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#2c3e50",
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
          color: "#34495e",
        }}
      >
        Professional Starter Pack
      </h1>

      {/* Chat style input area */}
      <div
        style={{
          width: "100%",
          maxWidth: 700,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
          padding: "1.5rem",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.8rem",
        }}
      >
        {/* Chat history */}
        <div
          style={{
            maxHeight: 200,
            overflowY: "auto",
            padding: "0 0.5rem",
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          {chatHistory.map((chat, i) => (
            <div
              key={i}
              style={{
                textAlign: chat.from === "ai" ? "left" : "right",
                marginBottom: 6,
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  backgroundColor:
                    chat.from === "ai" ? "#dbeafe" : "#c8e6c9",
                  color: chat.from === "ai" ? "#1e3a8a" : "#256029",
                  padding: "0.5rem 1rem",
                  borderRadius: 20,
                  maxWidth: "80%",
                  fontSize: 14,
                  lineHeight: 1.3,
                  boxShadow:
                    chat.from === "ai"
                      ? "0 2px 8px rgba(66, 139, 202, 0.3)"
                      : "0 2px 8px rgba(76, 175, 80, 0.3)",
                }}
              >
                {chat.message}
              </span>
            </div>
          ))}
        </div>

        {/* Input + submit */}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <input
            type="text"
            placeholder="Tell me your strengths or interests..."
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
              boxShadow:
                "0 5px 15px rgba(102, 126, 234, 0.6)",
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
            Ask
          </button>
        </div>
      </div>

      {/* Career Cards Grid */}
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
          gap: 24,
          paddingBottom: "3rem",
        }}
      >
        {filteredCareers.map((career) => (
          <div
            key={career.id}
            onClick={() => {
              setSelectedCareer(career);
              setShowModal(true);
            }}
            style={{
              cursor: "pointer",
              borderRadius: 20,
              color: "white",
              padding: "1.5rem",
              background: career.color,
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
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
              {career.title}
            </h3>
            <p style={{ marginTop: 8, fontSize: "0.95rem", fontWeight: "500" }}>
              {career.shortIntro}
            </p>
            <small style={{ marginTop: "auto", fontSize: 12, opacity: 0.8 }}>
              {career.category}
            </small>
          </div>
        ))}
      </div>

      {/* Career Details Modal */}
      {showModal && selectedCareer && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
            zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: 20,
              maxWidth: 600,
              width: "100%",
              padding: "2rem 2.5rem",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              color: "#34495e",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
          >
            <h2 style={{ marginTop: 0, fontWeight: "700" }}>
              {selectedCareer.title}
            </h2>
            <p style={{ fontSize: "1.05rem", marginBottom: "1rem" }}>
              {selectedCareer.shortIntro}
            </p>

            <h4>Criteria</h4>
            <p>{selectedCareer.criteria}</p>

            <h4>Pros</h4>
            <ul>
              {selectedCareer.pros.map((pro, i) => (
                <li key={i}>{pro}</li>
              ))}
            </ul>

            <h4>Cons</h4>
            <ul>
              {selectedCareer.cons.map((con, i) => (
                <li key={i}>{con}</li>
              ))}
            </ul>

            <button
              onClick={() => setShowModal(false)}
              style={{
                marginTop: "1.5rem",
                background:
                  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "none",
                borderRadius: 12,
                color: "white",
                padding: "0.6rem 1.2rem",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow:
                  "0 5px 15px rgba(102, 126, 234, 0.6)",
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
              Close
            </button>
          </div>
        </div>
      )}

      {/* Advanced Tier Promotion */}
      <div
        style={{
          marginTop: "auto",
          background: "#34495e",
          color: "white",
          padding: "2rem",
          borderRadius: 20,
          maxWidth: 700,
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        <h3 style={{ margin: 0, marginBottom: "1rem" }}>
          Want to dive deeper into your career?
        </h3>
        <p style={{ marginBottom: "1.5rem" }}>
          Unlock advanced career courses with AI-powered mentoring, real-world projects,
          and expert insights.
        </p>
        <button
          style={{
            background:
              "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)",
            border: "none",
            borderRadius: 20,
            color: "#fff",
            fontWeight: "700",
            padding: "0.8rem 2rem",
            cursor: "pointer",
            fontSize: "1.1rem",
            boxShadow: "0 5px 15px rgba(67, 206, 162, 0.6)",
            transition: "background 0.3s ease",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #3bb58e 0%, #16476d 100%)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background =
              "linear-gradient(135deg, #43cea2 0%, #185a9d 100%)")
          }
          onClick={() => alert("Advanced courses coming soon!")}
        >
          Explore Advanced Courses
        </button>
      </div>
    </div>
  );
}
