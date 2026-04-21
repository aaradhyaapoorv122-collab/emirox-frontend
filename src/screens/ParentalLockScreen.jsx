import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ParentalAnd2FA({ userId }) {
  // -----------------------------------
  // 🟦 Parental Lock States
  // -----------------------------------
  const [isLocked, setIsLocked] = useState(false);
  const [pin, setPin] = useState(""); 
  const [enteredPin, setEnteredPin] = useState("");
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [showPinCheck, setShowPinCheck] = useState(false);

  // Load saved data
  useEffect(() => {
    const savedPin = localStorage.getItem("parentPin");
    const lockState = localStorage.getItem("parentalLocked");

    if (savedPin) setPin(savedPin);
    if (lockState === "true") setIsLocked(true);
  }, []);

  const handleToggle = () => {
    if (!pin) {
      setShowPinSetup(true);
    } else if (!isLocked) {
      setIsLocked(true);
      localStorage.setItem("parentalLocked", "true");
    } else {
      setShowPinCheck(true);
    }
  };

  const handleSavePin = () => {
    if (enteredPin.length !== 4) return;

    setPin(enteredPin);
    localStorage.setItem("parentPin", enteredPin);
    localStorage.setItem("parentalLocked", "true");

    setEnteredPin("");
    setShowPinSetup(false);
    setIsLocked(true);
  };

  const handleUnlock = () => {
    if (enteredPin === pin) {
      setIsLocked(false);
      localStorage.setItem("parentalLocked", "false");
      setEnteredPin("");
      setShowPinCheck(false);
    }
  };

  // -----------------------------------
  // 🟩 2FA Setup States
  // -----------------------------------
  const [qr, setQr] = useState(null);
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0); // 0 = idle, 1 = QR, 2 = enabled

  async function handleGenerate2FA() {
    setLoading(true);
    const r = await axios.post("/api/2fa/generate", { userId });
    setQr(r.data.qrDataUrl);
    setLoading(false);
    setStep(1);
  }

  async function handleVerify2FA() {
    setLoading(true);

    try {
      const r = await axios.post("/api/2fa/verify", { userId, token });

      if (r.data.ok) {
        setStep(2);
      } else {
        alert("Invalid token");
      }
    } catch (err) {
      alert(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------------
  // 🟣 Combined UI
  // -----------------------------------
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Security Center</h1>

      {/* ======================================================
          🔵 PARENTAL LOCK
      ======================================================= */}
      <div style={styles.card}>
        <h2>Parental Lock</h2>

        <button onClick={handleToggle} style={styles.toggleBtn}>
          {isLocked ? "🔐 Locked – Tap to Unlock" : "🟢 Unlocked – Tap to Lock"}
        </button>
      </div>

      {/* PIN SETUP MODAL */}
      {showPinSetup && (
        <div style={styles.modal}>
          <h2>Create 4-digit PIN</h2>
          <input
            type="password"
            maxLength={4}
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            style={styles.input}
            placeholder="Enter PIN"
          />
          <button onClick={handleSavePin} style={styles.actionBtn}>
            Save PIN
          </button>
        </div>
      )}

      {/* PIN UNLOCK MODAL */}
      {showPinCheck && (
        <div style={styles.modal}>
          <h2>Enter PIN to Unlock</h2>
          <input
            type="password"
            maxLength={4}
            value={enteredPin}
            onChange={(e) => setEnteredPin(e.target.value)}
            style={styles.input}
            placeholder="Enter PIN"
          />
          <button onClick={handleUnlock} style={styles.actionBtn}>
            Unlock
          </button>
        </div>
      )}

      {/* ======================================================
          🟢 TWO-FACTOR AUTHENTICATION (2FA)
      ======================================================= */}
      <div style={styles.card}>
        <h2>Two-Factor Authentication</h2>

        {step === 0 && (
          <button
            onClick={handleGenerate2FA}
            disabled={loading}
            style={styles.toggleBtn}
          >
            {loading ? "..." : "Enable 2FA"}
          </button>
        )}

        {step === 1 && (
          <div style={{ textAlign: "center" }}>
            <img
              src={qr}
              alt="Scan QR"
              style={{ width: 180, height: 180, marginBottom: 10 }}
            />
            <p>Scan the QR with Google Authenticator</p>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="123456"
              style={styles.input}
            />
            <button
              onClick={handleVerify2FA}
              disabled={loading || token.length < 6}
              style={styles.actionBtn}
            >
              {loading ? "..." : "Verify"}
            </button>
          </div>
        )}

        {step === 2 && <div style={{ marginTop: 10 }}>2FA enabled ✅</div>}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "24px",
  },
  title: {
    fontSize: "32px",
    fontWeight: 700,
  },
  card: {
    width: "100%",
    maxWidth: "420px",
    background: "white",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
  },
  toggleBtn: {
    padding: "12px 18px",
    fontSize: "16px",
    borderRadius: "8px",
    cursor: "pointer",
    border: "1px solid #ccc",
    background: "white",
  },
  actionBtn: {
    padding: "10px 16px",
    marginTop: "12px",
    background: "#4f46e5",
    color: "white",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },
  input: {
    padding: "10px",
    width: "120px",
    textAlign: "center",
    marginTop: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  modal: {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    zIndex: 999,
  },
};
