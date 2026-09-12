import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "About Us | Unique Property" };

const values = [
  { icon: "🤝", title: "Transparency", desc: "Every price, fee, and detail laid out clearly, from first viewing to closing day." },
  { icon: "🏆", title: "Excellence", desc: "We only list properties and work with agents that meet our own high bar for quality." },
  { icon: "🌍", title: "Local Expertise", desc: "Deep knowledge of every skyline we operate in, from zoning rules to the best sunset views." },
];

const stats = [
  { b: "8,000+", s: "Properties Listed" },
  { b: "12", s: "Cities Worldwide" },
  { b: "4,500+", s: "Happy Homeowners" },
  { b: "98%", s: "Client Satisfaction" },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">WHO WE ARE</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Built on Trust, Elevated by Design</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">For over 15 years, Unique Property has connected discerning homeowners with the world's most exceptional addresses.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative h-[360px] rounded-2xl overflow-hidden shadow-elevated">
            <Image src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80" alt="Unique Property office team" fill className="object-cover" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1.5 bg-brand-tint text-brand font-semibold text-[12.5px] px-3.5 py-1.5 rounded-full">Our Story</span>
            <h2 className="font-display text-[28px] font-semibold text-navy mt-3.5">From One Listing to a Global Portfolio</h2>
            <p className="text-slate-500 mt-3.5 leading-relaxed text-[15px]">
              Unique Property started in 2010 with a single downtown listing and a simple belief: buying a home should feel as exciting as the view from the 40th floor. Today we represent over 500 luxury properties across 12 cities, guided by the same principle — transparent advice, meticulous service, and homes worth waking up to.
            </p>
            <ul className="mt-5 space-y-3.5">
              {[
                "15+ years guiding luxury buyers and sellers",
                "Licensed, verified agents in every market we serve",
                "Zero hidden fees, ever",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-[14.5px] text-slate-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="mt-0.5 flex-shrink-0"><path d="M20 6L9 17l-5-5" stroke="#1a56db" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14 bg-brand-tint">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.s} className="text-center py-5">
              <b className="block text-[30px] text-brand font-display font-bold">{s.b}</b>
              <span className="text-[13.5px] text-slate-500">{s.s}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-11">
            <div className="section-eyebrow"><span className="text-brand font-semibold text-sm">What Drives Us</span></div>
            <h2 className="font-display text-[32px] text-navy">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-slate-200 rounded-[10px] p-7 shadow-card">
                <div className="icon-badge w-[50px] h-[50px] rounded-xl text-2xl mb-4">{v.icon}</div>
                <h3 className="font-display text-[17px] font-semibold text-navy mb-2">{v.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-6 pb-6">
        <div className="rounded-2xl p-9 lg:p-11 flex flex-col lg:flex-row items-center justify-between gap-6 text-white bg-brand">
          <h3 className="text-2xl font-display font-semibold max-w-md text-center lg:text-left">Ready to meet the team behind the addresses?</h3>
          <Link href="/agents" className="btn bg-white text-brand border border-white hover:bg-brand-tint">Meet Our Agents →</Link>
        </div>
      </div>
    </>
  );
}
