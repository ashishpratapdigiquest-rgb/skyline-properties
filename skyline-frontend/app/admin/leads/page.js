"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredAdminKey, adminGetLeads } from "@/lib/adminApi";

export default function AdminLeadsPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (!stored) { router.push("/admin"); return; }
    setKey(stored);
  }, [router]);

  useEffect(() => {
    if (!key) return;
    adminGetLeads(key).then((data) => { setLeads(data); setLoading(false); });
  }, [key]);

  if (!key) return null;

  const filtered = filter ? leads.filter((l) => l.type === filter) : leads;

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy">All Leads</h1>
        <p className="text-slate-500 text-sm mt-1">Contact form submissions aur property alerts — sab ek jagah.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {["", "Contact Form", "Property Alert"].map((f) => (
          <button
            key={f || "all"}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${filter === f ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}
          >
            {f === "" ? "All" : f}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500">Koi lead nahi mila.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Detail</th>
                <th className="px-5 py-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => (
                <tr key={i} className="border-t border-slate-100 align-top">
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${lead.type === "Contact Form" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                      {lead.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-navy whitespace-nowrap">{lead.name}</td>
                  <td className="px-5 py-3 text-slate-600 whitespace-nowrap">{lead.contact}</td>
                  <td className="px-5 py-3 text-slate-500">{lead.detail}</td>
                  <td className="px-5 py-3 text-slate-400 text-xs whitespace-nowrap">
                    {lead.date ? new Date(lead.date).toLocaleString("en-IN") : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
