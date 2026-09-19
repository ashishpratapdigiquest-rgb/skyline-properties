"use client";
import { useState } from "react";
import { submitTestimonial } from "@/lib/api";
import HoneypotField from "@/components/HoneypotField";

export default function TestimonialSubmitForm() {
  const [form, setForm] = useState({ name: "", rating: 5, quote: "", website: "" });
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await submitTestimonial(form);
    setNote(res.message);
    setLoading(false);
    if (res.success !== false) {
      setForm({ name: "", rating: 5, quote: "", website: "" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 max-w-xl mx-auto">
      <HoneypotField value={form.website} onChange={(v) => update("website", v)} />
      <h3 className="font-display text-lg font-semibold text-navy mb-1">Apna Experience Share Karein</h3>
      <p className="text-slate-500 text-[13.5px] mb-5">Aapka review admin approve karne ke baad website par dikhega.</p>

      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-navy mb-1.5">Aapka Naam</label>
        <input required value={form.name} onChange={(e) => update("name", e.target.value)} type="text" placeholder="Jaise: Ramesh Kumar"
          className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
      </div>

      <div className="mb-4">
        <label className="block text-[13px] font-semibold text-navy mb-1.5">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n} type="button" onClick={() => update("rating", n)}
              className={`text-2xl ${n <= form.rating ? "text-amber-400" : "text-slate-300"}`}
              aria-label={`${n} star`}
            >
              ★
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <label className="block text-[13px] font-semibold text-navy mb-1.5">Aapka Review</label>
        <textarea required rows={4} value={form.quote} onChange={(e) => update("quote", e.target.value)} placeholder="Skyline Properties ke saath aapka experience kaisa raha?"
          className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
        {loading ? "Submitting..." : "Review Submit Karein"}
      </button>
      {note && <p className="mt-3.5 text-brand text-[13.5px] font-semibold">{note}</p>}
    </form>
  );
}
