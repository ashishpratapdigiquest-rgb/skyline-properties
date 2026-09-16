"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPassword } from "@/lib/authApi";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Dono password same hone chahiye");
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-elevated text-center">
          <p className="text-red-500 text-sm mb-4">Reset link invalid hai — koi token nahi mila.</p>
          <Link href="/forgot-password" className="btn btn-primary">Naya Reset Link Maangein</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-elevated">
        <h1 className="font-display text-xl font-semibold text-navy mb-1">Naya Password Set Karein</h1>
        <p className="text-slate-500 text-sm mb-6">Apna naya password daalein.</p>

        {done ? (
          <p className="text-brand text-sm font-semibold">Password reset ho gaya! Login page par le jaa rahe hain...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 mb-4">
              <input
                type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Naya password (kam se kam 8 characters)"
                className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
              />
              <input
                type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)}
                placeholder="Naya password dobara likhein"
                className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
              {loading ? "Saving..." : "Password Reset Karein"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
