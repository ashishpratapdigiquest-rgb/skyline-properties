"use client";
import { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/authApi";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await forgotPassword(email);
      setNote(res.message);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-elevated">
        <h1 className="font-display text-xl font-semibold text-navy mb-1">Password Bhool Gaye?</h1>
        <p className="text-slate-500 text-sm mb-6">Apna email daalein, hum aapko reset link bhej denge.</p>

        {sent ? (
          <p className="text-brand text-sm font-semibold">{note}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand mb-4"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
              {loading ? "Sending..." : "Reset Link Bhejein"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-slate-500 mt-5">
          <Link href="/login" className="text-brand font-semibold hover:underline">← Login page par wapas jaayein</Link>
        </p>
      </div>
    </div>
  );
}
