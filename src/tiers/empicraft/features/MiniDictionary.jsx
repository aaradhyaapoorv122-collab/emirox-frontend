import React, { useState } from "react";

const DICTIONARY = {
  reflection: {
    type: "Noun",
    meaning_en: "The bouncing back of light from a surface.",
    sentence: "Reflection helps us see objects in mirrors.",
    local: {
      India: "प्रकाश का किसी सतह से वापस लौटना।",
      Japan: "光が表面から跳ね返ること。",
      China: "光从表面反射回来。",
      UAE: "ارتداد الضوء عن سطح.",
      "South Korea": "빛이 표면에서 되돌아오는 현상.",
      Singapore: "Light bouncing back from a surface.",
      Australia: "Light bouncing back from a surface.",
    },
  },
};

const countries = [
  "India",
  "Japan",
  "China",
  "Australia",
  "Singapore",
  "UAE",
  "South Korea",
];

export default function MiniDictionary() {
  const [word, setWord] = useState("");
  const [country, setCountry] = useState("India");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const searchWord = () => {
    if (!word) return;

    setLoading(true);
    setResult(null);

    setTimeout(() => {
      const key = word.toLowerCase();
      const data = DICTIONARY[key];

      if (data) {
        setResult(data);
      } else {
        setResult({
          type: "—",
          meaning_en: "Meaning will be available soon.",
          sentence: "—",
          local: {},
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>MPLex Dictionary</h2>

        <select
          style={styles.select}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <input
          style={styles.input}
          placeholder="Enter a word (e.g. Reflection)"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />

        <button style={styles.mainBtn} onClick={searchWord}>
          {loading ? "Searching…" : "Search"}
        </button>

        {result && (
          <div style={styles.resultCard}>
            <h3 style={styles.word}>{word}</h3>
            <p style={styles.type}>{result.type}</p>

            <div style={styles.block}>
              <strong>English Meaning</strong>
              <p>{result.meaning_en}</p>
            </div>

            <div style={styles.block}>
              <strong>Local Meaning ({country})</strong>
              <p>{result.local?.[country] || "Coming soon"}</p>
            </div>

            <div style={styles.block}>
              <strong>Sentence</strong>
              <p>{result.sentence}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* 🎨 PREMIUM BEAST STYLES */
const styles = {
  wrapper: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #020617, #0f172a)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 480,
    background: "#0b1220",
    padding: 24,
    borderRadius: 20,
    boxShadow: "0 25px 60px rgba(0,0,0,0.6)",
    color: "#e5e7eb",
  },
  title: {
    textAlign: "center",
    marginBottom: 14,
    color: "#67e8f9",
    fontSize: 20,
  },
  select: {
    width: "100%",
    padding: 10,
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #1e293b",
    color: "#e5e7eb",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    background: "#020617",
    border: "1px solid #1e293b",
    color: "#e5e7eb",
    marginBottom: 12,
  },
  mainBtn: {
    width: "100%",
    padding: 12,
    borderRadius: 14,
    background: "#22d3ee",
    color: "#020617",
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
  },
  resultCard: {
    marginTop: 18,
    padding: 16,
    borderRadius: 16,
    background: "#020617",
    border: "1px solid #22d3ee",
  },
  word: {
    fontSize: 22,
    color: "#67e8f9",
    marginBottom: 4,
  },
  type: {
    fontSize: 12,
    color: "#94a3b8",
    marginBottom: 12,
  },
  block: {
    marginBottom: 10,
    fontSize: 14,
  },
};
