import React, { useState, useRef } from "react";
import api from "../../../utils/api.js";
import { aiRequest } from "@/utils/aiRequest";
import { supabase } from "@/lib/supabaseClient";


export default function TestReviewSystem() {
  const MAX_FILES = 6;

  const [files, setFiles] = useState([]);
  const [answers, setAnswers] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const fileRef = useRef(null);

  /* ================= FILE UPLOAD ================= */
  function handleFileUpload(e) {
    const selected = Array.from(e.target.files);

    if (files.length + selected.length > MAX_FILES) {
      alert("Max 6 files allowed");
      return;
    }

    setFiles((prev) => [...prev, ...selected]);
  }


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

  

  /* ================= AI EVALUATION ================= */
  const evaluateTest = async () => {
    if (files.length === 0) {
      alert("Please upload question paper first");
      return;
    }

    if (!answers.trim()) {
      alert("Please enter your answers");
      return;
    }

    setLoading(true);
    setResult("");

    try {
      const reply = await api.sendAI({
        feature: "test_review_ai",
        message: `
QUESTION PAPER:
${files.map((f) => f.name).join("\n")}

STUDENT ANSWERS:
${answers}

INSTRUCTION:
Evaluate strictly and generate full analytics.
        `,
        context: {
          fileCount: files.length,
          negativeMarking: true,
        },
      });

      setResult(reply);
    } catch (err) {
      setResult("⚠️ AI Error. Try again.");
    }

    setLoading(false);
  };

  return (
    <div className="page">
      <style>{`
        .page {
          min-height: 100vh;
          padding: 40px;
          background: linear-gradient(160deg, #070b1a, #020617);
          color: #e5edff;
          font-family: Inter, system-ui;
        }

        .title {
          font-size: 34px;
          font-weight: 800;
          margin-bottom: 25px;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 30px;
        }

        .card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 22px;
          backdrop-filter: blur(12px);
        }

        .uploadBox {
          border: 2px dashed #3b82f6;
          border-radius: 14px;
          padding: 22px;
          text-align: center;
          cursor: pointer;
          margin-bottom: 18px;
        }

        textarea {
          width: 100%;
          min-height: 140px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid #334155;
          background: #020617;
          color: #e5edff;
          outline: none;
          resize: vertical;
        }

        textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59,130,246,0.2);
        }

        .btn {
          width: 100%;
          margin-top: 14px;
          padding: 14px;
          border-radius: 14px;
          border: none;
          font-weight: 700;
          cursor: pointer;
          background: linear-gradient(135deg, #3b82f6, #22c55e);
          color: #020617;
        }

        .btn:disabled {
          opacity: 0.6;
        }

        .fileList {
          font-size: 13px;
          opacity: 0.8;
          margin-top: 8px;
        }

        .resultBox {
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.6;
          background: rgba(255,255,255,0.03);
          padding: 16px;
          border-radius: 14px;
          border-left: 4px solid #22c55e;
        }

        .loading {
          color: #60a5fa;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          50% { opacity: 0.4; }
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* TITLE */}
      <div className="title">📊 Test Review AI System</div>

      <div className="grid">

        {/* LEFT */}
        <div className="card">
          <h3>Upload Question Paper</h3>

          <div
            className="uploadBox"
            onClick={() => fileRef.current.click()}
          >
            📁 Click to Upload Files
            <div className="fileList">
              {files.length} / {MAX_FILES} files uploaded
            </div>
          </div>

          <input
            type="file"
            multiple
            hidden
            ref={fileRef}
            onChange={handleFileUpload}
          />

          <h3>Your Answers</h3>

          <textarea
            value={answers}
            onChange={(e) => setAnswers(e.target.value)}
            placeholder="Q1: B  Q2: 24  Q3: A ..."
          />

          <button
            className="btn"
            onClick={evaluateTest}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Evaluate Test"}
          </button>
        </div>

        {/* RIGHT */}
        <div className="card">
          <h3>AI Evaluation Result</h3>

          {loading && (
            <div className="loading">
              🧠 AI is analyzing your paper...
            </div>
          )}

          {!loading && result && (
            <div className="resultBox">
              {result}
            </div>
          )}

          {!loading && !result && (
            <p style={{ opacity: 0.6 }}>
              Upload paper + answers to get AI evaluation
            </p>
          )}
        </div>

      </div>
    </div>
  );
}