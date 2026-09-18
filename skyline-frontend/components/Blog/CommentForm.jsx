"use client";
import { useState } from "react";
import { submitComment } from "@/lib/blogApi";
import HoneypotField from "@/components/HoneypotField";

export default function CommentForm({ slug }) {
  const [form, setForm] = useState({ name: "", email: "", comment: "", website: "" });
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await submitComment(slug, form);
    setNote(res.message);
    setLoading(false);
    if (res.success !== false) {
      setForm({ name: "", email: "", comment: "", website: "" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6">
      <h3 className="font-display text-lg font-semibold text-navy mb-4">Comment Karein</h3>
      <HoneypotField value={form.website} onChange={(v) => update("website", v)} />
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} type="text" placeholder="Aapka Naam"
          className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
        <input required value={form.email} onChange={(e) => update("email", e.target.value)} type="email" placeholder="Email Address"
          className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
      </div>
      <textarea required value={form.comment} onChange={(e) => update("comment", e.target.value)} rows={4} placeholder="Apna comment yahan likhein..."
        className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand mb-4" />
      <button type="submit" disabled={loading} className="btn btn-primary disabled:opacity-60">
        {loading ? "Submitting..." : "Comment Post Karein"}
      </button>
      {note && <p className="mt-3.5 text-brand text-[13.5px] font-semibold">{note}</p>}
      <p className="text-[11.5px] text-slate-400 mt-2">Aapka comment admin approve karne ke baad hi website par dikhega.</p>
    </form>
  );
}
