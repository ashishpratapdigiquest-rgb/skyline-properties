import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { getProperties } from "@/lib/api";

export const metadata = { title: "Properties | Unique Property" };

export default async function PropertiesPage() {
  const properties = await getProperties();

  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">FIND YOUR PLACE IN THE SKY</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Browse Our Properties</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">500+ verified luxury listings across the world's most desirable skylines.</p>
        </div>
      </section>

      <section className="pt-10">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-elevated grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            {[
              { label: "📍 Location", val: "All Locations" },
              { label: "🏠 Type", val: "Any Type" },
              { label: "💲 Budget", val: "Any Budget" },
              { label: "📐 Size", val: "Any Size" },
            ].map((f, i) => (
              <div key={f.label} className={`px-5.5 py-4 ${i < 3 ? "lg:border-r border-slate-200" : ""}`}>
                <label className="block text-[11px] text-slate-500 mb-1">{f.label}</label>
                <div className="text-[14.5px] font-semibold text-navy flex items-center justify-between">{f.val} <span>▾</span></div>
              </div>
            ))}
            <button className="bg-brand hover:bg-brand-dark text-white rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl px-8 py-4 font-semibold flex items-center justify-center gap-2 col-span-2 lg:col-span-1">
              Search Now
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2" /><path d="M21 21l-4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
          <div className="text-center mt-11">
            <Link href="/contact" className="btn btn-outline">Load More Properties</Link>
          </div>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-6 pb-6">
        <div
          className="rounded-2xl p-9 lg:p-11 flex flex-col lg:flex-row items-center justify-between gap-6 text-white bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(120deg, rgba(26,86,219,.92), rgba(13,37,69,.92)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=60')" }}
        >
          <h3 className="text-2xl font-display font-semibold max-w-md text-center lg:text-left">Can't find what you're looking for?</h3>
          <Link href="/contact" className="btn bg-white text-brand border border-white hover:bg-brand-tint">Talk to an Agent →</Link>
        </div>
      </div>
    </>
  );
}
