import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/settingsApi";

export const metadata = { title: "Contact Us | Skyline Properties Gorakhpur", description: "Golghar, Gorakhpur mein humse milein ya call karein." };

export default async function ContactPage() {
  const settings = await getSettings();

  const infoRows = [
    { icon: "📞", title: "Call Us", desc: settings.phone_number },
    { icon: "✉️", title: "Email Us", desc: settings.email },
    { icon: "📍", title: "Visit Us", desc: settings.address },
    { icon: "🕐", title: "Office Hours", desc: "Mon–Sat, 9:00 AM – 7:00 PM" },
  ];

  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">GET IN TOUCH</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Let's Find Your Place in the Sky</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">Questions about a listing, a service, or just getting started? Our team replies within one business day.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-[1180px] mx-auto px-6 grid lg:grid-cols-[2fr_1fr] gap-10">
          <ContactForm />

          <div>
            <div className="bg-brand-tint rounded-2xl p-7">
              {infoRows.map((row) => (
                <div key={row.title} className="flex gap-3.5 mb-6 last:mb-0">
                  <div className="icon-badge">{row.icon}</div>
                  <div>
                    <h4 className="font-display text-[15px] font-semibold text-navy mb-0.5">{row.title}</h4>
                    <p className="text-slate-500 text-[13.5px]">{row.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-2xl overflow-hidden border border-slate-200 h-[220px] mt-5">
              <iframe
                title="Skyline Properties office location — Golghar, Gorakhpur"
                className="w-full h-full"
                loading="lazy"
                src="https://www.openstreetmap.org/export/embed.html?bbox=83.36%2C26.745%2C83.38%2C26.765&layer=mapnik&marker=26.755%2C83.369"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
