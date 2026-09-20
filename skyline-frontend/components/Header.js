"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthProvider";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/agents", label: "Agents" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header({ settings }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useAuth();

  const siteName = settings?.site_name || "Skyline Properties";
  const [logoTop, ...rest] = siteName.split(" ");
  const logoBottom = rest.join(" ") || "PROPERTIES";
  const phone = settings?.phone_number || "+91 98765 43210";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;
  const phone2 = settings?.phone_number_2 || "";
  const phone2Href = `tel:${phone2.replace(/\s+/g, "")}`;

  const PhoneIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1L6.6 10.8z" fill="#fff" />
    </svg>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <div className="max-w-[1180px] mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-navy text-lg">
          {settings?.logo_image ? (
            <img src={settings.logo_image} alt={siteName} className="w-[34px] h-[34px] object-contain" />
          ) : (
            <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
              <rect x="4" y="16" width="7" height="20" rx="1" fill="#1a56db" />
              <rect x="13" y="8" width="7" height="28" rx="1" fill="#0d2545" />
              <rect x="22" y="20" width="7" height="16" rx="1" fill="#1a56db" />
              <rect x="31" y="4" width="7" height="32" rx="1" fill="#0d2545" />
            </svg>
          )}
          <span>
            {logoTop.toUpperCase()}
            <small className="block text-[9px] tracking-[.16em] text-brand font-semibold">{logoBottom.toUpperCase()}</small>
          </span>
        </Link>

        <button
          className="lg:hidden p-1.5"
          aria-label="Toggle menu"
          onClick={() => setOpen(!open)}
        >
          <span className="block w-6 h-0.5 bg-navy my-1.5"></span>
          <span className="block w-6 h-0.5 bg-navy my-1.5"></span>
          <span className="block w-6 h-0.5 bg-navy my-1.5"></span>
        </button>

        <nav className={`${open ? "block" : "hidden"} lg:block fixed lg:static top-[70px] left-0 right-0 bg-white lg:bg-transparent border-b lg:border-0 border-slate-200 px-6 lg:px-0 py-4 lg:py-0 shadow-lg lg:shadow-none`}>
          <ul className="flex flex-col lg:flex-row gap-4 lg:gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={pathname === item.href ? "nav-link-active" : "nav-link"}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="md:hidden">
              <Link href={user ? "/favorites" : "/login"} className="nav-link">
                {user ? "♥ My Favorites" : "Login / Sign Up"}
              </Link>
            </li>
            <li className="sm:hidden">
              <a href={phoneHref} className="nav-link">📞 {phone}</a>
            </li>
            {phone2 && (
              <li className="sm:hidden">
                <a href={phone2Href} className="nav-link">📞 {phone2}</a>
              </li>
            )}
            {phone2 && (
              <li className="hidden sm:block lg:hidden">
                <a href={phone2Href} className="nav-link">📞 {phone2}</a>
              </li>
            )}
          </ul>
        </nav>

        <Link
          href={user ? "/favorites" : "/login"}
          className="hidden md:flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-brand"
        >
          {user ? <>♥ Favorites</> : <>Login</>}
        </Link>

        <div
          className="hidden sm:flex items-center gap-2.5 bg-navy text-white px-5 py-2.5 rounded-full font-semibold text-sm whitespace-nowrap"
        >
          <PhoneIcon />
          <a href={phoneHref} className="hover:underline">{phone}</a>
          {phone2 && (
            <>
              <span className="text-white/30">|</span>
              <a href={phone2Href} className="hover:underline hidden lg:inline">{phone2}</a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
