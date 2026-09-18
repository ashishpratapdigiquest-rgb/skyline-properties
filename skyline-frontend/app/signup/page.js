"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/Auth/AuthProvider";
import HoneypotField from "@/components/HoneypotField";

export default function SignupPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await register(name, email, password, website);
      router.push("/favorites");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-8 shadow-elevated">
        <HoneypotField value={website} onChange={setWebsite} />
        <h1 className="font-display text-xl font-semibold text-navy mb-1">Account Banayein</h1>
        <p className="text-slate-500 text-sm mb-6">Properties save karne ke liye free account banayein.</p>

        <div className="space-y-4 mb-4">
          <input
            type="text" required value={name} onChange={(e) => setName(e.target.value)}
            placeholder="Aapka naam"
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
          <input
            type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (kam se kam 8 characters)"
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-center text-sm text-slate-500 mt-5">
          Already account hai? <Link href="/login" className="text-brand font-semibold hover:underline">Login karein</Link>
        </p>
      </form>
    </div>
  );
}
