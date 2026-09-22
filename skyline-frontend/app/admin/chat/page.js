"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getStoredAdminKey, adminGetChatSessions, adminGetChatMessages, adminReplyToChat } from "@/lib/adminApi";

export default function AdminChatPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (!stored) { router.push("/admin"); return; }
    setKey(stored);
  }, [router]);

  const loadSessions = useCallback(async () => {
    if (!key) return;
    const data = await adminGetChatSessions(key);
    setSessions(data);
    setLoading(false);
  }, [key]);

  useEffect(() => {
    loadSessions();
    const interval = setInterval(loadSessions, 8000);
    return () => clearInterval(interval);
  }, [loadSessions]);

  async function openSession(sessionId) {
    setActiveSession(sessionId);
    const msgs = await adminGetChatMessages(key, sessionId);
    setMessages(msgs);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 50);
    loadSessions(); // refresh unread counts
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!reply.trim() || !activeSession) return;
    setSending(true);
    await adminReplyToChat(key, activeSession, reply.trim());
    setReply("");
    const msgs = await adminGetChatMessages(key, activeSession);
    setMessages(msgs);
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    setSending(false);
  }

  if (!key) return null;

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy">Live Chat</h1>
        <p className="text-slate-500 text-sm mt-1">Website visitors ke messages yahan dikhte hain.</p>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-5 bg-white border border-slate-200 rounded-2xl overflow-hidden" style={{ minHeight: "520px" }}>
        {/* Sessions list */}
        <div className="border-r border-slate-200 overflow-y-auto" style={{ maxHeight: "520px" }}>
          {loading ? (
            <p className="text-slate-400 text-sm p-5">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="text-slate-400 text-sm p-5">Abhi tak koi chat nahi aayi.</p>
          ) : (
            sessions.map((s) => (
              <button
                key={s.session_id}
                onClick={() => openSession(s.session_id)}
                className={`w-full text-left px-4 py-3.5 border-b border-slate-100 hover:bg-brand-tint transition-colors ${activeSession === s.session_id ? "bg-brand-tint" : ""}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-navy text-sm">{s.name}</span>
                  {s.unread > 0 && (
                    <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">{s.unread}</span>
                  )}
                </div>
                <p className="text-slate-500 text-xs truncate">{s.last_message}</p>
                <p className="text-slate-400 text-[10px] mt-1">{new Date(s.last_at).toLocaleString("en-IN")}</p>
              </button>
            ))
          )}
        </div>

        {/* Conversation */}
        <div className="flex flex-col">
          {!activeSession ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Ek conversation select karein</div>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3 bg-slate-50" style={{ maxHeight: "440px" }}>
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === "admin" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm ${m.sender === "admin" ? "bg-brand text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"}`}>
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleReply} className="flex items-center gap-2 p-4 border-t border-slate-200">
                <input
                  value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Reply likhein..."
                  className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
                />
                <button type="submit" disabled={sending} className="btn btn-primary !py-2.5 disabled:opacity-60">
                  {sending ? "..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
