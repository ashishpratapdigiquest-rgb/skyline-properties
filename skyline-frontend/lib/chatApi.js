const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const SESSION_KEY = "chat_session_id";
const NAME_KEY = "chat_visitor_name";

export function getChatSessionId() {
  if (typeof window === "undefined") return null;
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = "chat-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function getStoredChatName() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(NAME_KEY) || "";
}

export function storeChatName(name) {
  if (typeof window !== "undefined") localStorage.setItem(NAME_KEY, name);
}

export async function getChatMessages(sessionId) {
  try {
    const res = await fetch(`${API_URL}/api/chat/${sessionId}/messages`, { cache: "no-store" });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function sendChatMessage(sessionId, name, message) {
  try {
    const res = await fetch(`${API_URL}/api/chat/${sessionId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, message }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
