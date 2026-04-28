import { supabase } from "@/lib/supabaseClient";

/* ===================================================
   EMPiROX BrainCore v3 (FIXED + REAL SCHEMA)
=================================================== */

export const BrainCore = {
  /* ===================== LOG MEMORY ===================== */
  async log(userId, feature, payload = {}) {
    try {
      // 🔥 1. Activity log (REAL TABLE)
      await supabase.from("activity_logs").insert({
        user_id: userId,
        action_type: feature,
        reference_id: "braincore_memory",
        metadata: payload,
        allowed: true,
      });

      // 🔥 2. Update AI brain memory
      await this.updateBrain(userId, feature, payload);
    } catch (err) {
      console.error("BrainCore log error:", err.message);
    }
  },

  /* ===================== READ MEMORY ===================== */
  async getMemory(userId) {
    const { data, error } = await supabase
      .from("student_brain")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      console.error("Brain fetch error:", error.message);
      return null;
    }

    return data;
  },

  /* ===================== BUILD AI CONTEXT ===================== */
  async buildAIContext(userId) {
    const brain = await this.getMemory(userId);

    if (!brain) return "";

    return `
Weak Subjects: ${JSON.stringify(brain.weak_subjects || [])}
Strong Subjects: ${JSON.stringify(brain.strong_subjects || [])}
Mistakes: ${JSON.stringify(brain.mistakes || [])}
Learning Pattern: ${JSON.stringify(brain.learning_pattern || {})}
Quiz History: ${JSON.stringify(brain.quiz_history || [])}
Test History: ${JSON.stringify(brain.test_history || [])}
`;
  },

  /* ===================== UPDATE BRAIN ===================== */
  async updateBrain(userId, feature, payload) {
    try {
      const { data: existing } = await supabase
        .from("student_brain")
        .select("*")
        .eq("user_id", userId)
        .single();

      let updated = {
        user_id: userId,
        updated_at: new Date().toISOString(),
      };

      // 🔥 Initialize if new user
      const brain = existing || {
        weak_subjects: [],
        strong_subjects: [],
        quiz_history: [],
        test_history: [],
        mistakes: [],
        doubts: [],
        learning_pattern: {},
      };

      /* ===================== LOGIC ENGINE ===================== */

      if (payload.subject && payload.score !== undefined) {
        if (payload.score < 40) {
          brain.weak_subjects.push(payload.subject);
        } else if (payload.score > 75) {
          brain.strong_subjects.push(payload.subject);
        }
      }

      if (payload.mistake) {
        brain.mistakes.push(payload.mistake);
      }

      if (payload.quiz) {
        brain.quiz_history.push(payload.quiz);
      }

      if (payload.test) {
        brain.test_history.push(payload.test);
      }

      // keep only latest 20 entries (important for performance)
      brain.weak_subjects = brain.weak_subjects.slice(-20);
      brain.strong_subjects = brain.strong_subjects.slice(-20);
      brain.mistakes = brain.mistakes.slice(-30);

      updated = {
        ...brain,
        ...updated,
      };

      await supabase.from("student_brain").upsert(updated);
    } catch (err) {
      console.error("Brain update error:", err.message);
    }
  },

  /* ===================== UPDATE PROFILE ===================== */
  async updateProfile(userId, payload = {}) {
    try {
      let update = {};

      if (payload.subject) update.last_feature_used = payload.subject;
      if (payload.score !== undefined) update.strictness_score = payload.score;
      if (payload.level) update.tier = payload.level;

      await supabase.from("profiles").upsert({
        id: userId,
        ...update,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Profile update error:", err.message);
    }
  },

  /* ===================== AI INSIGHT ENGINE ===================== */
  async generateInsight(userId) {
    const brain = await this.getMemory(userId);

    if (!brain) {
      return {
        weakSubjects: [],
        strongSubjects: [],
        pattern: "no_data",
      };
    }

    const insights = {
      weakSubjects: [...new Set(brain.weak_subjects || [])],
      strongSubjects: [...new Set(brain.strong_subjects || [])],
      pattern:
        (brain.weak_subjects || []).length >
        (brain.strong_subjects || []).length
          ? "needs_improvement"
          : "strong_learner",
    };

    return insights;
  },
};