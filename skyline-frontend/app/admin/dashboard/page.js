"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredAdminKey, adminGetAnalytics } from "@/lib/adminApi";

function StatCard({ label, value, icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-brand-tint flex items-center justify-center text-lg">{icon}</div>
        <div>
          <b className="block text-2xl font-display text-navy">{value}</b>
          <span className="text-slate-500 text-xs">{label}</span>
        </div>
      </div>
    </div>
  );
}

function BarRow({ label, count, max, color = "bg-brand" }) {
  const pct = max > 0 ? Math.round((count / max) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-medium text-navy">{label}</span>
        <span className="text-slate-500">{count}</span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (!stored) { router.push("/admin"); return; }
    setKey(stored);
  }, [router]);

  useEffect(() => {
    if (!key) return;
    adminGetAnalytics(key)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  if (!key) return null;
  if (loading) return <div className="p-10 text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="p-10 text-red-500">{error}</div>;

  const { counts, type_counts, purpose_counts, top_properties, recent_leads } = data;
  const maxTypeCount = Math.max(...Object.values(type_counts), 1);
  const maxViews = Math.max(...top_properties.map((p) => p.views), 1);

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-navy">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Website ka overview — properties, leads, aur activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Properties" value={counts.properties} icon="🏠" />
        <StatCard label="Total Leads" value={counts.total_leads} icon="📨" />
        <StatCard label="Pending Comments" value={counts.pending_comments} icon="🗨️" />
        <StatCard label="Registered Users" value={counts.registered_users} icon="👤" />
        <StatCard label="Blog Posts" value={counts.blog_posts} icon="📝" />
        <StatCard label="Agents" value={counts.agents} icon="🧑‍💼" />
        <StatCard label="Testimonials" value={counts.testimonials} icon="💬" />
        <StatCard label="Approved Comments" value={counts.approved_comments} icon="✅" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Property types */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-semibold text-navy mb-4">Properties by Type</h2>
          {Object.entries(type_counts).map(([type, count]) => (
            <BarRow key={type} label={type} count={count} max={maxTypeCount} />
          ))}
        </div>

        {/* Sale vs Rent */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <h2 className="font-display font-semibold text-navy mb-4">Sale vs Rent</h2>
          <BarRow label="For Sale" count={purpose_counts.sale || 0} max={counts.properties} color="bg-brand" />
          <BarRow label="For Rent" count={purpose_counts.rent || 0} max={counts.properties} color="bg-amber-500" />

          <h2 className="font-display font-semibold text-navy mb-4 mt-6">Most Viewed Properties</h2>
          {top_properties.length === 0 ? (
            <p className="text-slate-400 text-sm">Abhi tak koi views nahi hain.</p>
          ) : (
            top_properties.map((p) => (
              <BarRow key={p.slug} label={p.title} count={p.views} max={maxViews} color="bg-purple-500" />
            ))
          )}
        </div>
      </div>

      {/* Recent leads */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-display font-semibold text-navy">Recent Leads</h2>
          <Link href="/admin/leads" className="text-brand text-sm font-semibold hover:underline">Sab Dekhein →</Link>
        </div>
        {recent_leads.length === 0 ? (
          <p className="text-slate-400 text-sm p-5">Abhi tak koi lead nahi aayi.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Contact</th>
                <th className="px-5 py-3 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {recent_leads.map((lead, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-5 py-3">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${lead.type === "Contact Form" ? "bg-blue-50 text-blue-700" : "bg-purple-50 text-purple-700"}`}>
                      {lead.type}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-medium text-navy">{lead.name}</td>
                  <td className="px-5 py-3 text-slate-600">{lead.contact}</td>
                  <td className="px-5 py-3 text-slate-500">{lead.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
