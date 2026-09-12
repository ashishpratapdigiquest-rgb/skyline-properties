import Link from "next/link";

export const metadata = { title: "Services | Unique Property" };

const services = [
  { icon: "🏠", title: "Buying a Home", desc: "From your first search to closing day, we guide you through financing, viewings, and negotiation with full transparency." },
  { icon: "💰", title: "Selling Your Property", desc: "Professional staging, targeted marketing, and pricing strategy to get your property in front of the right buyers, fast." },
  { icon: "📈", title: "Investment Advisory", desc: "Market analysis and portfolio guidance for buyers looking to grow wealth through premium real estate." },
  { icon: "🔑", title: "Property Management", desc: "End-to-end management for owners who want rental income without the day-to-day hassle." },
  { icon: "📋", title: "Legal & Closing Support", desc: "In-house coordination with trusted legal partners to keep contracts, titles, and closing paperwork on track." },
  { icon: "🛰️", title: "Virtual Tours & Relocation", desc: "3D walkthroughs and relocation concierge support for buyers moving from out of town or overseas." },
];

const steps = [
  { icon: "🔍", title: "Browse Listings", desc: "Explore premium properties" },
  { icon: "👁", title: "Schedule Viewing", desc: "Visit in person or take a virtual tour" },
  { icon: "🤝", title: "Make Offer", desc: "Secure your dream home" },
  { icon: "🔑", title: "Move In", desc: "Start your new life in the skies" },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">HOW WE HELP</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Full-Service, Start to Move-In</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">Whether you're buying, selling, or investing, our team handles every step of the journey above the skyline.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div key={s.title} className="bg-white border border-slate-200 rounded-[10px] p-7 shadow-card">
              <div className="icon-badge w-[50px] h-[50px] rounded-xl text-2xl mb-4">{s.icon}</div>
              <h3 className="font-display text-[17px] font-semibold text-navy mb-2">{s.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-brand-tint">
        <div className="max-w-[1180px] mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-11">
            <div className="section-eyebrow"><span className="text-brand font-semibold text-sm">Own Your Sky in 4 Steps</span></div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-7">
            {steps.map((s) => (
              <div key={s.title} className="text-center">
                <div className="w-16 h-16 rounded-full border border-brand-tint2 mx-auto mb-4 flex items-center justify-center text-2xl bg-white">{s.icon}</div>
                <h4 className="text-[16px] font-display font-semibold text-navy mb-1.5">{s.title}</h4>
                <p className="text-slate-500 text-[13.5px]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-6 py-6">
        <div className="rounded-2xl p-9 lg:p-11 flex flex-col lg:flex-row items-center justify-between gap-6 text-white bg-brand">
          <h3 className="text-2xl font-display font-semibold max-w-md text-center lg:text-left">Not sure which service you need?</h3>
          <Link href="/contact" className="btn bg-white text-brand border border-white hover:bg-brand-tint">Book a Free Consultation →</Link>
        </div>
      </div>
    </>
  );
}
