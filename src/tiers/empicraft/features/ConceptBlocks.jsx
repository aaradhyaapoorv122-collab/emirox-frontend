import React, { useEffect, useState } from "react";

export default function ConceptBlockBuilder() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("concept_blocks")) || [];
    setBlocks(saved);
  }, []);

  const saveBlocks = (updated) => {
    setBlocks(updated);
    localStorage.setItem("concept_blocks", JSON.stringify(updated));
  };

  const addBlock = () => {
    if (!title || !content) return alert("Please fill all fields");

    const newBlock = {
      id: Date.now(),
      title,
      content,
      subject,
      createdAt: new Date().toLocaleDateString(),
    };

    saveBlocks([newBlock, ...blocks]);
    setTitle("");
    setContent("");
    setSubject("");
  };

  const deleteBlock = (id) => {
    saveBlocks(blocks.filter((b) => b.id !== id));
  };

  return (
    <>
      {/* ✅ INLINE CSS (NO NEW FILE) */}
      <style>{`
        .concept-page {
          background: radial-gradient(circle at top left, #0f3d2e, #071b14 70%);
          min-height: 100vh;
          padding: 40px;
          color: #e6fff3;
          font-family: Inter, Segoe UI, system-ui, sans-serif;
        }

        .concept-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 40px;
        }

        .panel {
          background: linear-gradient(160deg, #123f2e, #0a261c);
          border-radius: 18px;
          padding: 28px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.4);
        }

        input, textarea {
          width: 100%;
          background: #071b14;
          border: 1px solid #1d6b4f;
          border-radius: 12px;
          padding: 14px;
          margin-bottom: 16px;
          color: #d9fff0;
          outline: none;
        }

        textarea { min-height: 100px; }

        button {
          background: linear-gradient(135deg, #38d39f, #4fa3ff);
          border: none;
          padding: 12px 22px;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .block {
          background: linear-gradient(150deg, #102f24, #0b1f18);
          border-radius: 14px;
          padding: 18px;
          margin-bottom: 16px;
          border-left: 4px solid #38d39f;
        }

        .delete {
          background: none;
          border: none;
          color: #ff6b6b;
          margin-top: 6px;
          cursor: pointer;
        }
      `}</style>

      <div className="concept-page">
        <h2>🧩 Concept Block Builder</h2>

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
              placeholder="Explain the concept..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <input
              placeholder="Subject (optional)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />

            <button onClick={addBlock}>➕ Add</button>
          </div>

          {/* BLOCKS */}
          <div className="panel">
            <h3>Your Blocks</h3>

            {blocks.map((b) => (
              <div key={b.id} className="block">
                <h4>{b.title}</h4>
                <p>{b.content}</p>
                <small>{b.subject} · {b.createdAt}</small>
                <br />
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
