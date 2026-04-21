export function generateDashboardAI({
  current_streak,
  strictness_score,
  feature_usage,
  last_feature_used,
}) {
  let title = "";
  let action = "";
  let insight = "";

  // 🧠 FIRST DAY USER
  if (current_streak === 1) {
    title = "Welcome to your journey 🚀";
    action = "Start with Smart Chat or Planner today";
    insight = "Come back tomorrow to build your streak 🔥";
  }

  // 🔥 GROWING USER
  else if (current_streak >= 2 && current_streak < 5) {
    title = "You're building consistency ⚡";
    action = "Continue learning and attempt a quiz today";
    insight = `🔥 ${current_streak}-day streak — keep it going`;
  }

  // 🚀 STRONG USER
  else if (current_streak >= 5) {
    title = "High discipline mode 🔥";
    action = "Push harder — take tests and review performance";
    insight = `⚡ ${current_streak}-day streak — strong consistency`;
  }

  // 📊 FEATURE BASED PUSH
  if (!feature_usage?.quiz_ai) {
    insight += " • Try Quiz AI 🎯";
  }

  if (last_feature_used === "smart_chat") {
    insight += " • Now test yourself with Quiz";
  }

  return { title, action, insight };
}