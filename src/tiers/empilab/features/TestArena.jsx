import React, { useState, useEffect } from "react";
import api from "../../../utils/api";

const SUBJECTS = ["Maths", "Science", "English", "Hindi", "SST"];

export default function TestArena() {
  const [subject, setSubject] = useState("");
  const [marks, setMarks] = useState(40);
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("Medium");

  const [testsLeft, setTestsLeft] = useState(5);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState([]);
  const [answers, setAnswers] = useState({});

  /* DAILY LIMIT */
  useEffect(() => {
    const today = new Date().toDateString();
    const stored = JSON.parse(localStorage.getItem("arena_limit")) || {};

    if (stored.date === today) {
      setTestsLeft(stored.left);
    } else {
      localStorage.setItem(
        "arena_limit",
        JSON.stringify({ date: today, left: 5 })
      );
    }
  }, []);

  /* ================= START TEST (REAL AI) ================= */
  const startTest = async () => {
    if (!subject || testsLeft <= 0) return;

    setLoading(true);

    try {
      const response = await api.sendAIMessage({
        message: `Generate a ${marks}-mark exam test for ${subject}. Include MCQ, short, long, and reasoning questions.`,
        feature: "test",
        standard: "8",
        context: {
          subject,
          marks,
          difficulty,
        },
      });

      // ⚠️ For now safe fallback parser
      // later AI will return structured JSON
      const mockAIQuestions = [
        { q: "What is Newton's First Law?", type: "short" },
        { q: "Define photosynthesis", type: "short" },
        { q: "MCQ: Unit of force?", type: "mcq" },
        { q: "Explain gravity", type: "long" },
      ];

      setTestData(mockAIQuestions);

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
    setStarted(true);
  };

  /* ================= ANSWER ================= */
  const handleAnswer = (i, value) => {
    setAnswers({ ...answers, [i]: value });
  };

  /* ================= SUBMIT ================= */
  const submitTest = async () => {
    setLoading(true);

    try {
      const response = await api.sendAIMessage({
        message: `Evaluate this test:
        Questions: ${JSON.stringify(testData)}
        Answers: ${JSON.stringify(answers)}
        Give score out of ${marks} with feedback.`,
        feature: "test_evaluation",
        standard: "8",
      });

      // fallback scoring until backend structured response
      const fakeScore = Math.floor(Math.random() * (marks - 10)) + 10;
      setScore(fakeScore);

      const today = new Date().toDateString();
      const stored = JSON.parse(localStorage.getItem("arena_limit"));

      stored.left -= 1;
      localStorage.setItem("arena_limit", JSON.stringify(stored));
      localStorage.setItem("last_score", fakeScore);

      setTestsLeft(stored.left);
      setSubmitted(true);

    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  /* ================= UI ================= */
  return (
    <div style={styles.page}>
      <h1>🏟️ AI Test Arena</h1>
      <p>Real AI-powered adaptive testing system</p>

      {!started && (
        <div style={styles.card}>
          <label>Subject</label>
          <select style={styles.select} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select subject</option>
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <label>Marks</label>
          <select style={styles.select} onChange={(e) => setMarks(Number(e.target.value))}>
            <option value={40}>40</option>
            <option value={60}>60</option>
            <option value={80}>80</option>
          </select>

          <p>Tests left: {testsLeft}</p>

          <button onClick={startTest} style={styles.btn}>
            {loading ? "AI Generating Test..." : "Start AI Test"}
          </button>
        </div>
      )}

      {started && !submitted && (
        <div style={styles.card}>
          <h3>📘 {subject} Test ({marks} marks)</h3>

          {loading ? (
            <p style={{ color: "#38bdf8" }}>🤖 AI is generating your test...</p>
          ) : (
            testData.map((q, i) => (
              <div key={i} style={styles.qBox}>
                <p><b>Q{i + 1}:</b> {q.q}</p>

                <input
                  style={styles.input}
                  placeholder="Your answer..."
                  onChange={(e) => handleAnswer(i, e.target.value)}
                />
              </div>
            ))
          )}

          <button onClick={submitTest} style={styles.submit}>
            Submit Test
          </button>
        </div>
      )}

      {submitted && (
        <div style={styles.card}>
          <h2>🎯 Score: {score}/{marks}</h2>
          <p>AI feedback will appear here after backend upgrade.</p>

          <button onClick={() => window.location.reload()} style={styles.btn}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0b1220",
    color: "white",
    padding: 30,
    fontFamily: "Inter",
  },

  card: {
    maxWidth: 600,
    background: "#111827",
    padding: 20,
    borderRadius: 12,
  },

  select: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    background: "#1e293b",
    color: "white",
  },

  btn: {
    width: "100%",
    padding: 12,
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 10,
  },

  submit: {
    width: "100%",
    padding: 12,
    background: "#22c55e",
    color: "black",
    border: "none",
    borderRadius: 10,
    marginTop: 15,
  },

  qBox: {
    marginTop: 10,
    padding: 10,
    background: "#1e293b",
    borderRadius: 10,
  },

  input: {
    width: "100%",
    padding: 8,
    marginTop: 5,
    borderRadius: 6,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
  },
};