"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSettings } from "@/lib/settingsApi";
import { getStoredAdminKey, adminUpdateSettings } from "@/lib/adminApi";
import { getImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/Common/SmartImage";

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (!stored) { router.push("/admin"); return; }
    setKey(stored);
  }, [router]);

  useEffect(() => {
    if (!key) return;
    getSettings().then((s) => { setForm(s); setLoading(false); });
  }, [key]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleLogoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    update("logo_image", dataUrl);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setNote("");
    try {
      await adminUpdateSettings(key, form);
      setNote("Settings saved! Website par turant reflect ho jaayega.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!key || loading || !form) return <div className="p-10 text-slate-500">Loading...</div>;

  return (
    <div className="max-w-[700px] mx-auto px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-navy mb-1">Site Settings</h1>
      <p className="text-slate-500 text-sm mb-7">Logo, WhatsApp number, phone, email aur address — poori site mein ye yahin se control hote hain.</p>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-7 space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Site Name (logo text)</label>
          <input required value={form.site_name} onChange={(e) => update("site_name", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
          <p className="text-[11.5px] text-slate-400 mt-1">Header/footer mein pehla word upar, baaki neeche chhote text mein dikhta hai.</p>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Logo Image (optional)</label>
          <div className="flex items-center gap-4">
            {form.logo_image && (
              <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                <SmartImage src={getImageUrl(form.logo_image)} alt="Logo preview" fill className="object-contain" />
              </div>
            )}
            <label className="flex-1 flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 rounded-lg py-4 cursor-pointer hover:border-brand hover:bg-brand-tint text-sm text-slate-500">
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
              📷 Logo image upload karo
            </label>
            {form.logo_image && (
              <button type="button" onClick={() => update("logo_image", null)} className="text-red-500 text-sm font-semibold">Remove</button>
            )}
          </div>
          <p className="text-[11.5px] text-slate-400 mt-1">Agar upload nahi karoge, to default icon dikhega.</p>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Phone Number (calls, header, contact page)</label>
          <input required value={form.phone_number} onChange={(e) => update("phone_number", e.target.value)} placeholder="+91 98765 43210"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">WhatsApp Number</label>
          <input required value={form.whatsapp_number} onChange={(e) => update("whatsapp_number", e.target.value)} placeholder="919876543210"
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
          <p className="text-[11.5px] text-slate-400 mt-1">Country code + number, bina '+' ya space ke. Jaise: 919876543210</p>
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Email Address</label>
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-navy mb-1.5">Office Address</label>
          <textarea required rows={2} value={form.address} onChange={(e) => update("address", e.target.value)}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {note && <p className="text-brand text-sm font-semibold">{note}</p>}

        <button type="submit" disabled={saving} className="btn btn-primary w-full justify-center disabled:opacity-60">
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
