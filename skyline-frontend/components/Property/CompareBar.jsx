"use client";
import Link from "next/link";
import { useCompare } from "./CompareProvider";

export default function CompareBar() {
  const { slugs, removeFromCompare, clearCompare } = useCompare();

  if (slugs.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-navy text-white shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
      <div className="max-w-[1180px] mx-auto px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold">
            {slugs.length} {slugs.length === 1 ? "property" : "properties"} compare ke liye select ki
          </span>
          <button onClick={clearCompare} className="text-[#c7d4e8] text-xs underline hover:text-white">
            Clear all
          </button>
        </div>
        <div className="flex items-center gap-3">
          {slugs.length >= 2 ? (
            <Link href="/compare" className="btn btn-primary !py-2 !px-5 text-sm">
              Compare Now →
            </Link>
          ) : (
            <span className="text-[#c7d4e8] text-xs">Kam se kam 2 properties chuno</span>
          )}
        </div>
      </div>
    </div>
  );
}
