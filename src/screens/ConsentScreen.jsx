import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { markConsentGiven } from "../utils/consentUtils";

export default function ConsentScreen() {
  const navigate = useNavigate();

  // States for checkboxes
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptChildPolicy, setAcceptChildPolicy] = useState(false);

  // Age state — will come from user table (Phase 1 basic local)
  const [userAge, setUserAge] = useState(14); // default 14 for now

  // Button enabled only if required boxes are checked
  const isValid =
    acceptPrivacy &&
    acceptTerms &&
    (userAge >= 13 ? true : acceptChildPolicy);
    
    const handleContinue = () => {
    markConsentGiven();
    navigate("/settings"); 
  };
  return (
    <div style={styles.container}>
      <div style={styles.card}>

        <h2 style={styles.title}>User Consent Required</h2>

        <div style={styles.scrollBox}>
          <p>
            To continue using Empirox, please review and accept our policies.
            These policies ensure your privacy, safety, and data protection.
          </p>
        </div>

        <div style={styles.options}>
          <label style={styles.row}>
            <input
              type="checkbox"
              checked={acceptPrivacy}
              onChange={() => setAcceptPrivacy(!acceptPrivacy)}
            />
            <span>
              I accept the{" "}
              <a href="/privacy-policy" style={styles.link}>
                Privacy Policy
              </a>
            </span>
          </label>

          <label style={styles.row}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={() => setAcceptTerms(!acceptTerms)}
            />
            <span>
              I accept the{" "}
              <a href="/terms" style={styles.link}>
                Terms of Service
              </a>
            </span>
          </label>

          {userAge < 13 && (
            <label style={styles.row}>
              <input
                type="checkbox"
                checked={acceptChildPolicy}
                onChange={() => setAcceptChildPolicy(!acceptChildPolicy)}
              />
              <span>
                I accept the{" "}
                <a href="/child-safety" style={styles.link}>
                  Child / COPPA Policy
                </a>
              </span>
            </label>
          )}
        </div>

        <button
          style={{
            ...styles.button,
            backgroundColor: isValid ? "#00c853" : "#555",
            cursor: isValid ? "pointer" : "not-allowed",
          }}
          disabled={!isValid}
          onClick={handleContinue}
        >
          Accept & Continue
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "#000",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    width: "min(420px, 95%)",
    background: "#111",
    padding: 20,
    borderRadius: 16,
    border: "1px solid #333",
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
  },
  scrollBox: {
    height: 120,
    overflowY: "auto",
    padding: 10,
    background: "#222",
    borderRadius: 8,
    marginBottom: 20,
  },
  options: {
    marginBottom: 20,
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  link: {
    color: "#4fc3f7",
    textDecoration: "underline",
  },
  button: {
    width: "100%",
    padding: 12,
    fontSize: 17,
    border: "none",
    borderRadius: 10,
    color: "#fff",
  },
};
