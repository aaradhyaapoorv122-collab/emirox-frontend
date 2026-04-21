// AIReminder.jsx
// Unified Outside-App AI Reminder + Time Tracking Engine

import { supabase } from "@/lib/supabaseClient";

class EmpiReminderEngine {
  constructor(userId) {
    this.userId = userId;
  }

  // 🔔 SYSTEM NOTIFICATION (OUTSIDE APP)
  notify(title, body) {
    if (!("Notification" in window)) return;

    if (Notification.permission === "granted") {
      new Notification(title, { body });
    }
  }

  // =====================
  // ⏱️ TIME TRACKING HOOKS
  // =====================
  async startSession(sessionId) {
    await supabase.from("activity_logs").insert({
      user_id: this.userId,
      session_id: sessionId,
      action: "start",
      timestamp: new Date().toISOString(),
    });

    await supabase
      .from("ai_sessions")
      .update({ status: "started" })
      .eq("id", sessionId);
  }

  async endSession(sessionId) {
    await supabase.from("activity_logs").insert({
      user_id: this.userId,
      session_id: sessionId,
      action: "end",
      timestamp: new Date().toISOString(),
    });

    await supabase
      .from("ai_sessions")
      .update({ status: "completed" })
      .eq("id", sessionId);
  }

  // =====================
  // ⚠️ SKIP DETECTION
  // =====================
  async detectSkippedSessions() {
    const now = new Date().toISOString();

    const { data } = await supabase
      .from("ai_sessions")
      .select("*")
      .eq("user_id", this.userId)
      .eq("status", "pending")
      .lt("start_time", now);

    if (!data) return;

    for (const session of data) {
      await supabase
        .from("ai_sessions")
        .update({ status: "skipped" })
        .eq("id", session.id);

      this.notify(
        "⚠️ Session Skipped",
        `You skipped "${session.title}". Resume or reschedule now.`
      );
    }
  }

  // =====================
  // 🧠 AI REMINDER LOGIC
  // =====================
  async runAIReminders() {
    const now = new Date();
    const upcomingTime = new Date(now.getTime() + 5 * 60000).toISOString();

    const { data } = await supabase
      .from("ai_sessions")
      .select("*")
      .eq("user_id", this.userId)
      .eq("status", "pending")
      .lte("start_time", upcomingTime);

    if (!data) return;

    for (const session of data) {
      let message = "⏰ Upcoming task reminder.";

      if (session.type === "study") {
        message = "📘 Study session starting in 5 minutes.";
      } else if (session.type === "water") {
        message = "💧 Time to drink water.";
      } else if (session.type === "diet") {
        message = "🍱 It's meal time. Follow your diet plan.";
      } else if (session.type === "smartmentor") {
        message =
          "🎙️ SmartMentor batch started. Join immediately for guidance.";
      }

      this.notify("Empirox Reminder", message);
    }
  }

  // =====================
  // 🔁 MAIN LOOP
  // =====================
  startEngine() {
    setInterval(() => {
      this.detectSkippedSessions();
      this.runAIReminders();
    }, 60000);
  }
}

export default EmpiReminderEngine;
