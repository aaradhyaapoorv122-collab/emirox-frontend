import { useEffect, useState, useContext } from "react";
import { supabase } from "../../lib/supabaseClient";
import { AuthContext } from "../../context/AuthContext";  // adjust path if needed

export default function SmartSession({ subject = "Science" }) {
  const { user } = useContext(AuthContext); // get logged-in user from context

  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Create session when user is available
  useEffect(() => {
    if (user) {
      createSession();
    }
    // eslint-disable-next-line
  }, [user]);

  async function createSession() {
    if (!user) return;

    // get profile info
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("country, standard")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return;
    }

    const context = {
      country: profile?.country || "India",
      standard: profile?.standard || "8",
      subject,
      tier: "empicraft",
    };

    const { data, error } = await supabase
      .from("ai_sessions")
      .insert([
        {
          user_id: user.id,
          mode: "smart_chat",
          context,
          messages: [],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating session:", error);
      return;
    }

    setSessionId(data.id);
  }

  async function sendMessage() {
    if (!input.trim() || !sessionId) return;

    setLoading(true);

    const userMessage = {
      role: "user",
      content: input,
    };

    // fetch current messages and context
    const { data: session, error } = await supabase
      .from("ai_sessions")
      .select("messages, context")
      .eq("id", sessionId)
      .single();

    if (error) {
      console.error("Error fetching session:", error);
      setLoading(false);
      return;
    }

    const prompt = `
Answer for a ${session.context.country} Class ${session.context.standard}
${session.context.subject} student in simple language.

Question: ${input}
`;

    // 🔹 MOCK AI RESPONSE (replace later with real AI call)
    const aiReply = {
      role: "assistant",
      content:
        "Photosynthesis is the process by which green plants make their own food using sunlight, water, and carbon dioxide.",
    };

    const updatedMessages = [...(session.messages || []), userMessage, aiReply];

    // save updated messages back to DB
    const { error: updateError } = await supabase
      .from("ai_sessions")
      .update({
        messages: updatedMessages,
        updated_at: new Date(),
      })
      .eq("id", sessionId);

    if (updateError) {
      console.error("Error updating messages:", updateError);
    } else {
      setMessages(updatedMessages);
      setInput("");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: "16px" }}>
      <h3>🧠 Smart Chat</h3>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, i) => (
          <p key={i}>
            <b>{msg.role === "user" ? "You" : "AI"}:</b> {msg.content}
          </p>
        ))}
        {loading && <p>AI is thinking...</p>}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask your question..."
        style={{ width: "80%", padding: "6px" }}
      />
      <button onClick={sendMessage} style={{ padding: "6px 12px" }}>
        Send
      </button>
    </div>
  );
}

