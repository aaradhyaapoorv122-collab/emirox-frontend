import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function DebugPanel() {
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    function handleKey(e) {
      if (e.shiftKey && e.key === "D") {
        setOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const addLog = (msg) => {
    setLogs((prev) => [...prev, msg]);
  };

  async function testConnection() {
    const { data, error } = await supabase.from("profiles").select("id").limit(1);

    if (error) addLog("❌ Connection Error: " + error.message);
    else addLog("✅ Supabase Connected Successfully");
  }

  async function testXP() {
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) return addLog("❌ No user logged in");

    const { error } = await supabase.from("xp_history").insert([
      {
        user_id: user.id,
        amount: 10,
        type: "debug_test",
        metadata: {},
      },
    ]);

    if (error) addLog("❌ XP Insert Failed: " + error.message);
    else addLog("✅ XP Inserted Successfully");
  }

  async function testReadXP() {
    const user = (await supabase.auth.getUser()).data?.user;
    if (!user) return addLog("❌ No user logged in");

    const { data, error } = await supabase
      .from("xp_history")
      .select("*")
      .eq("user_id", user.id);

    if (error) addLog("❌ XP Read Failed: " + error.message);
    else addLog("📦 XP Records: " + JSON.stringify(data));
  }

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            width: 350,
            height: 450,
            background: "#111",
            color: "#fff",
            padding: 15,
            borderRadius: 10,
            border: "1px solid #444",
            zIndex: 999999,
            overflowY: "auto",
          }}
        >
          <h2>🔧 Dev Debug Panel</h2>

          <button onClick={testConnection} style={btn}>
            Test Supabase
          </button>
          <button onClick={testXP} style={btn}>
            Insert XP (10)
          </button>
          <button onClick={testReadXP} style={btn}>
            Read XP
          </button>

          <h3 style={{ marginTop: 10 }}>Logs</h3>
          <div style={{ fontSize: 12 }}>
            {logs.map((l, i) => (
              <div key={i}>• {l}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

const btn = {
  width: "100%",
  padding: 8,
  marginTop: 8,
  background: "#333",
  color: "white",
  borderRadius: 6,
  border: "1px solid #555",
  cursor: "pointer",
};
