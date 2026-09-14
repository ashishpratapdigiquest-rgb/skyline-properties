import Image from "next/image";
import Link from "next/link";
import PropertyCard from "@/components/Property/PropertyCard";
import AgentCard from "@/components/AgentCard";
import { getAgents, getTestimonials } from "@/lib/api";
import { getFeaturedProperties } from "@/lib/propertyApi";
import NewsletterForm from "@/components/NewsletterForm";

export default async function HomePage() {
  const [featured, agents, testimonials] = await Promise.all([
    getFeaturedProperties(3),
    getAgents(),
    getTestimonials(),
  ]);

  const topAgents = agents.slice(0, 4);

  const locations = [
    { name: "Taramandal", image: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=400&q=80" },
    { name: "Golghar", image: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&w=400&q=80" },
    { name: "Civil Lines", image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=400&q=80" },
    { name: "Rapti Nagar", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80" },
    { name: "Betiahata", image: "https://images.unsplash.com/photo-1519452575417-564c1401ecc0?auto=format&fit=crop&w=400&q=80" },
  ];

  const steps = [
    { icon: "🔍", title: "Browse Listings", desc: "Explore premium properties" },
    { icon: "👁", title: "Schedule Viewing", desc: "Visit in person or take a virtual tour" },
    { icon: "🤝", title: "Make Offer", desc: "Secure your dream home" },
    { icon: "🔑", title: "Move In", desc: "Start your new life in the skies" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="bg-gradient-to-b from-white to-brand-tint pt-14">
        <div className="max-w-[1180px] mx-auto px-6 grid lg:grid-cols-[1fr_1.15fr] gap-10 items-center">
          <div>
            <p className="text-brand font-bold text-[13px] tracking-[.08em] mb-3.5">TRUSTED PROPERTY DEALER IN GORAKHPUR</p>
            <h1 className="font-display text-[46px] font-bold leading-[1.1] text-navy -tracking-[.01em]">
              Live Above <br />the <span className="text-brand">Skyline.</span>
            </h1>
            <p className="mt-4 text-slate-500 text-base max-w-[420px]">
              Gorakhpur, Uttar Pradesh mein aapke sapno ka ghar, plot ya office — Taramandal se Golghar tak, sab jagah hum hain.
            </p>
            <div className="flex gap-3.5 mt-7 flex-wrap">
              <Link href="/properties" className="btn btn-primary">Properties Dekho →</Link>
              <Link href="/contact" className="btn btn-outline">Free Consultation</Link>
            </div>
            <div className="flex items-center gap-3.5 mt-6">
              <div className="icon-badge w-11 h-11">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M17 20v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" stroke="#1a56db" strokeWidth="1.8" /><circle cx="10" cy="8" r="3.5" stroke="#1a56db" strokeWidth="1.8" /><path d="M21 20v-2a4 4 0 0 0-3-3.87" stroke="#1a56db" strokeWidth="1.8" /><path d="M15.5 4.13a4 4 0 0 1 0 7.75" stroke="#1a56db" strokeWidth="1.8" /></svg>
              </div>
              <div>
                <b className="block text-xl text-navy">500+</b>
                <span className="text-[13px] text-slate-500">Gorakhpur Mein Properties Listed</span>
              </div>
            </div>
          </div>
          <div className="relative rounded-[18px] overflow-hidden shadow-elevated h-[360px]">
            <Image src="https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=1200&q=80" alt="City skyline at golden hour" fill className="object-cover" priority />
          </div>
        </div>

        {/* Search bar */}
        <div className="max-w-[1180px] mx-auto px-6 mt-8">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-elevated grid grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]">
            {[
              { label: "📍 Location", val: "Select Location" },
              { label: "🏠 Type", val: "Property Type" },
              { label: "💲 Budget", val: "Select Budget" },
              { label: "📐 Size", val: "Select Size" },
            ].map((f, i) => (
              <div key={f.label} className={`px-5.5 py-4 ${i < 3 ? "lg:border-r border-slate-200" : ""}`}>
                <label className="block text-[11px] text-slate-500 mb-1">{f.label}</label>
                <div className="text-[14.5px] font-semibold text-navy flex items-center justify-between">
                  {f.val} <span>▾</span>
                </div>
              </div>
            ))}
            <button className="bg-brand hover:bg-brand-dark text-white rounded-b-2xl lg:rounded-b-none lg:rounded-r-2xl px-8 py-4 font-semibold flex items-center justify-center gap-2 col-span-2 lg:col-span-1">
              Search Now
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#fff" strokeWidth="2" /><path d="M21 21l-4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></svg>
            </button>
          </div>
        </div>

        {/* Stat strip */}
        <div className="max-w-[1180px] mx-auto px-6 mt-8 pb-16">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-card p-5.5 grid grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "🏢", b: "500+", s: "Luxury Properties" },
              { icon: "🛡️", b: "Verified", s: "Agents" },
              { icon: "🏷️", b: "Best", s: "Market Price" },
              { icon: "⏱️", b: "Fast", s: "Closing" },
            ].map((s, i) => (
              <div key={s.s} className={`flex items-center gap-3 justify-center py-2 ${i < 3 ? "lg:border-r border-slate-200" : ""}`}>
                <div className="icon-badge">{s.icon}</div>
                <div>
                  <b className="block text-navy text-[15px]">{s.b}</b>
                  <span className="text-slate-500 text-[12.5px]">{s.s}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Properties */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-11">
            <div className="section-eyebrow"><span className="text-brand font-semibold text-sm">Signature Properties</span></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        </div>
      </section>

      {/* Prime Locations */}
      <section className="pb-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-8">
            <div className="section-eyebrow"><span className="text-brand font-semibold text-sm">Prime Locations</span></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4.5">
            {locations.map((loc) => (
              <Link key={loc.name} href={`/areas/${loc.name.toLowerCase().replace(/\s+/g, "-")}`} className="relative rounded-xl overflow-hidden h-[120px] group">
                <Image src={loc.image} alt={loc.name} fill className="object-cover brightness-[.65] group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute bottom-3 left-3.5 text-white font-semibold text-[14.5px]">{loc.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <div className="max-w-[1180px] mx-auto px-6">
        <div
          className="rounded-2xl p-9 lg:p-11 flex flex-col lg:flex-row items-center justify-between gap-6 text-white bg-cover bg-center"
          style={{ backgroundImage: "linear-gradient(120deg, rgba(26,86,219,.92), rgba(13,37,69,.92)), url('https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1400&q=60')" }}
        >
          <h3 className="text-2xl font-display font-semibold max-w-md text-center lg:text-left">Zero Agent Fees — This Quarter Only</h3>
          <Link href="/properties" className="btn bg-white text-brand border border-white hover:bg-brand-tint">Discover Deals →</Link>
        </div>
      </div>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-11">
            <div className="section-eyebrow"><span className="text-brand font-semibold text-sm">Own Your Sky in 4 Steps</span></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-7">
            {steps.map((s) => (
              <div key={s.title} className="text-center">
                <div className="w-16 h-16 rounded-full border border-brand-tint2 mx-auto mb-4 flex items-center justify-center text-2xl">{s.icon}</div>
                <h4 className="text-[16px] font-display font-semibold text-navy mb-1.5">{s.title}</h4>
                <p className="text-slate-500 text-[13.5px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Elite Agents */}
      <section className="py-16 bg-brand-tint">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-11">
            <div className="section-eyebrow"><span className="text-brand font-semibold text-sm">Our Elite Agents</span></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5.5">
            {topAgents.map((a) => <AgentCard key={a.id} agent={a} />)}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-11">
            <div className="section-eyebrow"><span className="text-brand font-semibold text-sm">From Our Homeowners</span></div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-white border border-slate-200 rounded-[10px] p-6.5">
                <div className="flex items-center gap-3 mb-3.5">
                  <div className="w-11.5 h-11.5 rounded-full overflow-hidden relative w-[46px] h-[46px]">
                    <Image src={t.photo} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <div className="font-semibold text-navy text-sm">{t.name}</div>
                    <div className="text-gold text-[13px]">{"★".repeat(t.rating)}</div>
                  </div>
                </div>
                <p className="italic text-[14.5px] text-slate-600">{t.quote}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-11 bg-gradient-to-br from-navy to-[#163663] text-white">
        <div className="max-w-[1180px] mx-auto px-6 flex flex-wrap items-center justify-between gap-7">
          <div>
            <h3 className="text-2xl font-display font-semibold text-white">Your Sky Address Awaits</h3>
            <p className="mt-1.5 text-[14.5px] text-[#c7d4e8]">Gorakhpur mein apna sapno ka ghar, plot ya office — sab ek hi jagah pe.</p>
          </div>
          <NewsletterForm />
          <div className="flex items-center gap-3">
            <div className="icon-badge bg-white/10">📞</div>
            <div>
              <span className="block text-[12.5px] text-[#c7d4e8]">Call Us Anytime</span>
              <b className="text-[17px]">+91 98765 43210</b>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
