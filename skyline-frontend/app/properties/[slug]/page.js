import { notFound } from "next/navigation";
import Link from "next/link";
import { getPropertyBySlug, getSimilarProperties } from "@/lib/propertyApi";
import { getImageUrls } from "@/lib/imageUrl";
import PropertyGallery from "@/components/Property/PropertyGallery";
import PropertyCard from "@/components/Property/PropertyCard";
import ShareButtons from "@/components/Property/ShareButtons";
import FavoriteButton from "@/components/Property/FavoriteButton";
import Breadcrumbs from "@/components/Property/Breadcrumbs";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://skyline-properties-iota.vercel.app";

export async function generateMetadata({ params }) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) {
    return { title: "Property Not Found | Skyline Properties" };
  }
  const description = property.description?.slice(0, 155) || `${property.title} — ${property.city}`;
  return {
    title: `${property.title} | Skyline Properties`,
    description,
    alternates: { canonical: `/properties/${property.slug}` },
    openGraph: {
      title: property.title,
      description,
      images: getImageUrls(property.images),
    },
  };
}

export default async function PropertyDetailsPage({ params }) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(params.slug, 3);
  const images = getImageUrls(property.images);
  const pageUrl = `${SITE_URL}/properties/${property.slug}`;
  const priceLabel = property.purpose === "rent" ? (property.rentDisplay || property.priceDisplay) : property.priceDisplay;

  const specs = [
    property.beds > 0 && { label: "Bedrooms", value: property.beds },
    property.baths > 0 && { label: "Bathrooms", value: property.baths },
    property.areaSqft && { label: "Area", value: `${property.areaSqft.toLocaleString()} Sqft` },
    property.propertyType && { label: "Property Type", value: property.propertyType },
    property.floor && { label: "Floor", value: property.floor },
    property.status && { label: "Status", value: property.status },
    { label: "Property ID", value: `UP-${String(property.id).padStart(4, "0")}` },
  ].filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: property.title,
    description: property.description,
    image: images,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.city,
    },
    ...(property.latitude && property.longitude
      ? { geo: { "@type": "GeoCoordinates", latitude: property.latitude, longitude: property.longitude } }
      : {}),
  };

  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="py-8">
        <div className="max-w-[1180px] mx-auto px-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Properties", href: "/properties" },
              { label: property.city, href: `/properties?city=${encodeURIComponent(property.city)}` },
              { label: property.title },
            ]}
          />
        </div>
      </section>

      <section className="pb-8">
        <div className="max-w-[1180px] mx-auto px-6">
          <PropertyGallery images={images} title={property.title} />
        </div>
      </section>

      <section className="pb-16">
        <div className="max-w-[1180px] mx-auto px-6 grid lg:grid-cols-[2fr_1fr] gap-10">
          <div>
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  {property.tag && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white bg-navy">{property.tag}</span>
                  )}
                  {property.verified && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold text-white bg-brand">✓ Verified</span>
                  )}
                  <span className="px-3 py-1 rounded-full text-[11px] font-bold text-navy bg-brand-tint uppercase">
                    For {property.purpose === "rent" ? "Rent" : "Sale"}
                  </span>
                </div>
                <h1 className="font-display text-[28px] sm:text-[32px] font-bold text-navy">{property.title}</h1>
                <p className="text-slate-500 mt-1.5">📍 {property.address || `${property.area}, ${property.city}`}</p>
              </div>
              <div className="flex items-center gap-2">
                <FavoriteButton />
                <ShareButtons title={property.title} url={pageUrl} />
              </div>
            </div>

            <p className="font-display text-2xl font-bold text-brand mt-3 mb-8">{priceLabel}</p>

            {/* Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 pb-10 border-b border-slate-200">
              {specs.map((s) => (
                <div key={s.label}>
                  <span className="block text-[12px] text-slate-500">{s.label}</span>
                  <span className="block text-[15px] font-semibold text-navy mt-0.5">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-10 pb-10 border-b border-slate-200">
              <h2 className="font-display text-xl font-semibold text-navy mb-3">Description</h2>
              {property.description && property.description.length > 220 ? (
                <details className="group">
                  <summary className="text-slate-600 text-[15px] leading-relaxed cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                    <span className="line-clamp-3 group-open:hidden">{property.description}</span>
                    <span className="hidden group-open:inline">{property.description}</span>
                    <span className="block text-brand font-semibold text-sm mt-2 group-open:hidden">Read more</span>
                    <span className="hidden group-open:block text-brand font-semibold text-sm mt-2">Read less</span>
                  </summary>
                </details>
              ) : (
                <p className="text-slate-600 text-[15px] leading-relaxed">{property.description || "No description available for this property yet."}</p>
              )}
            </div>

            {/* Amenities */}
            {property.amenities?.length > 0 && (
              <div className="mb-10 pb-10 border-b border-slate-200">
                <h2 className="font-display text-xl font-semibold text-navy mb-4">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {property.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="text-brand">✓</span> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location / Map */}
            {property.latitude && property.longitude && (
              <div>
                <h2 className="font-display text-xl font-semibold text-navy mb-4">Location</h2>
                <div className="rounded-2xl overflow-hidden border border-slate-200 h-[320px]">
                  <iframe
                    title={`Map showing ${property.title}`}
                    className="w-full h-full"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${property.longitude - 0.01}%2C${property.latitude - 0.01}%2C${property.longitude + 0.01}%2C${property.latitude + 0.01}&layer=mapnik&marker=${property.latitude}%2C${property.longitude}`}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact sidebar */}
          <div className="bg-brand-tint rounded-2xl p-7 h-fit lg:sticky lg:top-24">
            <h3 className="font-display text-lg font-semibold text-navy mb-2">Interested in this property?</h3>
            <p className="text-slate-500 text-sm mb-5">Speak with a Skyline Properties specialist about {property.title}.</p>
            <Link href="/contact" className="btn btn-primary w-full justify-center">Enquire Now</Link>
            <a href="tel:+919876543210" className="btn btn-outline w-full justify-center mt-3">Call +91 98765 43210</a>
          </div>
        </div>
      </section>

      {/* Similar properties */}
      {similar?.length > 0 && (
        <section className="pb-16">
          <div className="max-w-[1180px] mx-auto px-6">
            <h2 className="font-display text-2xl font-semibold text-navy mb-6">Similar Properties</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
