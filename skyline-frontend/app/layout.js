import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Skyline Properties | Live Above the Skyline",
  description: "Premium living, prime locations. Browse 8,000+ luxury residences with Skyline Properties.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans text-slate-700 antialiased">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
