import React, { useEffect, useState, useContext } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "../context/AuthContext";

export default function Xp() {
  const { user } = useContext(AuthContext); // get logged-in user from context
  const [xpHistory, setXpHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch XP history when component mounts or user changes
  useEffect(() => {
    if (!user) return;

    async function fetchXpHistory() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from("xp_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setXpHistory(data);
      }
      setLoading(false);
    }

    fetchXpHistory();
  }, [user]);

  // Insert new XP record
  async function addXp(amount, type, details) {
    if (!user) return;

    setLoading(true);
    setError(null);
    const { error } = await supabase.from("xp_history").insert([
      {
        user_id: user.id,
        amount,
        type,
        metadata: { details },
      },
    ]);

    if (error) {
      setError(error.message);
    } else {
      // Refresh XP history after insert
      const { data, error: fetchError } = await supabase
        .from("xp_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (fetchError) setError(fetchError.message);
      else setXpHistory(data);
    }
    setLoading(false);
  }

  if (!user) return <p>Please login to view XP data.</p>;

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Your XP History</h2>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && xpHistory.length === 0 && <p>No XP records found.</p>}

      <ul>
        {xpHistory.map((record) => (
          <li key={record.id}>
            <strong>{record.type}</strong> — +{record.amount} XP <br />
            <small>{new Date(record.created_at).toLocaleString()}</small> <br />
            <em>{record.metadata?.details}</em>
          </li>
        ))}
      </ul>

      <button
        onClick={() => addXp(10, "test-xp", "Test XP insertion")}
        disabled={loading}
        style={{ marginTop: 20, padding: "10px 20px", cursor: "pointer" }}
      >
        Add 10 XP (Test)
      </button>
    </div>
  );
}
