import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function ParentalUnlockScreen() {
  const navigate = useNavigate();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const correctPin = localStorage.getItem("parentPin"); // read saved PIN

  function handleUnlock() {
    if (pin === correctPin) {
      localStorage.setItem("parentalLocked", "false");
      navigate("/settings");
    } else {
      setError("Incorrect PIN");
    }
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Parental Unlock</h2>

      <input
        type="password"
        maxLength="4"
        placeholder="Enter 4-digit PIN"
        style={styles.input}
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />

      {error && <p style={styles.error}>{error}</p>}

      <button style={styles.btn} onClick={handleUnlock}>
        Unlock
      </button>

      <button style={styles.back} onClick={() => navigate(-1)}>
        Back
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 15,
    maxWidth: 320,
    margin: "80px auto",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: 600,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ccc",
    textAlign: "center",
    fontSize: 18,
  },
  btn: {
    padding: 12,
    borderRadius: 10,
    background: "#4b6bff",
    color: "white",
    border: "none",
    fontSize: 18,
    cursor: "pointer",
  },
  back: {
    padding: 10,
    borderRadius: 10,
    background: "#ddd",
    border: "none",
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
};

export default ParentalUnlockScreen;
