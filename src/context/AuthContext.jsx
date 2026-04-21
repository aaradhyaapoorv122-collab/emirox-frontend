import React, {
  createContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

// 🔔 IMPORT REMINDER ENGINE
import EmpiReminderEngine from "@/tiers/empilab/features/AIReminder";

export const AuthContext = createContext({
  user: null,
  setUser: () => {},
  logout: () => {},
  loadingUser: true,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const activityTimer = useRef(null);
  const reminderEngineRef = useRef(null); // 🚀 VERY IMPORTANT

  const SESSION_TIMEOUT = 5 * 60 * 1000; // 5 minutes
  const navigate = useNavigate();

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    await supabase.auth.signOut();

    // 🧹 Cleanup reminder engine
    reminderEngineRef.current = null;

    setUser(null);
    navigate("/login");
  };

  /* ================= ACTIVITY TIMER ================= */
  const resetTimer = () => {
    if (activityTimer.current) clearTimeout(activityTimer.current);

    activityTimer.current = setTimeout(() => {
      handleLogout();
    }, SESSION_TIMEOUT);
  };

  /* ================= AUTH + REMINDER ENGINE ================= */
  useEffect(() => {
    /* -------- EXISTING SESSION -------- */
    supabase.auth.getSession().then(({ data }) => {
      const existingUser = data.session?.user ?? null;
      setUser(existingUser);
      setLoadingUser(false);

      if (existingUser && !reminderEngineRef.current) {
        if ("Notification" in window) {
          Notification.requestPermission();
        }

        reminderEngineRef.current = new EmpiReminderEngine(existingUser.id);
        reminderEngineRef.current.startEngine();

        console.log("✅ EmpiReminderEngine started (existing session)");
        resetTimer();
      }
    });

    /* -------- AUTH STATE CHANGE -------- */
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          resetTimer();

          if ("Notification" in window) {
            Notification.requestPermission();
          }

          if (!reminderEngineRef.current) {
            reminderEngineRef.current = new EmpiReminderEngine(currentUser.id);
            reminderEngineRef.current.startEngine();

            console.log("✅ EmpiReminderEngine started");
          }
        } else {
          // 🧹 Logout cleanup
          reminderEngineRef.current = null;
        }
      }
    );

    /* -------- USER ACTIVITY -------- */
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keydown", resetTimer);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);

      if (activityTimer.current) clearTimeout(activityTimer.current);
      reminderEngineRef.current = null;
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout: handleLogout,
        loadingUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
