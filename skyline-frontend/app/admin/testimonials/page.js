"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredAdminKey, adminGetAllTestimonials, adminApproveTestimonial, adminCreateTestimonial, adminUpdateTestimonial, adminDeleteTestimonial } from "@/lib/adminApi";

const EMPTY_FORM = { name: "", rating: 5, quote: "", photo: "" };

export default function AdminTestimonialsPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("pending");
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
  }, [key, filter]);

  async function load() {
    setLoading(true);
    setItems(await adminGetAllTestimonials(key, filter));
    setLoading(false);
  }

  async function handleApprove(item) {
    await adminApproveTestimonial(key, item.id);
    await load();
  }

  function openAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setFormOpen(true);
  }

  function openEdit(item) {
    setForm({ name: item.name, rating: item.rating, quote: item.quote, photo: item.photo || "" });
    setEditingId(item.id);
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
        await adminUpdateTestimonial(key, editingId, payload);
      } else {
        await adminCreateTestimonial(key, payload);
      }
      setFormOpen(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    if (!confirm(`Delete testimonial from "${item.name}"?`)) return;
    try {
      await adminDeleteTestimonial(key, item.id);
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
          <h1 className="font-display text-2xl font-bold text-navy">Manage Testimonials</h1>
          <p className="text-slate-500 text-sm mt-1">Customer reviews approve karein ya khud bhi add karein.</p>
        </div>
        <button onClick={openAdd} className="btn btn-primary">+ Add Testimonial</button>
      </div>

      <div className="flex gap-2 mb-6">
        {["pending", "approved", ""].map((f) => (
          <button
            key={f || "all"}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${filter === f ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}
          >
            {f === "" ? "All" : f === "pending" ? "Pending" : "Approved"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500">Koi testimonial nahi mila.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((t) => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-[10px] p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full overflow-hidden flex-shrink-0">
                    <img src={t.photo} alt={t.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-navy text-sm">{t.name}</div>
                    <div className="text-amber-400 text-xs">{"★".repeat(t.rating)}</div>
                  </div>
                </div>
                {!t.approved && (
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-700 whitespace-nowrap">PENDING</span>
                )}
              </div>
              <p className="text-slate-600 text-sm italic mb-3">{t.quote}</p>
              <div className="flex gap-3 text-sm flex-wrap">
                {!t.approved && (
                  <button onClick={() => handleApprove(t)} className="text-green-600 font-semibold hover:underline">Approve</button>
                )}
                <button onClick={() => openEdit(t)} className="text-brand font-semibold hover:underline">Edit</button>
                <button onClick={() => handleDelete(t)} className="text-red-500 font-semibold hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-7 w-full max-w-md my-8">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-navy">{editingId ? "Edit Testimonial" : "Add Testimonial"}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="text-slate-400 text-2xl leading-none">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Customer Name</label>
                <input required value={form.name} onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={form.rating} onChange={(e) => updateField("rating", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Quote</label>
                <textarea required rows={3} value={form.quote} onChange={(e) => updateField("quote", e.target.value)}
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
                {saving ? "Saving..." : editingId ? "Save Changes" : "Add Testimonial"}
              </button>
              <button type="button" onClick={() => setFormOpen(false)} className="btn btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
