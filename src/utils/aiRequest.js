import { supabase } from "@/lib/supabaseClient";

export async function aiRequest(message, apiCall) {
  const { data, error } = await supabase.auth.getUser();

  const user = data?.user;

  if (error || !user) throw new Error("Not logged in");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("tier, ai_count, last_ai_reset")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile not found");
  }

  const today = new Date().toISOString().split("T")[0];

  // reset daily usage
  if (profile.last_ai_reset !== today) {
    await supabase
      .from("profiles")
      .update({
        ai_count: 0,
        last_ai_reset: today,
      })
      .eq("id", user.id);

    profile.ai_count = 0;
  }

  // limit check
  if (profile.tier === "free" && profile.ai_count >= 15) {
    return { blocked: true, reason: "limit" };
  }

  // AI call (protected)
  let response;

  try {
    response = await apiCall(message);
  } catch (err) {
    throw new Error("AI request failed");
  }

  if (!response) {
    throw new Error("No AI response");
  }

  // increment AFTER success
  await supabase
    .from("profiles")
    .update({
      ai_count: profile.ai_count + 1,
    })
    .eq("id", user.id);

  return {
    blocked: false,
    data: response,
  };
}