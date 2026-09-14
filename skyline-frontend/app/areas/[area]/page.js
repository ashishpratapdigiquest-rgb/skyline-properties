import { notFound } from "next/navigation";
import PropertyCard from "@/components/Property/PropertyCard";
import { getProperties, getAreas } from "@/lib/propertyApi";

function slugToArea(slug) {
  return decodeURIComponent(slug).replace(/-/g, " ");
}

export async function generateMetadata({ params }) {
  const areaName = slugToArea(params.area);
  const titleCase = areaName.replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `Property in ${titleCase}, Gorakhpur | Skyline Properties`,
    description: `${titleCase}, Gorakhpur mein flat, plot, villa aur office ke liye verified listings dekhein. Skyline Properties ke saath apna sapno ka ghar dhundein.`,
    alternates: { canonical: `/areas/${params.area}` },
  };
}

export default async function AreaPage({ params }) {
  const areaName = slugToArea(params.area);
  const allAreas = await getAreas();
  const matchedArea = allAreas.find((a) => a.toLowerCase() === areaName.toLowerCase());

  if (!matchedArea) notFound();

  const result = await getProperties({ area: matchedArea, limit: 24 });
  const properties = result.items || [];
  const titleCase = matchedArea;

  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">GORAKHPUR • {titleCase.toUpperCase()}</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Property in {titleCase}, Gorakhpur</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">
            {titleCase} mein {result.total} verified {result.total === 1 ? "listing" : "listings"} available — flat, plot, villa aur office space.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-[1180px] mx-auto px-6">
          {properties.length === 0 ? (
            <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
              <p className="text-navy font-display text-lg font-semibold mb-2">Abhi {titleCase} mein koi listing nahi hai</p>
              <p className="text-slate-500 text-sm">Jald hi naye listings add honge — hamare saare properties yahan dekhein.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
