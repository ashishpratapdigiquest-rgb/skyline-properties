"use client";
import { useState } from "react";
import { submitContact } from "@/lib/api";
import HoneypotField from "@/components/HoneypotField";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", interest: "Buying a property", message: "", website: "" });
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const res = await submitContact(form);
    setNote(res.message);
    setLoading(false);
    if (res.success !== false) {
      setForm({ name: "", email: "", phone: "", interest: "Buying a property", message: "", website: "" });
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-elevated">
      <h3 className="font-display text-xl font-semibold text-navy mb-5">Send Us a Message</h3>
      <form onSubmit={handleSubmit}>
        <HoneypotField value={form.website} onChange={(v) => update("website", v)} />
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[13px] font-semibold text-navy mb-1.5">Full Name</label>
            <input required value={form.name} onChange={(e) => update("name", e.target.value)} type="text" placeholder="Jane Doe"
              className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-navy mb-1.5">Phone Number</label>
            <input value={form.phone} onChange={(e) => update("phone", e.target.value)} type="tel" placeholder="+1 (555) 000 0000"
              className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-[13px] font-semibold text-navy mb-1.5">Email Address</label>
            <input required value={form.email} onChange={(e) => update("email", e.target.value)} type="email" placeholder="jane@email.com"
              className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-navy mb-1.5">Interested In</label>
            <select value={form.interest} onChange={(e) => update("interest", e.target.value)}
              className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand">
              <option>Buying a property</option>
              <option>Selling a property</option>
              <option>Investment advisory</option>
              <option>Property management</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Message</label>
          <textarea required value={form.message} onChange={(e) => update("message", e.target.value)} rows={5} placeholder="Tell us what you're looking for..."
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
          {loading ? "Sending..." : "Send Message"}
        </button>
        {note && <p className="mt-3.5 text-brand text-[13.5px] font-semibold">{note}</p>}
      </form>
    </div>
  );
}
