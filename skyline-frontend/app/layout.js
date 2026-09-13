import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Skyline Properties | Gorakhpur Ke Best Property Dealer",
  description: "Gorakhpur, Uttar Pradesh mein flat, plot, villa aur office ke liye trusted property dealer. Taramandal, Golghar, Civil Lines, Rapti Nagar — sab jagah verified listings.",
  keywords: ["property in Gorakhpur", "flat in Gorakhpur", "plot in Gorakhpur", "real estate Gorakhpur", "Gorakhpur property dealer", "Taramandal property", "Golghar office space"],
  openGraph: {
    title: "Skyline Properties | Gorakhpur Ke Best Property Dealer",
    description: "Gorakhpur, Uttar Pradesh mein flat, plot, villa aur office ke liye trusted property dealer.",
    locale: "en_IN",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "Skyline Properties",
  image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
  telephone: "+91-98765-43210",
  email: "hello@skylineproperties.co.in",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Bank Road, Golghar",
    addressLocality: "Gorakhpur",
    addressRegion: "Uttar Pradesh",
    postalCode: "273001",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 26.7606,
    longitude: 83.3732,
  },
  areaServed: {
    "@type": "City",
    name: "Gorakhpur",
  },
  openingHours: "Mo-Sa 09:00-19:00",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN">
      <body className="font-sans text-slate-700 antialiased">
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
