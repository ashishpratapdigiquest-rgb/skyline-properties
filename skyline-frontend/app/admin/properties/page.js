"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getProperties } from "@/lib/propertyApi";
import { getStoredAdminKey, clearAdminKey, adminCreateProperty, adminUpdateProperty, adminDeleteProperty } from "@/lib/adminApi";
import SmartImage from "@/components/Common/SmartImage";
import { getImageUrl } from "@/lib/imageUrl";

const EMPTY_FORM = {
  title: "", purpose: "sale", propertyType: "Apartment", status: "Ready to Move",
  city: "", area: "", address: "", latitude: "", longitude: "",
  price: "", priceDisplay: "", rentDisplay: "", beds: 0, baths: 0, areaSqft: "",
  floor: "", tag: "", featured: false, verified: false,
  description: "", amenities: "", images: [],
};

function toFormValues(p) {
  return {
    ...EMPTY_FORM,
    ...p,
    amenities: (p.amenities || []).join(", "),
    images: p.images || [],
  };
}

function toApiPayload(form) {
  return {
    ...form,
    price: Number(form.price) || 0,
    beds: Number(form.beds) || 0,
    baths: Number(form.baths) || 0,
    areaSqft: form.areaSqft ? Number(form.areaSqft) : null,
    latitude: form.latitude ? Number(form.latitude) : null,
    longitude: form.longitude ? Number(form.longitude) : null,
    amenities: form.amenities ? form.amenities.split(",").map((s) => s.trim()).filter(Boolean) : [],
    images: (form.images || []).filter(Boolean),
    tag: form.tag || null,
  };
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminPropertiesPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (!stored) {
      router.push("/admin");
      return;
    }
    setKey(stored);
  }, [router]);

  useEffect(() => {
    if (!key) return;
    loadProperties();
  }, [key]);

  async function loadProperties() {
    setLoading(true);
    const data = await getProperties({ limit: 50, sort: "latest" });
    setProperties(data.items || []);
    setLoading(false);
  }

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
    setError("");
    setFormOpen(true);
  }

  function openEditForm(property) {
    setForm(toFormValues(property));
    setEditingSlug(property.slug);
    setError("");
    setFormOpen(true);
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleImageFiles(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const dataUrls = await Promise.all(files.map(fileToDataUrl));
    setForm((f) => ({ ...f, images: [...(f.images || []), ...dataUrls] }));
    e.target.value = ""; // allow re-selecting the same file later
  }

  function removeImage(index) {
    setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = toApiPayload(form);
      if (editingSlug) {
        await adminUpdateProperty(key, editingSlug, payload);
      } else {
        await adminCreateProperty(key, payload);
      }
      setFormOpen(false);
      await loadProperties();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(property) {
    if (!confirm(`Delete "${property.title}"? This cannot be undone.`)) return;
    try {
      await adminDeleteProperty(key, property.slug);
      await loadProperties();
    } catch (err) {
      alert(err.message);
    }
  }

  function handleLogout() {
    clearAdminKey();
    router.push("/admin");
  }

  if (!key) return null;

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Manage Properties</h1>
          <p className="text-slate-500 text-sm mt-1">Add, edit, or remove listings. Changes go live immediately.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openAddForm} className="btn btn-primary">+ Add New Property</button>
          <Link href="/admin/blog" className="btn btn-outline">Blog</Link>
          <Link href="/admin/agents" className="btn btn-outline">Agents</Link>
          <Link href="/admin/testimonials" className="btn btn-outline">Testimonials</Link>
          <Link href="/admin/comments" className="btn btn-outline">Comments</Link>
          <button onClick={handleLogout} className="btn btn-outline">Log Out</button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-6">
        ⚠️ On the free Render plan, this data resets whenever the backend redeploys or restarts. For permanent storage, upgrade to a real database.
      </div>

      {loading ? (
        <p className="text-slate-500">Loading properties...</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">City</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Purpose</th>
                <th className="px-5 py-3 font-medium">Featured</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-navy">{p.title}</td>
                  <td className="px-5 py-3 text-slate-600">{p.city}</td>
                  <td className="px-5 py-3 text-slate-600">{p.priceDisplay}</td>
                  <td className="px-5 py-3 text-slate-600 capitalize">{p.purpose}</td>
                  <td className="px-5 py-3">{p.featured ? "✓" : "—"}</td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <button onClick={() => openEditForm(p)} className="text-brand font-semibold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p)} className="text-red-500 font-semibold hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {properties.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-400">No properties yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit form modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-7 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-navy">
                {editingSlug ? "Edit Property" : "Add New Property"}
              </h2>
              <button type="button" onClick={() => setFormOpen(false)} className="text-slate-400 text-2xl leading-none">✕</button>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Title" required value={form.title} onChange={(v) => updateField("title", v)} />
              <SelectField label="Purpose" value={form.purpose} onChange={(v) => updateField("purpose", v)} options={["sale", "rent"]} />
              <Field label="Property Type" required value={form.propertyType} onChange={(v) => updateField("propertyType", v)} placeholder="Apartment, Villa, Office..." />
              <Field label="Status" value={form.status} onChange={(v) => updateField("status", v)} placeholder="Ready to Move" />
              <Field label="City" required value={form.city} onChange={(v) => updateField("city", v)} />
              <Field label="Area / Neighborhood" value={form.area} onChange={(v) => updateField("area", v)} />
              <Field label="Address" value={form.address} onChange={(v) => updateField("address", v)} className="sm:col-span-2" />
              <Field label="Latitude" type="number" value={form.latitude} onChange={(v) => updateField("latitude", v)} />
              <Field label="Longitude" type="number" value={form.longitude} onChange={(v) => updateField("longitude", v)} />
              <Field label="Price (number)" type="number" required value={form.price} onChange={(v) => updateField("price", v)} />
              <Field label="Price Display" value={form.priceDisplay} onChange={(v) => updateField("priceDisplay", v)} placeholder="$1.2M" />
              <Field label="Rent Display" value={form.rentDisplay} onChange={(v) => updateField("rentDisplay", v)} placeholder="$4,500/mo" />
              <Field label="Beds" type="number" value={form.beds} onChange={(v) => updateField("beds", v)} />
              <Field label="Baths" type="number" value={form.baths} onChange={(v) => updateField("baths", v)} />
              <Field label="Area (sqft)" type="number" value={form.areaSqft} onChange={(v) => updateField("areaSqft", v)} />
              <Field label="Floor" value={form.floor} onChange={(v) => updateField("floor", v)} />
              <SelectField label="Tag" value={form.tag} onChange={(v) => updateField("tag", v)} options={["", "NEW", "FEATURED", "LUXURY"]} />
              <div className="flex items-center gap-4 pt-6">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => updateField("featured", e.target.checked)} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.verified} onChange={(e) => updateField("verified", e.target.checked)} /> Verified</label>
              </div>
              <Field label="Description" as="textarea" value={form.description} onChange={(v) => updateField("description", v)} className="sm:col-span-2" />
              <Field label="Amenities (comma-separated)" value={form.amenities} onChange={(v) => updateField("amenities", v)} className="sm:col-span-2" placeholder="Gym, Pool, Parking" />

              <div className="sm:col-span-2">
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Photos</label>
                <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-6 cursor-pointer hover:border-brand hover:bg-brand-tint text-sm text-slate-500">
                  <input type="file" accept="image/*" multiple onChange={handleImageFiles} className="hidden" />
                  📷 Apne computer/phone se photo select karo (multiple choose kar sakte ho)
                </label>
                {form.images?.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mt-3">
                    {form.images.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200">
                        <SmartImage src={getImageUrl(img)} alt={`Photo ${i + 1}`} fill className="object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          aria-label={`Remove photo ${i + 1}`}
                          className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={saving} className="btn btn-primary flex-1 justify-center disabled:opacity-60">
                {saving ? "Saving..." : editingSlug ? "Save Changes" : "Add Property"}
              </button>
              <button type="button" onClick={() => setFormOpen(false)} className="btn btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false, placeholder = "", as, className = "" }) {
  return (
    <div className={className}>
      <label className="block text-[13px] font-semibold text-navy mb-1.5">{label}</label>
      {as === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder={placeholder}
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
        />
      ) : (
        <input
          type={type}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
        />
      )}
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-navy mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand bg-white"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt === "" ? "None" : opt}</option>
        ))}
      </select>
    </div>
  );
}
