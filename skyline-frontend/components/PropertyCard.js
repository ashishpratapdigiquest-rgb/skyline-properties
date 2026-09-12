import Image from "next/image";
import Link from "next/link";

const TAG_STYLES = {
  FEATURED: "bg-navy",
  NEW: "bg-green-600",
  LUXURY: "bg-purple-600",
};

export default function PropertyCard({ property }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[10px] overflow-hidden shadow-card hover:shadow-elevated transition-shadow">
      <div className="relative h-[190px]">
        <Image src={property.image} alt={property.title} fill className="object-cover" />
        {property.tag && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white ${TAG_STYLES[property.tag] || "bg-navy"}`}>
            {property.tag === "LUXURY" ? "♛ LUXURY" : property.tag}
          </span>
        )}
        <span className="absolute bottom-3 left-3 bg-navy/85 text-white px-3 py-1 rounded-lg font-bold text-sm">
          {property.priceDisplay}
        </span>
      </div>
      <div className="p-5">
        <h3 className="text-[17px] font-display font-semibold text-navy mb-1">{property.title}</h3>
        <p className="text-[13.5px] text-slate-500 mb-3">📍 {property.location}</p>
        <div className="flex gap-3.5 flex-wrap text-[12.5px] text-slate-500 mb-4 pb-4 border-b border-slate-200">
          <span>🛏 {property.beds} Beds</span>
          <span>🛁 {property.baths} Baths</span>
          <span>📐 {property.sqft.toLocaleString()} Sqft</span>
          <span>🏙 {property.floor}</span>
        </div>
        <Link href="/contact" className="btn btn-primary w-full justify-center !py-2.5 text-sm">
          View Property
        </Link>
      </div>
    </div>
  );
}
