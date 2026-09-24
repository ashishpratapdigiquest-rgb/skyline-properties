"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { getChatSessionId, getStoredChatName, storeChatName, getChatMessages, sendChatMessage } from "@/lib/chatApi";
import HoneypotField from "@/components/HoneypotField";

export default function LiveChatWidget() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameEntered, setNameEntered] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const scrollRef = useRef(null);
  const sessionId = useRef(null);

  useEffect(() => {
    sessionId.current = getChatSessionId();
    const storedName = getStoredChatName();
    if (storedName) {
      setName(storedName);
      setNameEntered(true);
    }
  }, []);

  const poll = useCallback(async () => {
    if (!sessionId.current) return;
    const msgs = await getChatMessages(sessionId.current);
    setMessages((prev) => {
      if (!open && msgs.length > prev.length) {
        const newFromAdmin = msgs.slice(prev.length).filter((m) => m.sender === "admin").length;
        if (newFromAdmin > 0) setUnread((u) => u + newFromAdmin);
      }
      return msgs;
    });
  }, [open]);

  useEffect(() => {
    if (!nameEntered) return;
    poll();
    const interval = setInterval(poll, 6000);
    return () => clearInterval(interval);
  }, [nameEntered, poll]);

  useEffect(() => {
    if (open) {
      setUnread(0);
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [open, messages]);

  function handleStart(e) {
    e.preventDefault();
    if (!name.trim()) return;
    storeChatName(name.trim());
    setNameEntered(true);
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    const text = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { id: "temp-" + Date.now(), sender: "visitor", name, message: text, created_at: new Date().toISOString() }]);
    await sendChatMessage(sessionId.current, name, text);
    await poll();
    setSending(false);
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Chat band karo" : "Chat kholo"}
        className="fixed bottom-[84px] right-5 z-40 w-14 h-14 rounded-full bg-brand text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {open ? (
          <span className="text-xl">✕</span>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-[150px] right-5 z-40 w-[90vw] max-w-[340px] h-[440px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="bg-navy text-white px-4 py-3.5 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-sm">💬</div>
            <div>
              <div className="font-semibold text-sm">Skyline Properties</div>
              <div className="text-[11px] text-white/70">Aam taur par jaldi reply karte hain</div>
            </div>
          </div>

          {!nameEntered ? (
            <form onSubmit={handleStart} className="flex-1 flex flex-col items-center justify-center px-6 gap-3">
              <p className="text-slate-500 text-sm text-center mb-1">Chat shuru karne ke liye apna naam batayein</p>
              <input
                autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Aapka naam"
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
              />
              <button type="submit" className="btn btn-primary w-full justify-center !py-2.5 text-sm">Chat Shuru Karein</button>
            </form>
          ) : (
            <>
              <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5 bg-slate-50">
                {messages.length === 0 && (
                  <p className="text-slate-400 text-xs text-center mt-4">Namaste {name}! Apna sawal likhein, hum jald reply karenge.</p>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.sender === "visitor" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-[13.5px] ${m.sender === "visitor" ? "bg-brand text-white rounded-br-sm" : "bg-white border border-slate-200 text-slate-700 rounded-bl-sm"}`}>
                      {m.message}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-slate-200">
                <HoneypotField value="" onChange={() => {}} />
                <input
                  value={input} onChange={(e) => setInput(e.target.value)} placeholder="Message likhein..."
                  className="flex-1 px-3.5 py-2.5 border border-slate-200 rounded-full text-sm outline-none focus:border-brand"
                />
                <button type="submit" disabled={sending} className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center flex-shrink-0 disabled:opacity-60">
                  ➤
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
