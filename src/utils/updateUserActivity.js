export async function updateUserActivity(supabase, userId, featureName) {
  const today = new Date().toISOString().split("T")[0];

  /* ================= PROFILE ================= */
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    return;
  }

  let current_streak = profile.current_streak || 0;
  let strictness_score = profile.strictness_score || 0;
  let last_active_date = profile.last_active_date;

  let diffDays = 0;

  if (last_active_date) {
    const lastDate = new Date(last_active_date);
    const now = new Date(today);
    diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
  }

  /* ================= STREAK LOGIC ================= */
  if (!last_active_date) {
    current_streak = 1;
    strictness_score = 20;
  } else if (diffDays === 1) {
    current_streak += 1;
    strictness_score = Math.min(100, strictness_score + 20);
  } else if (diffDays > 1) {
    current_streak = 1;
    strictness_score = Math.max(0, strictness_score - 30);
  }

  /* ================= DAILY ACTIVITY ================= */
  let feature_usage = {};

  const { data: existingDay } = await supabase
    .from("daily_activity")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (existingDay?.feature_usage) {
    feature_usage = existingDay.feature_usage;
  }

  feature_usage[featureName] = (feature_usage[featureName] || 0) + 1;

  /* ================= PROFILE UPDATE ================= */
  await supabase.from("profiles").update({
    last_active_date: today,
    current_streak,
    max_streak: Math.max(profile.max_streak || 0, current_streak),
    strictness_score,
    last_feature_used: featureName,
    last_used_time: new Date().toISOString(),
  }).eq("id", userId);

  /* ================= ACTIVITY LOG (FIXED ❌→✅) ================= */
  await supabase.from("activity_logs").insert({
    user_id: userId,
    action_type: "feature_used",
    reference_id: featureName,
    metadata: {
      type: "usage",
      date: today
    },
    allowed: true,
  });

  /* ================= DAILY ACTIVITY UPSERT ================= */
  await supabase.from("daily_activity").upsert({
    user_id: userId,
    date: today,
    used_app: true,
    feature_usage,
  }, {
    onConflict: "user_id,date"
  });

  return {
    current_streak,
    strictness_score,
    feature_usage,
  };
}

/* ================= TOP FEATURE ================= */
export function getTopFeature(feature_usage) {
  if (!feature_usage) return null;

  let max = 0;
  let topFeature = null;

  for (const key in feature_usage) {
    if (feature_usage[key] > max) {
      max = feature_usage[key];
      topFeature = key;
    }
  }

  return topFeature;
}