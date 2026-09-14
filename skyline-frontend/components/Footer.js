import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0a1d38] text-[#aebbd1] pt-14 pb-6">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr_1fr_1fr] gap-9 mb-9">
          <div>
            <Link href="/" className="flex items-center gap-2.5 font-display font-bold text-white text-lg">
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="16" width="7" height="20" rx="1" fill="#1a56db" />
                <rect x="13" y="8" width="7" height="28" rx="1" fill="#fff" />
                <rect x="22" y="20" width="7" height="16" rx="1" fill="#1a56db" />
                <rect x="31" y="4" width="7" height="32" rx="1" fill="#fff" />
              </svg>
              <span>
                SKYLINE
                <small className="block text-[9px] tracking-[.16em] text-brand font-semibold">PROPERTIES</small>
              </span>
            </Link>
            <p className="mt-3 text-[13.5px] leading-relaxed text-[#8a99b3]">
              Elevating lifestyles with premium properties in prime locations.
            </p>
            <div className="flex gap-2.5 mt-4">
              {["f", "◎", "in", "𝕏"].map((icon) => (
                <a key={icon} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h5 className="text-white text-[14.5px] mb-4">Explore</h5>
            <ul className="space-y-2.5 text-[13.5px]">
              <li><Link href="/properties" className="hover:text-white">Properties</Link></li>
              <li><Link href="/areas" className="hover:text-white">Areas in Gorakhpur</Link></li>
              <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              <li><Link href="/emi-calculator" className="hover:text-white">EMI Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-[14.5px] mb-4">Company</h5>
            <ul className="space-y-2.5 text-[13.5px]">
              <li><Link href="/about" className="hover:text-white">Careers</Link></li>
              <li><Link href="/about" className="hover:text-white">Press</Link></li>
              <li><Link href="/agents" className="hover:text-white">Partners</Link></li>
              <li><Link href="/services" className="hover:text-white">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="text-white text-[14.5px] mb-4">Support</h5>
            <ul className="space-y-2.5 text-[13.5px]">
              <li><Link href="/contact" className="hover:text-white">Help Center</Link></li>
              <li><Link href="/property-alerts" className="hover:text-white">Property Alerts</Link></li>
              <li><Link href="/contact" className="hover:text-white">Terms &amp; Conditions</Link></li>
              <li><Link href="/contact" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-5 text-center text-[12.5px] text-[#728198]">
          © 2025 Skyline Properties. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
