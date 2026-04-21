// QuestionRenderer.jsx
export default function QuestionRenderer({ q, value, onChange }) {
  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #031a26, #082c4b)",
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        boxShadow: "0 0 15px #20e3b299",
        userSelect: "none",
      }}
    >
      <h3
        style={{
          color: "#20e3b2",
          fontWeight: "700",
          marginBottom: 12,
          textShadow: "0 0 8px #20e3b2bb",
          fontSize: 20,
          letterSpacing: 0.6,
        }}
      >
        {q.question}
      </h3>

      {q.type === "mcq" &&
        q.options.map((opt) => (
          <label
            key={opt}
            style={{
              display: "inline-block",
              background:
                value === opt
                  ? "#20e3b2"
                  : "#0f2e48",
              padding: "10px 18px",
              borderRadius: 12,
              marginRight: 12,
              marginBottom: 12,
              color: value === opt ? "#031a26" : "#c4f0f9",
              cursor: "pointer",
              fontWeight: "600",
              transition: "all 0.3s ease",
              userSelect: "none",
              boxShadow:
                value === opt
                  ? "0 0 15px #20e3b2aa"
                  : "none",
            }}
          >
            <input
              type="radio"
              name={q.id}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              style={{ display: "none" }}
            />
            {opt}
          </label>
        ))}

      {q.type === "truefalse" && (
        <div style={{ display: "flex", gap: 20 }}>
          {["True", "False"].map((val) => (
            <button
              key={val}
              onClick={() => onChange(val === "True")}
              style={{
                padding: "10px 28px",
                borderRadius: 20,
                fontWeight: "600",
                cursor: "pointer",
                border: "none",
                background: value === (val === "True") ? "#20e3b2" : "#0f2e48",
                color: value === (val === "True") ? "#031a26" : "#c4f0f9",
                boxShadow: value === (val === "True") ? "0 0 15px #20e3b2aa" : "none",
                transition: "all 0.3s ease",
                userSelect: "none",
              }}
            >
              {val}
            </button>
          ))}
        </div>
      )}

      {q.type === "fill" && (
        <input
          placeholder="Type answer"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{
            padding: "12px 18px",
            width: "100%",
            borderRadius: 12,
            border: "2px solid #20e3b2",
            background: "#0f2e48",
            color: "#c4f0f9",
            fontSize: 16,
            fontWeight: "600",
            outline: "none",
            userSelect: "text",
          }}
        />
      )}

      {q.type === "assertion" && (
        <select
          onChange={(e) => onChange(e.target.value)}
          value={value || ""}
          style={{
            padding: "12px 18px",
            width: "100%",
            borderRadius: 12,
            border: "2px solid #20e3b2",
            background: "#0f2e48",
            color: value ? "#031a26" : "#c4f0f9",
            fontWeight: "700",
            fontSize: 16,
            cursor: "pointer",
            userSelect: "none",
          }}
        >
          <option value="" disabled>
            Select your answer
          </option>
          <option value="both-true-related">Both true & related</option>
          <option value="both-true-not-related">Both true but not related</option>
          <option value="assertion-true">Assertion true only</option>
          <option value="both-false">Both false</option>
        </select>
      )}

      {q.type === "map" && (
        <div
          style={{
            marginTop: 12,
            padding: 16,
            border: "2px dashed #20e3b2",
            borderRadius: 16,
            textAlign: "center",
            fontWeight: "600",
            color: "#20e3b2",
            userSelect: "none",
            cursor: "pointer",
          }}
          onClick={() => onChange("tropic_of_cancer")}
          title="Click to mark Tropic of Cancer"
        >
          📍 Click correct region (UI placeholder)
          <br />
          <button
            style={{
              marginTop: 10,
              padding: "8px 24px",
              borderRadius: 20,
              border: "none",
              background: "#20e3b2",
              color: "#031a26",
              fontWeight: "700",
              cursor: "pointer",
              boxShadow: "0 0 15px #20e3b2aa",
              userSelect: "none",
            }}
          >
            Mark Tropic of Cancer
          </button>
        </div>
      )}
    </div>
  );
}
