import Link from "next/link";
import { getAreas } from "@/lib/propertyApi";

export const metadata = {
  title: "Gorakhpur Ke Areas — Property By Location | Skyline Properties",
  description: "Taramandal, Golghar, Civil Lines, Rapti Nagar, Betiahata aur Gorakhpur ke sabhi areas mein property dekhein.",
};

const AREA_DESCRIPTIONS = {
  "Taramandal": "Gorakhpur ka sabse premium residential area — high-rise apartments aur modern lifestyle.",
  "Rapti Nagar": "Shant, hara-bhara residential colony — families ke liye perfect.",
  "Civil Lines": "Court aur main market ke paas, professionals ke liye ideal location.",
  "Golghar": "Gorakhpur ka sabse busy commercial hub — shopping aur business ke liye best.",
  "Betiahata": "Well-established residential area, schools aur hospitals ke nazdeek.",
  "Mohaddipur": "Rapti river ke paas, plots aur investment ke liye popular.",
  "Paadri Bazar": "Affordable rental options, college aur bazar dono nazdeek.",
  "Shahpur": "Purana, hara-bhara mohalla — bade bungalows ke liye jaana jaata hai.",
};

export default async function AreasPage() {
  const areas = await getAreas();

  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">BROWSE BY LOCATION</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Gorakhpur Ke Areas</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">Apne pasandida area mein available properties dekhein.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-[1180px] mx-auto px-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {areas.map((area) => (
            <Link
              key={area}
              href={`/areas/${encodeURIComponent(area.toLowerCase().replace(/\s+/g, "-"))}`}
              className="bg-white border border-slate-200 rounded-[10px] p-6 shadow-card hover:shadow-elevated transition-shadow"
            >
              <h3 className="font-display text-lg font-semibold text-navy mb-2">{area}, Gorakhpur</h3>
              <p className="text-slate-500 text-sm">{AREA_DESCRIPTIONS[area] || `${area} mein available properties dekhein.`}</p>
              <span className="inline-block mt-3 text-brand font-semibold text-sm">Properties Dekhein →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
