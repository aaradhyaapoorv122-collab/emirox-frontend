import React, { useEffect, useState } from "react";
import { BrainCore } from "@/utils/memoryEngine";

export default function ConceptBlockBuilder() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")) || { id: "guest" };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("concept_blocks")) || [];
    setBlocks(saved);
  }, []);

  const saveBlocks = (updated) => {
    setBlocks(updated);
    localStorage.setItem("concept_blocks", JSON.stringify(updated));
  };

  const addBlock = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const newBlock = {
      id: Date.now(),
      title,
      content,
      subject: subject || "General",
      masteryLevel: 1, // 🔥 future AI upgrade field
      mistakes: [],
      createdAt: new Date().toISOString(),
    };

    try {
      // 🔥 FIXED: proper async logging + safe values
      await BrainCore.log(user.id, "concept_builder", {
        concept: title,
        subject: newBlock.subject,
        masteryLevel: newBlock.masteryLevel,
        contentLength: content.length,
        timestamp: new Date().toISOString(),
      });

      saveBlocks([newBlock, ...blocks]);

      setTitle("");
      setContent("");
      setSubject("");
    } catch (err) {
      console.error("Memory log failed:", err);
    }

    setLoading(false);
  };

  const deleteBlock = (id) => {
    const updated = blocks.filter((b) => b.id !== id);
    saveBlocks(updated);
  };

  return (
    <>
     <style>{`
  .concept-page {
    background: #0A0A0A;
    min-height: 100vh;
    padding: 40px;
    color: #EAEAEA;
    font-family: Inter, Segoe UI, system-ui, sans-serif;
  }

  .concept-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 40px;
  }

  .panel {
    background: rgba(0,0,0,0.75);
    border-radius: 18px;
    padding: 28px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.6);
    border: 1px solid rgba(255, 215, 0, 0.15);
    backdrop-filter: blur(12px);
  }

  input, textarea {
    width: 100%;
    background: rgba(0,0,0,0.9);
    border: 1px solid rgba(255, 215, 0, 0.15);
    border-radius: 12px;
    padding: 14px;
    margin-bottom: 16px;
    color: #EAEAEA;
    outline: none;
  }

  textarea { 
    min-height: 120px; 
  }

  button {
    background: linear-gradient(135deg, #D4AF37, #8B6B00);
    border: none;
    padding: 12px 22px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: 0.2s ease;
    color: #000;
    box-shadow: 0 0 10px rgba(255, 215, 0, 0.25);
  }

  button:hover {
    transform: scale(1.02);
  }

  .block {
    background: rgba(0,0,0,0.85);
    border-radius: 14px;
    padding: 18px;
    margin-bottom: 16px;
    border-left: 4px solid #D4AF37;
    border: 1px solid rgba(255, 215, 0, 0.12);
  }

  .meta {
    opacity: 0.7;
    font-size: 12px;
    color: #D4AF37;
  }

  .delete {
    background: none;
    border: none;
    color: #ff6b6b;
    margin-top: 6px;
    cursor: pointer;
  }

  .loading {
    opacity: 0.7;
    margin-top: 10px;
    font-size: 12px;
    color: #D4AF37;
  }
`}</style>

      <div className="concept-page">
        <h2>🧠 Concept Block Builder (AI Memory Mode)</h2>

        <div className="concept-grid">
          {/* CREATE */}
          <div className="panel">
            <h3>Create Concept</h3>

            <input
              placeholder="Concept Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Explain the concept deeply..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <input
              placeholder="Subject (optional)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <button onClick={addBlock} disabled={loading}>
              {loading ? "Saving..." : "➕ Add Concept"}
            </button>

            {loading && <div className="loading">Storing in BrainCore memory...</div>}
          </div>

          {/* BLOCKS */}
          <div className="panel">
            <h3>Your Concept Memory</h3>

            {blocks.length === 0 && <p>No concepts stored yet 🧩</p>}

            {blocks.map((b) => (
              <div key={b.id} className="block">
                <h4>{b.title}</h4>
                <p>{b.content}</p>

                <div className="meta">
                  📚 {b.subject} · 🕒 {new Date(b.createdAt).toLocaleString()}
                </div>

                <button className="delete" onClick={() => deleteBlock(b.id)}>
                  🗑 Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}