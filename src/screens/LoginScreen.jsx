import React, { useState, useEffect, useRef, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "../context/AuthContext";

/* ---------------- AI LOGIN COACH ---------------- */
function aiCoach(email, password) {
  if (!email.includes("@")) return "Email missing '@' — fix it first.";
  if (password.length < 6) return "Password too short (min 6 chars).";
  if (password.length > 10 && /[A-Z]/.test(password) && /\d/.test(password))
    return "🔥 Strong credentials detected!";
  return "Tip: Use uppercase + numbers for stronger security.";
}

/* ---------------- AUDIT LOGGER ---------------- */
async function audit(event, user) {
  try {
    await fetch("/api/audit-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        userId: user?.id,
        time: new Date().toISOString(),
        ua: navigator.userAgent,
      }),
    });
  } catch (e) {
    console.warn("Audit failed");
  }
}

/* ---------------- MAIN COMPONENT ---------------- */
export default function AuthScreen() {
  const navigate = useNavigate();
  const { setUser, user } = useContext(AuthContext);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [standard, setStandard] = useState("1");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const lockRef = useRef(false);
  const lastClick = useRef(0);

  const STANDARDS = useMemo(
    () => Array.from({ length: 12 }, (_, i) => `${i + 1}`).concat(["Above 12"]),
    []
  );

  /* ---------------- SESSION AUTO REFRESH ---------------- */
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("empirox_user", JSON.stringify(session.user));
      }
    });

    return () => data.subscription.unsubscribe();
  }, []);

  /* ---------------- AUTO REDIRECT ---------------- */
  useEffect(() => {
    if (user) navigate("/tier-selector", { replace: true });
  }, [user]);

  /* ---------------- SUBMIT HANDLER ---------------- */
  async function handleSubmit() {
    const now = Date.now();

    // anti spam lock
    if (lockRef.current || now - lastClick.current < 1200) return;
    lockRef.current = true;
    lastClick.current = now;

    setError("");
    setLoading(true);

    try {
      let authUser;

      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        authUser = data.user;
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, standard },
          },
        });
        if (error) throw error;
        authUser = data.user;
      }

      if (!authUser) throw new Error("Auth failed");

      /* PROFILE UPSERT */
      const { data: profile, error: pErr } = await supabase
        .from("profiles")
        .upsert(
          {
            id: authUser.id,
            email: authUser.email,
            name: name || "User",
            standard,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select()
        .single();

      if (pErr) throw pErr;

      localStorage.setItem("empirox_user", JSON.stringify(authUser));
      localStorage.setItem("empirox_profile", JSON.stringify(profile));

      await audit("AUTH_SUCCESS", authUser);
      setUser(authUser);
      navigate("/tier-selector");
    } catch (e) {
      setError(e.message);
      await audit("AUTH_FAILED", null);
    }

    setLoading(false);
    lockRef.current = false;
  }

  const hint = aiCoach(email, password);

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      <FloatingBackground />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.card}
      >
        <h1 style={styles.title}>Empirox Secure Core</h1>
        <p style={styles.sub}>AI-powered authentication system</p>

        {/* NAME */}
        {mode === "signup" && (
          <input
            style={styles.input}
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        {/* STANDARD */}
        {mode === "signup" && (
          <select
            style={styles.input}
            value={standard}
            onChange={(e) => setStandard(e.target.value)}
          >
            {STANDARDS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        )}

        {/* EMAIL */}
        <input
          style={styles.input}
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* PASSWORD */}
        <div style={{ position: "relative" }}>
          <input
            style={styles.input}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            style={styles.eye}
            onClick={() => setShowPassword((p) => !p)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        {/* AI COACH PANEL */}
        <div style={styles.aiBox}>🧠 AI: {hint}</div>

        {/* ERROR */}
        {error && <div style={styles.error}>{error}</div>}

        {/* LOGIN BUTTON */}
        <button style={styles.button} onClick={handleSubmit} disabled={loading}>
          {loading ? "Processing..." : mode === "login" ? "Login" : "Create Account"}
        </button>

        {/* GOOGLE LOGIN */}
        <button
          style={styles.google}
          onClick={() =>
            supabase.auth.signInWithOAuth({ provider: "google" })
          }
        >
          Continue with Google
        </button>

        {/* SWITCH */}
        <p style={styles.switch}>
          {mode === "login" ? "New here?" : "Already have account?"}{" "}
          <span onClick={() => setMode(mode === "login" ? "signup" : "login")}>
            Switch
          </span>
        </p>
      </motion.div>
    </div>
  );
}

/* ---------------- BACKGROUND ---------------- */
function FloatingBackground() {
  return (
    <>
      <div style={styles.bg1} />
      <div style={styles.bg2} />
    </>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  page: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#05070D",
    overflow: "hidden",
    fontFamily: "system-ui",
  },

  bg1: {
    position: "absolute",
    width: 500,
    height: 500,
    background: "#7C3AED",
    filter: "blur(160px)",
    top: "10%",
    left: "15%",
    opacity: 0.4,
  },

  bg2: {
    position: "absolute",
    width: 500,
    height: 500,
    background: "#06B6D4",
    filter: "blur(180px)",
    bottom: "10%",
    right: "15%",
    opacity: 0.4,
  },

  card: {
    width: 420,
    padding: 28,
    borderRadius: 20,
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(22px)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "white",
  },

  title: { fontSize: 24, fontWeight: "bold" },
  sub: { fontSize: 12, opacity: 0.7, marginBottom: 15 },

  input: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.4)",
    color: "white",
    outline: "none",
  },

  eye: {
    position: "absolute",
    right: 12,
    top: 14,
    fontSize: 12,
    cursor: "pointer",
    opacity: 0.7,
  },

  aiBox: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.8,
    padding: 10,
    borderRadius: 10,
    background: "rgba(0,0,0,0.3)",
  },

  button: {
    width: "100%",
    marginTop: 15,
    padding: 12,
    borderRadius: 10,
    border: "none",
    background: "linear-gradient(90deg,#7C3AED,#06B6D4)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },

  google: {
    width: "100%",
    marginTop: 10,
    padding: 12,
    borderRadius: 10,
    background: "white",
    color: "black",
    fontWeight: "bold",
    border: "none",
  },

  switch: {
    marginTop: 10,
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
  },

  error: {
    marginTop: 10,
    color: "#ff6b6b",
    fontSize: 12,
  },
};