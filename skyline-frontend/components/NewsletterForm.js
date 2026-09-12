"use client";
import { useState } from "react";
import { subscribeNewsletter } from "@/lib/api";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const res = await subscribeNewsletter(email);
    setStatus(res.success ? "Subscribed ✓" : "Try again later");
    setEmail("");
    setTimeout(() => setStatus(null), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex bg-white rounded-lg overflow-hidden max-w-[420px] flex-1 min-w-[280px]">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={status || "Enter your email"}
        className="flex-1 border-none px-4 py-3.5 text-sm outline-none text-slate-700"
      />
      <button type="submit" className="bg-brand hover:bg-brand-dark text-white px-6 font-semibold text-sm">
        Subscribe
      </button>
    </form>
  );
}
