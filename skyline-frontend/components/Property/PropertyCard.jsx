import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/lib/imageUrl";

const TAG_STYLES = {
  FEATURED: "bg-navy",
  NEW: "bg-green-600",
  LUXURY: "bg-purple-600",
};

export default function PropertyCard({ property }) {
  if (!property) return null;

  const href = property.slug ? `/properties/${property.slug}` : `/properties/${property.id}`;
  const cover = getImageUrl(property.images?.[0] || property.image);
  const priceLabel =
    property.purpose === "rent"
      ? property.rentDisplay || property.priceDisplay
      : property.priceDisplay;

  return (
    <Link
      href={href}
      className="group block bg-white border border-slate-200 rounded-[10px] overflow-hidden shadow-card hover:shadow-elevated transition-shadow focus:outline-none focus:ring-2 focus:ring-brand"
      aria-label={`View details for ${property.title}`}
    >
      <div className="relative h-[190px] bg-slate-100">
        <Image
          src={cover}
          alt={property.title || "Property photo"}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {property.tag && (
          <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold text-white ${TAG_STYLES[property.tag] || "bg-navy"}`}>
            {property.tag === "LUXURY" ? "♛ LUXURY" : property.tag}
          </span>
        )}
        {property.verified && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-brand">
            ✓ Verified
          </span>
        )}
        {priceLabel && (
          <span className="absolute bottom-3 left-3 bg-navy/85 text-white px-3 py-1 rounded-lg font-bold text-sm">
            {priceLabel}
          </span>
        )}
        {property.purpose && (
          <span className="absolute bottom-3 right-3 bg-white/90 text-navy px-2.5 py-1 rounded-lg font-semibold text-[11px] uppercase">
            For {property.purpose === "rent" ? "Rent" : "Sale"}
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-[17px] font-display font-semibold text-navy mb-1">{property.title}</h3>
        <p className="text-[13.5px] text-slate-500 mb-3">
          📍 {[property.area, property.city].filter(Boolean).join(", ") || "Location unavailable"}
        </p>
        <div className="flex gap-3.5 flex-wrap text-[12.5px] text-slate-500 mb-4 pb-4 border-b border-slate-200">
          {typeof property.beds === "number" && property.beds > 0 && <span>🛏 {property.beds} Beds</span>}
          {typeof property.baths === "number" && property.baths > 0 && <span>🛁 {property.baths} Baths</span>}
          {property.areaSqft && <span>📐 {property.areaSqft.toLocaleString()} Sqft</span>}
          {property.floor && <span>🏙 {property.floor}</span>}
        </div>
        <span className="btn btn-primary w-full justify-center !py-2.5 text-sm">
          View Property
        </span>
      </div>
    </Link>
  );
}
