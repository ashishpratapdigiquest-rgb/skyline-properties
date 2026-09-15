"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCompare } from "@/components/Property/CompareProvider";
import { getPropertyBySlug } from "@/lib/propertyApi";
import { getImageUrl } from "@/lib/imageUrl";
import SmartImage from "@/components/Common/SmartImage";

const ROWS = [
  { label: "Price", key: (p) => p.purpose === "rent" ? (p.rentDisplay || p.priceDisplay) : p.priceDisplay },
  { label: "Purpose", key: (p) => p.purpose === "rent" ? "For Rent" : "For Sale" },
  { label: "Property Type", key: (p) => p.propertyType },
  { label: "Location", key: (p) => `${p.area || ""}, ${p.city || ""}` },
  { label: "Bedrooms", key: (p) => p.beds > 0 ? p.beds : "—" },
  { label: "Bathrooms", key: (p) => p.baths > 0 ? p.baths : "—" },
  { label: "Area", key: (p) => p.areaSqft ? `${p.areaSqft.toLocaleString()} sqft` : "—" },
  { label: "Floor", key: (p) => p.floor || "—" },
  { label: "Status", key: (p) => p.status || "—" },
  { label: "Verified", key: (p) => p.verified ? "✓ Yes" : "—" },
  { label: "Amenities", key: (p) => (p.amenities || []).join(", ") || "—" },
];

export default function ComparePage() {
  const { slugs, removeFromCompare, clearCompare } = useCompare();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slugs.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(slugs.map((s) => getPropertyBySlug(s))).then((results) => {
      setProperties(results.filter(Boolean));
      setLoading(false);
    });
  }, [slugs]);

  return (
    <section className="py-14">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-[30px] font-bold text-navy">Compare Properties</h1>
            <p className="text-slate-500 text-sm mt-1">Side by side dekhkar sahi decision lena aasan ho jaata hai.</p>
          </div>
          {properties.length > 0 && (
            <button onClick={clearCompare} className="btn btn-outline">Clear All</button>
          )}
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <p className="text-navy font-display text-lg font-semibold mb-2">Koi property compare ke liye nahi chuni</p>
            <p className="text-slate-500 text-sm mb-5">Properties page par jaakar "Compare" button dabao (kam se kam 2 chunein).</p>
            <Link href="/properties" className="btn btn-primary">Properties Dekhein →</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="text-left p-3 w-[140px]"></th>
                  {properties.map((p) => (
                    <th key={p.id} className="p-3 align-top">
                      <div className="relative bg-white border border-slate-200 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => removeFromCompare(p.slug)}
                          className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full bg-black/50 text-white text-xs flex items-center justify-center"
                          aria-label={`Remove ${p.title} from comparison`}
                        >
                          ✕
                        </button>
                        <div className="relative h-[140px]">
                          <SmartImage src={getImageUrl(p.images?.[0])} alt={p.title} fill className="object-cover" />
                        </div>
                        <div className="p-3">
                          <h3 className="font-display font-semibold text-navy text-[14px] mb-2 leading-tight">{p.title}</h3>
                          <Link href={`/properties/${p.slug}`} className="text-brand text-xs font-semibold hover:underline">View Details →</Link>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROWS.map((row, i) => (
                  <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                    <td className="p-3 font-semibold text-navy text-sm">{row.label}</td>
                    {properties.map((p) => (
                      <td key={p.id} className="p-3 text-slate-600 text-sm">{row.key(p)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
