import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { CompareProvider } from "@/components/Property/CompareProvider";
import CompareBar from "@/components/Property/CompareBar";
import { AuthProvider } from "@/components/Auth/AuthProvider";
import { getSettings } from "@/lib/settingsApi";

export const revalidate = 60;

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

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: settings.site_name,
    image: settings.logo_image || "https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&w=800&q=80",
    telephone: settings.phone_number,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: settings.address,
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

  return (
    <html lang="en-IN">
      <body className="font-sans text-slate-700 antialiased">
        {/* eslint-disable-next-line react/no-danger */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }} />
        <AuthProvider>
          <Header settings={settings} />
          <CompareProvider>
            {children}
            <CompareBar />
          </CompareProvider>
          <Footer settings={settings} />
          <WhatsAppButton whatsappNumber={settings.whatsapp_number} />
        </AuthProvider>
      </body>
    </html>
  );
}
