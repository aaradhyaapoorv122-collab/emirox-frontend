import React, { useState } from "react";
import api from "../../../utils/api.js";
import { BrainCore } from "@/utils/memoryEngine";

export default function TestReviewSystem() {
  const [subject, setSubject] = useState("Mathematics");
  const [examType, setExamType] = useState("Written");
  const [totalMarks, setTotalMarks] = useState("80");
  const [negativeMarking, setNegativeMarking] = useState("No");

  const [pattern, setPattern] = useState("");
  const [questionPaper, setQuestionPaper] = useState("");
  const [answers, setAnswers] = useState("");

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");

  /* ================= RUN AI ================= */
  const evaluateTest = async () => {
  if (!answers.trim()) {
    alert("Please enter your answers.");
    return;
  }

  setLoading(true);
  setReport("");

  const user = JSON.parse(localStorage.getItem("user")) || { id: "guest" };

  try {
    const reply = await api.sendAIMessage({
      feature: "test_review_ai",
      standard: "8",
      context: `Subject: ${subject}`,
      message: `
You are evaluating a student test.

SUBJECT: ${subject}
EXAM TYPE: ${examType}
TOTAL MARKS: ${totalMarks}
NEGATIVE MARKING: ${negativeMarking}

EXAM PATTERN:
${pattern}

QUESTION PAPER:
${questionPaper}

STUDENT ANSWERS:
${answers}

Generate:

🎯 Score Estimate
📈 Accuracy %
✅ Strong Areas
⚠️ Weak Areas
❌ Mistakes
📚 Improvement Plan
🚀 Readiness Level
💬 Motivation Note
      `,
    });

    setReport(reply);

    // 🧠 Extract simple AI metrics (basic version)
    const estimatedScoreMatch = reply.match(/Score Estimate.*?(\d+)/i);
    const accuracyMatch = reply.match(/Accuracy.*?(\d+)%/i);

    const score = estimatedScoreMatch ? estimatedScoreMatch[1] : "unknown";
    const accuracy = accuracyMatch ? accuracyMatch[1] : "unknown";

    // 🧠 FIXED BrainCore logging
    await BrainCore.log(user.id, "test_review", {
      subject,
      examType,
      totalMarks,
      score,
      accuracy,
      answerLength: answers.length,
      timestamp: new Date().toISOString(),
    });

  } catch (err) {
    console.log(err);
    setReport("⚠️ AI failed to generate report. Please try again.");
  }

  setLoading(false);
};

  /* ================= SAVE ================= */
  const saveReport = () => {
    if (!report) return alert("No report to save.");
    localStorage.setItem("empirox_test_report", report);
    alert("✅ Report saved successfully");
  };

  /* ================= IMPROVE PLAN ================= */
  const improvePlan = () => {
    alert("🚀 Improvement planner can be connected next.");
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Test Review AI</h1>
        <p style={styles.subTitle}>
          Predict Score • Remove Fear • Improve Faster
        </p>
      </div>

      <div style={styles.grid}>
        {/* LEFT */}
        <div style={styles.card}>
          <h3 style={styles.heading}>📝 Test Setup</h3>

          <label style={styles.label}>Subject</label>
          <select
            style={styles.input}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option>Mathematics</option>
            <option>Science</option>
            <option>English</option>
            <option>Social Science</option>
            <option>Competitive Exam</option>
          </select>

          <label style={styles.label}>Exam Type</label>
          <select
            style={styles.input}
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
          >
            <option>Written</option>
            <option>MCQ</option>
            <option>Mixed</option>
          </select>

          <label style={styles.label}>Total Marks</label>
          <input
            style={styles.input}
            value={totalMarks}
            onChange={(e) => setTotalMarks(e.target.value)}
          />

          <label style={styles.label}>Negative Marking</label>
          <select
            style={styles.input}
            value={negativeMarking}
            onChange={(e) => setNegativeMarking(e.target.value)}
          >
            <option>No</option>
            <option>Yes</option>
          </select>

          <label style={styles.label}>Exam Pattern</label>
          <textarea
            style={styles.textareaSmall}
            placeholder="Example:
Section A: 20 MCQ ×1
Section B: 5 Questions ×3"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          />

          <label style={styles.label}>Question Paper</label>
          <textarea
            style={styles.textarea}
            placeholder="Paste full paper here.

If paper is long:
Paste only important questions.

Mobile users can manually type questions."
            value={questionPaper}
            onChange={(e) => setQuestionPaper(e.target.value)}
          />

          <label style={styles.label}>Your Answers</label>
          <textarea
            style={styles.textarea}
            placeholder="Q1: B
Q2: 54
Q3: Photosynthesis is..."
            value={answers}
            onChange={(e) => setAnswers(e.target.value)}
          />

          <button
            style={styles.mainBtn}
            onClick={evaluateTest}
            disabled={loading}
          >
            {loading ? "🧠 Reviewing..." : "🚀 Generate Smart Report"}
          </button>
        </div>

        {/* RIGHT */}
        <div style={styles.card}>
          <h3 style={styles.heading}>📈 Smart Report</h3>

          {loading && (
            <div style={styles.loaderWrap}>
              <div style={styles.loader}></div>
              <p style={styles.loadingText}>
                AI is checking your paper...
              </p>
            </div>
          )}

          {!loading && !report && (
            <div style={styles.emptyBox}>
              <div style={styles.emptyEmoji}>📘</div>
              <p>Your premium AI report will appear here</p>
            </div>
          )}

          {!loading && report && (
            <>
              <div style={styles.reportBox}>
                <pre style={styles.reportText}>{report}</pre>
              </div>

              <div style={styles.actions}>
                <button style={styles.smallBtn} onClick={saveReport}>
                  💾 Save Report
                </button>

                <button style={styles.smallBtn} onClick={improvePlan}>
                  📚 Improve Plan
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= PREMIUM UI ================= */

const styles = {
  page: {
    minHeight: "100vh",
    padding: 20,
    background: "#0A0A0A",
    color: "#EAEAEA",
    fontFamily: "Inter, sans-serif",
  },

  header: {
    textAlign: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 36,
    fontWeight: 800,
    margin: 0,
    background: "linear-gradient(135deg, #D4AF37, #8B6B00)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  subTitle: {
    marginTop: 8,
    color: "#A8A8A8",
    fontSize: 15,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },

  card: {
    background: "rgba(0,0,0,0.75)",
    border: "1px solid rgba(255, 215, 0, 0.15)",
    borderRadius: 20,
    padding: 22,
    backdropFilter: "blur(12px)",
  },

  heading: {
    marginTop: 0,
    color: "#D4AF37",
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    color: "#C8C8C8",
    marginBottom: 6,
    display: "block",
    marginTop: 10,
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255, 215, 0, 0.15)",
    background: "rgba(0,0,0,0.9)",
    color: "#EAEAEA",
    outline: "none",
  },

  textareaSmall: {
    width: "100%",
    minHeight: 90,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255, 215, 0, 0.15)",
    background: "rgba(0,0,0,0.9)",
    color: "#EAEAEA",
    resize: "vertical",
  },

  textarea: {
    width: "100%",
    minHeight: 130,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255, 215, 0, 0.15)",
    background: "rgba(0,0,0,0.9)",
    color: "#EAEAEA",
    resize: "vertical",
  },

  mainBtn: {
    width: "100%",
    marginTop: 18,
    padding: 14,
    borderRadius: 14,
    border: "none",
    fontWeight: 700,
    cursor: "pointer",
    background: "linear-gradient(135deg, #D4AF37, #8B6B00)",
    color: "#000",
    boxShadow: "0 0 12px rgba(255, 215, 0, 0.25)",
  },

  emptyBox: {
    minHeight: 320,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    color: "#A8A8A8",
    gap: 10,
  },

  emptyEmoji: {
    fontSize: 42,
  },

  loaderWrap: {
    minHeight: 320,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },

  loader: {
    width: 42,
    height: 42,
    border: "4px solid rgba(255, 215, 0, 0.2)",
    borderTop: "4px solid #D4AF37",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loadingText: {
    marginTop: 15,
    color: "#D4AF37",
  },

  reportBox: {
    background: "rgba(0,0,0,0.85)",
    borderRadius: 16,
    padding: 18,
    border: "1px solid rgba(255, 215, 0, 0.15)",
    maxHeight: "70vh",
    overflowY: "auto",
  },

  reportText: {
    whiteSpace: "pre-wrap",
    margin: 0,
    lineHeight: 1.8,
    fontSize: 14,
    color: "#EAEAEA",
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
  },

  smallBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    border: "1px solid rgba(255, 215, 0, 0.15)",
    background: "rgba(0,0,0,0.8)",
    color: "#D4AF37",
    cursor: "pointer",
    fontWeight: 600,
  },
};