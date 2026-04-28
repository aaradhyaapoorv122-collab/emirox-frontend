import React, { useState, useEffect } from "react";
import api from "../../../../utils/api.js";

/* ================= CONFIG ================= */
const MAX_ATTEMPTS = 3;

/* ================= REAL CBSE PATTERN ENGINE ================= */
const EXAM_PATTERNS = {
  practice: {
    duration: 900,
    sections: [{ name: "A", type: "mcq", count: 5, marks: 1 }],
  },

  mock20: {
    duration: 1200,
    sections: [
      { name: "A", type: "mcq", count: 8, marks: 1 },
      { name: "B", type: "short", count: 4, marks: 2 },
    ],
  },

  mock40: {
    duration: 2400,
    sections: [
      { name: "A", type: "mcq", count: 10, marks: 1 },
      { name: "B", type: "short", count: 5, marks: 2 },
      { name: "C", type: "long", count: 2, marks: 5 },
      { name: "D", type: "case", count: 2, marks: 4 },
    ],
  },

  school: {
    duration: 2700,
    sections: [
      { name: "A", type: "mcq", count: 15, marks: 1 },
      { name: "B", type: "short", count: 6, marks: 2 },
      { name: "C", type: "long", count: 3, marks: 5 },
      { name: "D", type: "source", count: 2, marks: 4 },
    ],
  },
};

const subjects = ["Science", "Math", "English", "SST", "Computer", "Hindi"];

/* ================= BRAINCORE ================= */
const BrainCore = {
  get: (key) => JSON.parse(localStorage.getItem(key)) || null,
  set: (key, value) =>
    localStorage.setItem(key, JSON.stringify(value)),
  append: (key, value) => {
    const data = BrainCore.get(key) || [];
    data.push(value);
    BrainCore.set(key, data);
  },
  log: (id, type, data) => {
    const logs = BrainCore.get(`${id}_logs`) || [];
    logs.push({ type, data, time: Date.now() });
    BrainCore.set(`${id}_logs`, logs);
  },
};

/* ================= MAIN ================= */
export default function ExamSimulatorAI() {
  const [subject, setSubject] = useState("Science");
  const [topic, setTopic] = useState("");
  const [pattern, setPattern] = useState("practice");

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);

  const [sectionIndex, setSectionIndex] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user")) || {
    id: "guest",
    class: "8",
    board: "CBSE",
  };

  const patternData = EXAM_PATTERNS[pattern];
  const sections = patternData.sections;

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!questions.length || submitted) return;

    const t = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [questions, submitted]);

  /* ================= VALIDATION ================= */
  const syllabusMap = {
    Science: ["cell", "force", "motion", "electricity", "light"],
    Math: ["algebra", "geometry", "ratio"],
    SST: ["history", "geography", "civics"],
    English: ["grammar", "writing", "comprehension"],
    Computer: ["html", "css", "coding"],
    Hindi: ["vyakaran", "sahitya"],
  };

  const validateTopic = (sub, t) =>
    syllabusMap[sub]?.some((x) =>
      t.toLowerCase().includes(x)
    );

  /* ================= START TEST ================= */
  const startTest = async () => {
    if (!topic) return alert("Enter topic");
    if (attempts >= MAX_ATTEMPTS) return;

    if (!validateTopic(subject, topic)) {
      setError("❌ Out of syllabus (NCERT only allowed)");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.sendAIMessage({
        message: `
You are CBSE BOARD EXAM PAPER SETTER AI.

STRICT RULES:
- NCERT only
- NO out-of-syllabus
- Follow section structure exactly
- Include source/case-based questions where required

PATTERN:
${JSON.stringify(patternData)}

Generate EXACT JSON:

[
  {
    "section": "A|B|C|D",
    "type": "mcq|short|long|case|source",
    "question": "",
    "options": [],
    "answer": "",
    "marks": 1,
    "source": "NCERT reference if needed",
    "difficulty": "easy|medium|hard",
    "explanation": ""
  }
]

SUBJECT: ${subject}
TOPIC: ${topic}
        `,
        feature: "exam_ai",
        context: { subject, topic, pattern },
      });

      const parsed = JSON.parse(
        res.replace(/```json|```/g, "")
      );

      if (!parsed?.length)
        throw new Error("Invalid AI output");

      setQuestions(parsed);
      setTimer(patternData.duration);
      setCurrent(0);
      setAnswers({});
      setSubmitted(false);
      setAttempts((p) => p + 1);
    } catch (e) {
      setError("⚠️ AI failed to generate exam paper");
    }

    setLoading(false);
  };

  /* ================= SCORING ================= */
  const calculateScore = () => {
    let s = 0;

    questions.forEach((q, i) => {
      if (
        (answers[i] || "").toString().toLowerCase() ===
        (q.answer || "").toString().toLowerCase()
      ) {
        s += q.marks || 1;
      }
    });

    return s;
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    const final = calculateScore();
    setScore(final);
    setSubmitted(true);

    BrainCore.log(user.id, "exam_result", {
      subject,
      topic,
      pattern,
      score: final,
      total: questions.reduce(
        (a, b) => a + (b.marks || 1),
        0
      ),
    });
  };

  const currentSection = sections[sectionIndex];
  const filteredQuestions = questions.filter(
    (q) => q.section === currentSection?.name
  );

  /* ================= UI ================= */
  return (
    <div style={ui.page}>
      <div style={ui.header}>
        <h2>🧠 Empirox Exam Simulator AI v2</h2>
        <div>⏱ {timer}s</div>
      </div>

      {!questions.length && (
        <div style={ui.setup}>
          <select onChange={(e) => setSubject(e.target.value)}>
            {subjects.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            placeholder="Enter Topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />

          <select onChange={(e) => setPattern(e.target.value)}>
            {Object.keys(EXAM_PATTERNS).map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>

          <button onClick={startTest}>
            {loading
              ? "Generating Exam..."
              : "Start Exam 🚀"}
          </button>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}

      {questions.length > 0 && (
        <>
          {/* SECTION NAV */}
          <div style={ui.sectionBar}>
            {sections.map((s, i) => (
              <button
                key={i}
                onClick={() => setSectionIndex(i)}
                style={{
                  background:
                    i === sectionIndex ? "#D4AF37" : "#222",
                  color: "#fff",
                  padding: 10,
                  margin: 5,
                }}
              >
                Section {s.name}
              </button>
            ))}
          </div>

          {/* QUESTION */}
          <h3>
            Q{current + 1}.{" "}
            {filteredQuestions[current]?.question}
          </h3>

          {(filteredQuestions[current]?.options || []).map(
            (opt, i) => (
              <div
                key={i}
                onClick={() =>
                  setAnswers({
                    ...answers,
                    [current]: opt,
                  })
                }
                style={ui.option}
              >
                {opt}
              </div>
            )
          )}

          <button onClick={handleSubmit}>
            Submit Exam
          </button>

          {submitted && (
            <h2>🎯 Score: {score}</h2>
          )}
        </>
      )}
    </div>
  );
}

/* ================= UI ================= */
const ui = {
  page: {
    background: "#0A0A0A",
    color: "#fff",
    minHeight: "100vh",
    padding: 20,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    color: "#D4AF37",
  },
  setup: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    maxWidth: 400,
  },
  option: {
    padding: 10,
    margin: 5,
    background: "#111",
    cursor: "pointer",
  },
  sectionBar: {
    display: "flex",
    gap: 10,
    marginBottom: 10,
  },
};