"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { useAuth } from "@/components/Auth/AuthProvider";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.push(searchParams.get("next") || "/favorites");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-elevated">
        <h1 className="font-display text-xl font-semibold text-navy mb-1">Login Karein</h1>
        <p className="text-slate-500 text-sm mb-6">Apne saved properties dekhne ke liye login karein.</p>

        <div className="space-y-4 mb-4">
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
          <input
            type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        <div className="text-right mb-4">
          <Link href="/forgot-password" className="text-brand text-xs font-semibold hover:underline">Password bhool gaye?</Link>
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-5">
          Account nahi hai? <Link href="/signup" className="text-brand font-semibold hover:underline">Sign up karein</Link>
        </p>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
