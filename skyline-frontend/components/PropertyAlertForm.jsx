"use client";
import { useState } from "react";
import { createPropertyAlert } from "@/lib/propertyApi";

export default function PropertyAlertForm({ areas = [], propertyTypes = [] }) {
  const [form, setForm] = useState({ name: "", phone: "", purpose: "sale", area: "", property_type: "", max_budget: "" });
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    const payload = { ...form, max_budget: form.max_budget ? Number(form.max_budget) : null };
    const res = await createPropertyAlert(payload);
    setNote(res.message);
    setLoading(false);
    if (res.success !== false) {
      setForm({ name: "", phone: "", purpose: "sale", area: "", property_type: "", max_budget: "" });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-7 shadow-elevated">
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Aapka Naam</label>
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} type="text" placeholder="Jaise: Ramesh Kumar"
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Phone Number</label>
          <input required value={form.phone} onChange={(e) => update("phone", e.target.value)} type="tel" placeholder="+91 98765 43210"
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Purpose</label>
          <select value={form.purpose} onChange={(e) => update("purpose", e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand bg-white">
            <option value="sale">Kharidna (Buy)</option>
            <option value="rent">Kiraye Par (Rent)</option>
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Property Type</label>
          <select value={form.property_type} onChange={(e) => update("property_type", e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand bg-white">
            <option value="">Koi Bhi</option>
            {propertyTypes.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4 mb-5">
        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Pasandida Area</label>
          <select value={form.area} onChange={(e) => update("area", e.target.value)}
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand bg-white">
            <option value="">Koi Bhi Area</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Max Budget (₹)</label>
          <input value={form.max_budget} onChange={(e) => update("max_budget", e.target.value)} type="number" placeholder="jaise 5000000"
            className="w-full px-3.5 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center disabled:opacity-60">
        {loading ? "Saving..." : "Alert Set Karo"}
      </button>
      {note && <p className="mt-3.5 text-brand text-[13.5px] font-semibold">{note}</p>}
    </form>
  );
}
