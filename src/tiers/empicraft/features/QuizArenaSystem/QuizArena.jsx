import React, { useState, useEffect } from "react";
import api from "../../../../utils/api.js";
/* ================= CONFIG ================= */
const MAX_ATTEMPTS = 3;

const subjects = ["Science", "Math", "English", "SST", "Computer", "Hindi"];

const patterns = [
  { id: "practice", label: "Practice Mode (Easy)" },
  { id: "mock20", label: "Mock Test (20 Marks)" },
  { id: "mock40", label: "Full Test (40 Marks)" },
  { id: "school", label: "School Pattern (NCERT/CBSE)" },
];

/* ================= MAIN ================= */
export default function QuizArena() {
  const [subject, setSubject] = useState("Science");
  const [topic, setTopic] = useState("");
  const [pattern, setPattern] = useState("practice");

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!questions.length || submitted) return;

    if (timer <= 0) handleSubmit();

    const t = setInterval(() => setTimer((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timer, submitted]);

  /* ================= START QUIZ ================= */
  const startTest = async () => {
    if (!topic) return alert("Enter topic");
    if (attempts >= MAX_ATTEMPTS) return;

    setLoading(true);
    setError("");

    try {
      const response = await api.sendAIMessage({
        message: `
Generate a ${pattern} quiz.

Subject: ${subject}
Topic: ${topic}

Requirements:
- Mix MCQ, True/False, Fill in blanks
- Exam pattern based (CBSE/NCERT style)
- Include answers + solutions
- Marks distribution based on pattern
Return JSON format only:
{
  questions: [
    {
      type: "mcq|truefalse|fill",
      question: "",
      options: [],
      answer: "",
      solution: "",
      marks: 1
    }
  ]
}
        `,
        feature: "quiz_ai",
        standard: "8",
        context: { subject, topic, pattern },
      });

      let parsed;
      try {
        parsed = JSON.parse(response);
      } catch {
        throw new Error("Invalid AI response format");
      }

      setQuestions(parsed.questions || []);
      setCurrent(0);
      setAnswers({});
      setSubmitted(false);
      setScore(0);
      setAttempts((p) => p + 1);

      setTimer(
        pattern === "mock40" ? 2400 :
        pattern === "mock20" ? 1200 :
        900
      );

    } catch (err) {
      setError("⚠️ AI failed to generate quiz");
      console.error(err);
    }

    setLoading(false);
  };

  /* ================= ANSWERS ================= */
  const handleAnswer = (val) => {
    if (submitted) return;
    setAnswers({ ...answers, [current]: val });
  };

  const calculateScore = () => {
    let s = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        s += q.marks || 1;
      }
    });
    return s;
  };

  const handleSubmit = () => {
    setScore(calculateScore());
    setSubmitted(true);
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60).toString().padStart(2, "0");
    const s = (t % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ================= UI ================= */
  return (
    <div style={ui.page}>

      {/* HEADER */}
      <div style={ui.header}>
        <h2>🧠 Quiz AI Arena (EmpiCraft)</h2>
        <div>⏱ {formatTime(timer)}</div>
      </div>

      {/* SETUP PANEL */}
      {!questions.length && (
        <div style={ui.setup}>
          <select style={ui.input} onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => <option key={s}>{s}</option>)}
          </select>

          <input
            style={ui.input}
            placeholder="Enter Topic (e.g. Light, Force, Algebra)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <select style={ui.input} onChange={(e) => setPattern(e.target.value)}>
            {patterns.map((p) => (
              <option key={p.id} value={p.id}>{p.label}</option>
            ))}
          </select>

          <button style={ui.startBtn} onClick={startTest}>
            {loading ? "Generating AI Quiz..." : "Start Quiz 🚀"}
          </button>

          <p>Attempts left: {MAX_ATTEMPTS - attempts}</p>

          {error && <p style={ui.error}>{error}</p>}
        </div>
      )}

      {/* QUIZ */}
      {questions.length > 0 && (
        <>
          <div style={ui.body}>
            <h3>
              Q{current + 1}. {questions[current].question}
            </h3>

            {/* MCQ */}
            {questions[current].type === "mcq" &&
              questions[current].options?.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    ...ui.option,
                    ...(answers[current] === opt ? ui.selected : {}),
                    ...(submitted && opt === questions[current].answer ? ui.correct : {}),
                  }}
                >
                  {opt}
                </div>
              ))}

            {/* TRUE FALSE */}
            {questions[current].type === "truefalse" &&
              ["True", "False"].map((val) => (
                <div
                  key={val}
                  onClick={() => handleAnswer(val === "True")}
                  style={ui.option}
                >
                  {val}
                </div>
              ))}

            {/* FILL */}
            {questions[current].type === "fill" && (
              <input
                style={ui.input}
                onChange={(e) => handleAnswer(e.target.value)}
              />
            )}

            {submitted && (
              <div style={ui.solution}>
                💡 {questions[current].solution}
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div style={ui.footer}>
            {!submitted ? (
              <button style={ui.submit} onClick={handleSubmit}>
                Submit Quiz
              </button>
            ) : (
              <div style={ui.result}>
                🎯 Score: {score} / {questions.reduce((a, b) => a + (b.marks || 1), 0)}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

/* ================= UI ================= */
const ui = {
  page: { background: "#0b1220", color: "white", minHeight: "100vh", padding: 20 },
  header: { display: "flex", justifyContent: "space-between", padding: 10 },
  setup: { maxWidth: 500, margin: "auto", display: "flex", flexDirection: "column", gap: 10 },
  input: { padding: 12, borderRadius: 8 },
  startBtn: { padding: 14, background: "#2563eb", color: "white", border: "none" },
  body: { marginTop: 20 },
  option: { padding: 12, margin: 8, background: "#1e293b", cursor: "pointer" },
  selected: { background: "#2563eb" },
  correct: { background: "#16a34a" },
  solution: { marginTop: 10, padding: 10, background: "#1e293b" },
  footer: { marginTop: 20 },
  submit: { width: "100%", padding: 14, background: "#22c55e", border: "none" },
  result: { textAlign: "center", fontSize: 20 },
  error: { color: "red" },
};