import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TwoFASetupScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleSetup() {
    setLoading(true);

    // Future supabase insert will go here
    setTimeout(() => {
      navigate("/2fa-verify");
      setLoading(false);
    }, 800);
  }

  return (
    <div style={styles.container}>
      <h1>Two-Factor Authentication</h1>
      <p style={styles.text}>
        Add an extra layer of security to your Empirox account.
      </p>

      <button
        onClick={handleSetup}
        style={styles.button}
        disabled={loading}
      >
        {loading ? "Preparing..." : "Continue"}
      </button>

      <p style={styles.back} onClick={() => navigate(-1)}>
        Cancel
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
  text: {
    marginTop: 10,
    marginBottom: 20,
    color: "#555",
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
  back: {
    color: "#007bff",
    marginTop: 15,
    cursor: "pointer",
  }
};

export default TwoFASetupScreen;
