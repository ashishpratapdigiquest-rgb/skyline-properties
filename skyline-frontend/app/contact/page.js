import ContactForm from "@/components/ContactForm";

export const metadata = { title: "Contact | Skyline Properties" };

const infoRows = [
  { icon: "📞", title: "Call Us", desc: "+1 (800) 123 4567" },
  { icon: "✉️", title: "Email Us", desc: "hello@skylineproperties.com" },
  { icon: "📍", title: "Visit Us", desc: "200 Skyline Avenue, Suite 4800, New York, NY 10001" },
  { icon: "🕐", title: "Office Hours", desc: "Mon–Sat, 9:00 AM – 7:00 PM" },
];

export default function ContactPage() {
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
        </div>
      </section>
    </>
  );
}
