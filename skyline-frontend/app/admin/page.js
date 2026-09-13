"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAdminKey, storeAdminKey } from "@/lib/adminApi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const ok = await verifyAdminKey(password);
    setLoading(false);
    if (ok) {
      storeAdminKey(password);
      router.push("/admin/properties");
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-elevated">
        <h1 className="font-display text-xl font-semibold text-navy mb-1">Admin Login</h1>
        <p className="text-slate-500 text-sm mb-6">Enter the admin password to manage properties.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
          required
          autoFocus
          className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand mb-3"
        />
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
          {loading ? "Checking..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
