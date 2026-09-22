"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminKey } from "@/lib/adminApi";

const NAV_ITEMS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/admin/properties", label: "Properties", icon: "🏠" },
  { href: "/admin/leads", label: "Leads", icon: "📨" },
  { href: "/admin/chat", label: "Live Chat", icon: "💬" },
  { href: "/admin/blog", label: "Blog", icon: "📝" },
  { href: "/admin/agents", label: "Agents", icon: "👤" },
  { href: "/admin/testimonials", label: "Testimonials", icon: "⭐" },
  { href: "/admin/comments", label: "Comments", icon: "🗨️" },
  { href: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearAdminKey();
    router.push("/admin");
  }

  return (
    <aside className="w-full lg:w-[240px] flex-shrink-0 bg-white border-b lg:border-b-0 lg:border-r border-slate-200">
      <div className="p-5 border-b border-slate-200">
        <span className="font-display font-bold text-navy text-lg">Admin Panel</span>
      </div>
      <nav className="p-3 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                active ? "bg-brand text-white" : "text-slate-600 hover:bg-brand-tint"
              }`}
            >
              <span>{item.icon}</span> {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t border-slate-200 mt-2 lg:mt-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50"
        >
          🚪 Log Out
        </button>
      </div>
    </aside>
  );
}
