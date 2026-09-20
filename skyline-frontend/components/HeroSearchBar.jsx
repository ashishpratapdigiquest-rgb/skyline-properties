"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAreas, getPropertyTypes } from "@/lib/propertyApi";

const BUDGET_OPTIONS = [
  { label: "Select Budget", min: "", max: "" },
  { label: "Under ₹50 Lakh", min: "", max: "5000000" },
  { label: "₹50 Lakh - ₹1 Crore", min: "5000000", max: "10000000" },
  { label: "₹1 Crore - ₹2 Crore", min: "10000000", max: "20000000" },
  { label: "Above ₹2 Crore", min: "20000000", max: "" },
];

const SIZE_OPTIONS = [
  { label: "Select Size", min: "", max: "" },
  { label: "Under 1000 sqft", min: "", max: "1000" },
  { label: "1000 - 2000 sqft", min: "1000", max: "2000" },
  { label: "2000 - 3000 sqft", min: "2000", max: "3000" },
  { label: "Above 3000 sqft", min: "3000", max: "" },
];

export default function HeroSearchBar() {
  const router = useRouter();
  const [areas, setAreas] = useState([]);
  const [types, setTypes] = useState([]);
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState(0);
  const [size, setSize] = useState(0);

  useEffect(() => {
    getAreas().then(setAreas);
    getPropertyTypes().then(setTypes);
  }, []);

  function handleSearch() {
    const params = new URLSearchParams();
    if (location) params.set("area", location);
    if (type) params.set("property_type", type);
    const b = BUDGET_OPTIONS[budget];
    if (b.min) params.set("min_price", b.min);
    if (b.max) params.set("max_price", b.max);
    const s = SIZE_OPTIONS[size];
    if (s.min) params.set("min_area", s.min);
    if (s.max) params.set("max_area", s.max);

    const qs = params.toString();
    router.push(`/properties${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-elevated grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
      <div className="px-5.5 py-4 lg:border-r border-slate-200">
        <label className="block text-[11px] text-slate-500 mb-1">📍 Location</label>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full text-[14.5px] font-semibold text-navy bg-transparent outline-none appearance-none cursor-pointer"
        >
          <option value="">Select Location</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className="px-5.5 py-4 lg:border-r border-slate-200">
        <label className="block text-[11px] text-slate-500 mb-1">🏠 Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full text-[14.5px] font-semibold text-navy bg-transparent outline-none appearance-none cursor-pointer"
        >
          <option value="">Property Type</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="px-5.5 py-4 lg:border-r border-slate-200">
        <label className="block text-[11px] text-slate-500 mb-1">💲 Budget</label>
        <select
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="w-full text-[14.5px] font-semibold text-navy bg-transparent outline-none appearance-none cursor-pointer"
        >
          {BUDGET_OPTIONS.map((b, i) => <option key={b.label} value={i}>{b.label}</option>)}
        </select>
      </div>

      <div className="px-5.5 py-4">
        <label className="block text-[11px] text-slate-500 mb-1">📐 Size</label>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-full text-[14.5px] font-semibold text-navy bg-transparent outline-none appearance-none cursor-pointer"
        >
          {SIZE_OPTIONS.map((s, i) => <option key={s.label} value={i}>{s.label}</option>)}
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="bg-brand hover:bg-brand-dark text-white rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl px-8 py-4 font-semibold flex items-center justify-center gap-2 col-span-2 lg:col-span-1"
      >
        Search Now
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2" /><path d="M21 21l-4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
      </button>
    </div>
  );
}
