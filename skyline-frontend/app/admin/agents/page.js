"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getAgents } from "@/lib/api";
import { getStoredAdminKey, adminCreateAgent, adminUpdateAgent, adminDeleteAgent } from "@/lib/adminApi";

const EMPTY_FORM = { name: "", role: "", phone: "", rating: 5, photo: "" };

export default function AdminAgentsPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (!stored) { router.push("/admin"); return; }
    setKey(stored);
  }, [router]);

  useEffect(() => {
    if (!key) return;
    load();
  }, [key]);

  async function load() {
    setLoading(true);
    setAgents(await getAgents());
    setLoading(false);
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setFormOpen(true);
  }

  function openEdit(agent) {
    setForm({ name: agent.name, role: agent.role, phone: agent.phone, rating: agent.rating, photo: agent.photo || "" });
    setEditingId(agent.id);
    setError("");
    setFormOpen(true);
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { ...form, rating: Number(form.rating) };
      if (editingId) {
        await adminUpdateAgent(key, editingId, payload);
      } else {
        await adminCreateAgent(key, payload);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(agent) {
    if (!confirm(`Delete agent "${agent.name}"?`)) return;
    try {
      await adminDeleteAgent(key, agent.id);
      await load();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!key) return null;

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Manage Agents</h1>
          <p className="text-slate-500 text-sm mt-1">Add, edit, or remove agent profiles shown on the site.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/properties" className="btn btn-outline">Properties</Link>
          <Link href="/admin/blog" className="btn btn-outline">Blog</Link>
          <Link href="/admin/testimonials" className="btn btn-outline">Testimonials</Link>
          <button onClick={openAdd} className="btn btn-primary">+ Add Agent</button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {agents.map((a) => (
            <div key={a.id} className="bg-white border border-slate-200 rounded-[10px] p-5 text-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3">
                <img src={a.photo} alt={a.name} className="w-full h-full object-cover" />
              </div>
              <h4 className="font-semibold text-navy text-sm">{a.name}</h4>
              <p className="text-brand text-xs font-medium my-1">{a.role}</p>
              <p className="text-slate-500 text-xs mb-3">{a.phone}</p>
              <div className="flex gap-3 justify-center text-sm">
                <button onClick={() => openEdit(a)} className="text-brand font-semibold hover:underline">Edit</button>
                <button onClick={() => handleDelete(a)} className="text-red-500 font-semibold hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-7 w-full max-w-md my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-navy">{editingId ? "Edit Agent" : "Add Agent"}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="text-slate-400 text-2xl leading-none">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Name</label>
                <input required value={form.name} onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Role</label>
                <input required value={form.role} onChange={(e) => updateField("role", e.target.value)} placeholder="e.g. Senior Property Consultant"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Phone</label>
                <input required value={form.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={form.rating} onChange={(e) => updateField("rating", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Photo URL (optional)</label>
                <input value={form.photo} onChange={(e) => updateField("photo", e.target.value)} placeholder="https://..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
            </div>
            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={saving} className="btn btn-primary flex-1 justify-center disabled:opacity-60">
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Agent"}
              </button>
              <button type="button" onClick={() => setFormOpen(false)} className="btn btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
