import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TwoFAVerifyScreen() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [error, setError] = useState(null);

  function handleVerify() {
    if (code.length !== 6) {
      setError("Enter a valid 6-digit code.");
      return;
    }

    // Future backend verification
    navigate("/settings");
  }

  return (
    <div style={styles.container}>
      <h1>Enter Verification Code</h1>

      <input
        maxLength={6}
        placeholder="123456"
        style={styles.input}
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.button} onClick={handleVerify}>
        Verify
      </button>

      <p style={styles.back} onClick={() => navigate(-1)}>
        Back
      </p>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    maxWidth: 400,
    margin: "0 auto",
    textAlign: "center",
  },
  input: {
    width: "100%",
    padding: 12,
    fontSize: 18,
    marginBottom: 10,
    borderRadius: 10,
    border: "1px solid #ccc",
    textAlign: "center",
  },
  button: {
    padding: "12px 20px",
    borderRadius: 10,
    backgroundColor: "#007bff",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
    width: "100%",
    border: "none",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  back: {
    color: "#007bff",
    marginTop: 15,
    cursor: "pointer",
  },
};

export default TwoFAVerifyScreen;
