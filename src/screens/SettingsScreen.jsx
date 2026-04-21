import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const languages = [
  { code: "en", name: "English (Common)" },
  { code: "hi", name: "Hindi (India)" },
  { code: "ja", name: "Japanese (Japan)" },
  { code: "zh", name: "Chinese (China)" },
  { code: "en-au", name: "English (Australia)" },
  { code: "en-sg", name: "English (Singapore)" },
  { code: "ar", name: "Arabic (UAE)" },
  { code: "ko", name: "Korean (South Korea)" }
];

function SettingsScreen() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState("en");

  const containerStyle = {
    padding: 30,
    maxWidth: 600,
    margin: "40px auto",
    background: "rgba(32, 35, 43, 0.85)", // dark transparent background
    borderRadius: 16,
    color: "#f8fafc",
    fontFamily: "'Poppins', sans-serif",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
  };

  const sectionStyle = {
    marginBottom: 40,
  };

  const dividerStyle = {
    height: 1,
    background: "rgba(255,255,255,0.1)",
    margin: "20px 0",
  };

  const labelStyle = {
    display: "block",
    fontWeight: 700,
    fontSize: 18,
    marginBottom: 12,
    color: "#3b82f6",
    textShadow: "0 1px 3px rgba(59, 130, 246, 0.7)",
  };

  const buttonStyle = {
    width: "100%",
    padding: "16px",
    borderRadius: 12,
    border: "none",
    backgroundColor: "#3b82f6",
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(59, 130, 246, 0.6)",
    transition: "background-color 0.3s ease",
  };

  const handleNextClick = () => {
    // Save the language setting here if needed before navigation
    navigate("/settings/next"); // Next page route
  };

  return (
    <>
      <style>{`
        /* Your original toggle switch styles left here for future use or consistency */
        .switch {
          position: relative;
          display: inline-block;
          width: 46px;
          height: 26px;
        }

        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc;
          border-radius: 26px;
          transition: 0.4s;
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }

        input:checked + .slider {
          background-color: #18e09b;
        }

        input:checked + .slider:before {
          transform: translateX(20px);
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
          padding: 20,
        }}
      >
        <div style={containerStyle}>
          <h1 style={{ marginBottom: 30, fontWeight: 900, fontSize: 28, letterSpacing: "1.2px", textAlign: "center", color: "#3b82f6", textShadow: "0 2px 5px rgba(59, 130, 246, 0.7)" }}>
            Settings
          </h1>

          {/* Language Section */}
          <div style={sectionStyle}>
            <label htmlFor="language-select" style={labelStyle}>
              Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 12,
                border: "none",
                fontSize: 16,
                backgroundColor: "#374151",
                color: "#e0e7ff",
                boxShadow: "inset 0 0 8px #2563eb",
                cursor: "pointer",
                transition: "all 0.3s ease",
                appearance: "none",
                backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='white' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>")`,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 14px center",
                backgroundSize: "18px 18px"
              }}
              onFocus={(e) => (e.target.style.boxShadow = "0 0 12px #3b82f6")}
              onBlur={(e) => (e.target.style.boxShadow = "inset 0 0 8px #2563eb")}
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <small
              style={{
                display: "block",
                marginTop: 8,
                color: "#9ca3af",
                fontSize: 14,
                fontStyle: "italic",
                userSelect: "none",
              }}
            >
              Choose your preferred app interface language.
            </small>
          </div>

          <div style={dividerStyle} />

          {/* Next Button */}
          <button
            onClick={handleNextClick}
            style={buttonStyle}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default SettingsScreen;
