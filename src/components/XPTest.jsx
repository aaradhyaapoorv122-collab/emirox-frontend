import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { giveXP } from "../utils/xp";

export default function XPTest() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newXp, setNewXp] = useState(null);

  useEffect(() => {
    // Get currently authenticated user
    (async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("getUser error:", error);
        return;
      }
      setUser(data.user);
    })();
  }, []);

  const handleGive = async () => {
    if (!user) return alert("Log in with a test account first");
    setLoading(true);
    const res = await giveXP(user.id, 10, "Test XP from UI");
    setLoading(false);
    if (res.success) {
      setNewXp(res.new_xp);
      alert("XP added ✔ New XP: " + res.new_xp);
    } else {
      console.error(res.error);
      alert("XP failed. Check console.");
    }
  };

  return (
    <div style={{ padding: 12 }}>
      <div>Logged in user: {user?.email ?? "none"}</div>
      <button onClick={handleGive} disabled={loading} style={{ marginTop: 8 }}>
        {loading ? "Working..." : "Give 10 XP"}
      </button>
      {newXp !== null && <div style={{ marginTop: 8 }}>New XP: {newXp}</div>}
    </div>
  );
}
