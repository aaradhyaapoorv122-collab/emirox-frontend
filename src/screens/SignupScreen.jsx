import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { supabase } from "../lib/supabaseClient";
import { checkPasswordStrength } from "../utils/passwordStrength";
import { hasGivenConsent } from "../utils/consentUtils";

const translations = {
  en: {
    createAccount: "Create your Empirox account",
    name: "Name",
    email: "Email",
    country: "Country",
    standard: "Standard",
    password: "Password",
    confirmPassword: "Confirm Password",
    signUp: "Sign Up",
    alreadyHaveAccount: "Already have an account?",
    loginHere: "Login here",
    errors: {
      nameRequired: "Name is required",
      emailRequired: "Email is required",
      emailInvalid: "Invalid email",
      countryRequired: "Select country",
      standardRequired: "Select standard",
      passwordRequired: "Password is required",
      passwordMin: "Password must be at least 6 characters",
      confirmPasswordRequired: "Confirm password is required",
      passwordMismatch: "Passwords do not match",
    },
    placeholders: {
      enterName: "Enter your name",
      enterEmail: "Enter your email",
      enterPassword: "Enter your password",
      confirmPassword: "Confirm your password",
    },
    loading: "Loading...",
  },
  hi: {
    createAccount: "अपना Empirox खाता बनाएं",
    name: "नाम",
    email: "ईमेल",
    country: "देश",
    standard: "कक्षा",
    password: "पासवर्ड",
    confirmPassword: "पासवर्ड पुष्टि करें",
    signUp: "साइन अप करें",
    alreadyHaveAccount: "क्या आपका पहले से खाता है?",
    loginHere: "यहाँ लॉगिन करें",
    errors: {
      nameRequired: "नाम आवश्यक है",
      emailRequired: "ईमेल आवश्यक है",
      emailInvalid: "अमान्य ईमेल",
      countryRequired: "देश चुनें",
      standardRequired: "कक्षा चुनें",
      passwordRequired: "पासवर्ड आवश्यक है",
      passwordMin: "पासवर्ड कम से कम 6 अक्षर का होना चाहिए",
      confirmPasswordRequired: "पासवर्ड पुष्टि आवश्यक है",
      passwordMismatch: "पासवर्ड मेल नहीं खाते",
    },
    placeholders: {
      enterName: "अपना नाम दर्ज करें",
      enterEmail: "अपना ईमेल दर्ज करें",
      enterPassword: "अपना पासवर्ड दर्ज करें",
      confirmPassword: "पासवर्ड पुष्टि करें",
    },
    loading: "लोड हो रहा है...",
  },
};

const localizedCountries = {
  en: [
    { code: "IN", name: "India" },
    { code: "JP", name: "Japan" },
    { code: "CN", name: "China" },
    { code: "AU", name: "Australia" },
    { code: "SG", name: "Singapore" },
    { code: "AE", name: "UAE" },
    { code: "KR", name: "South Korea" },
  ],
  hi: [
    { code: "IN", name: "भारत" },
    { code: "JP", name: "जापान" },
    { code: "CN", name: "चीन" },
    { code: "AU", name: "ऑस्ट्रेलिया" },
    { code: "SG", name: "सिंगापुर" },
    { code: "AE", name: "यूएई" },
    { code: "KR", name: "दक्षिण कोरिया" },
  ],
};

const localizedStandards = {
  en: Array.from({ length: 12 }, (_, i) => `${i + 1}`).concat(["Above 12"]),
  hi: Array.from({ length: 12 }, (_, i) => `${i + 1}`).concat(["12 के ऊपर"]),
};

function useTranslation(currentLang) {
  const t = (key) => {
    const parts = key.split(".");
    let value = translations[currentLang] || translations.en;
    for (let p of parts) value = value?.[p] ?? key;
    return value;
  };
  return { t };
}

export default function SignupScreen() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [lang, setLang] = useState("en");
  const { t } = useTranslation(lang);

  const primary = theme?.primary ?? "#18e09b";
  const bg = theme?.background ?? "#0d261b";
  const text = theme?.text ?? "#fff";
  const card = theme?.card ?? "rgba(255,255,255,0.03)";

  const COUNTRIES = localizedCountries[lang];
  const STANDARDS = localizedStandards[lang];

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(COUNTRIES[0].code);
  const [standard, setStandard] = useState(STANDARDS[0]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Password strength
  const strength = checkPasswordStrength(password);

  // Show password toggle
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    validate();
  }, [name, email, country, standard, password, confirmPassword]);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = t("errors.nameRequired");
    if (!email.trim()) e.email = t("errors.emailRequired");
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = t("errors.emailInvalid");

    if (!country) e.country = t("errors.countryRequired");
    if (!standard) e.standard = t("errors.standardRequired");

    if (!password) e.password = t("errors.passwordRequired");
    else if (password.length < 6) e.password = t("errors.passwordMin");

    if (!confirmPassword) e.confirmPassword = t("errors.confirmPasswordRequired");
    else if (confirmPassword !== password) e.confirmPassword = t("errors.passwordMismatch");

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
  e.preventDefault();

  if (!validate()) return;

  if (strength.score < 2) {
    setErrors((prev) => ({ ...prev, password: "Password is too weak" }));
    return;
  }

  try {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // ✅ ALWAYS go to login after signup
    navigate("/login");

  } catch (err) {
    alert(err.message);
  } finally {
    setLoading(false);
  }
}

  // === Your provided exact styles ===
  const container = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: `linear-gradient(180deg, ${bg}, #000000cc)`, // Darker overlay
    padding: 20,
    color: text,
  };

  const cardStyle = {
    width: "min(460px, 95%)",
    background: "rgba(0, 255, 255, 0.15)", // Less bright, more transparent cyan
    borderRadius: 20,
    padding: 30,
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(0, 255, 255, 0.3)", // Slightly stronger border
    boxShadow: `0 0 20px ${primary}88`, // Slightly stronger glow with opacity
  };

  const input = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(0, 200, 200, 0.5)", // Slightly darker border
    background: "rgba(224, 255, 255, 0.6)", // Light pastel cyan, less bright
    color: "#004d4d", // Dark teal text for better contrast
    outline: "none",
    fontSize: 15,
    marginBottom: 12,
    boxSizing: "border-box",
  };

  const label = {
    fontSize: 13,
    marginBottom: 6,
    opacity: 0.9,
    color: "#00aaff", // Slightly deeper cyan for labels
    display: "block",
  };

  const errorStyle = {
    color: "#ff4c4c", // Slightly stronger red for errors
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  };
  // === End of your styles ===

  const select = {
    ...input,
    appearance: "none",
    cursor: "pointer",
  };

  const button = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: 14,
    background: primary,
    color: "#fff",
    border: "none",
    marginTop: 20,
    fontSize: 16,
    cursor: "pointer",
    fontWeight: 700,
  };

  return (
    <div style={container}>
      <form style={cardStyle} onSubmit={handleSubmit} noValidate>
        <h2 style={{ marginBottom: 20, textAlign: "center" }}>{t("createAccount")}</h2>

        {/* Name */}
        <label htmlFor="name" style={label}>
          {t("name")}
        </label>
        <input
          id="name"
          type="text"
          value={name}
          placeholder={t("placeholders.enterName")}
          onChange={(e) => setName(e.target.value)}
          style={input}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && (
          <div id="name-error" style={errorStyle} role="alert">
            {errors.name}
          </div>
        )}

        {/* Email */}
        <label htmlFor="email" style={label}>
          {t("email")}
        </label>
        <input
          id="email"
          type="email"
          value={email}
          placeholder={t("placeholders.enterEmail")}
          onChange={(e) => setEmail(e.target.value)}
          style={input}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <div id="email-error" style={errorStyle} role="alert">
            {errors.email}
          </div>
        )}

        {/* Country */}
        <label htmlFor="country" style={label}>
          {t("country")}
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={select}
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? "country-error" : undefined}
        >
          {COUNTRIES.map(({ code, name }) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        {errors.country && (
          <div id="country-error" style={errorStyle} role="alert">
            {errors.country}
          </div>
        )}

        {/* Standard */}
        <label htmlFor="standard" style={label}>
          {t("standard")}
        </label>
        <select
          id="standard"
          value={standard}
          onChange={(e) => setStandard(e.target.value)}
          style={select}
          aria-invalid={!!errors.standard}
          aria-describedby={errors.standard ? "standard-error" : undefined}
        >
          {STANDARDS.map((std) => (
            <option key={std} value={std}>
              {std}
            </option>
          ))}
        </select>
        {errors.standard && (
          <div id="standard-error" style={errorStyle} role="alert">
            {errors.standard}
          </div>
        )}

        {/* Password */}
        <label htmlFor="password" style={label}>
          {t("password")}
        </label>
        <div style={{ position: "relative" }}>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder={t("placeholders.enterPassword")}
            onChange={(e) => setPassword(e.target.value)}
            style={input}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          <span
            role="button"
            tabIndex={0}
            onClick={() => setShowPassword(!showPassword)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setShowPassword(!showPassword);
            }}
            style={{
              position: "absolute",
              right: 12,
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              userSelect: "none",
              fontSize: 18,
            }}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "👁️" : "🙈"}
          </span>
        </div>
        {errors.password && (
          <div id="password-error" style={errorStyle} role="alert">
            {errors.password}
          </div>
        )}

        {/* Strength Bar */}
        {password.length > 0 && (
          <div
            style={{
              marginTop: 8,
              padding: "6px 10px",
              borderRadius: 8,
              color: "#fff",
              fontSize: 13,
              textAlign: "center",
              fontWeight: 600,
              backgroundColor: strength.color,
            }}
          >
            {strength.label}
          </div>
        )}

        {/* Confirm Password */}
        <label htmlFor="confirmPassword" style={label}>
          {t("confirmPassword")}
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          placeholder={t("placeholders.confirmPassword")}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={input}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
        />
        {errors.confirmPassword && (
          <div id="confirmPassword-error" style={errorStyle} role="alert">
            {errors.confirmPassword}
          </div>
        )}

        <button type="submit" style={button} disabled={loading}>
          {loading ? t("loading") : t("signUp")}
        </button>

        <p style={{ marginTop: 14, textAlign: "center" }}>
          {t("alreadyHaveAccount")}{" "}
          <span
            onClick={() => navigate("/login")}
            style={{ color: primary, cursor: "pointer" }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") navigate("/login");
            }}
          >
            {t("loginHere")}
          </span>
        </p>
      </form>
    </div>
  );
}
