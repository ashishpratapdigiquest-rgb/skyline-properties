"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import PropertyCard from "@/components/Property/PropertyCard";
import PropertyFilters from "@/components/Property/PropertyFilters";
import PropertySkeleton from "@/components/Common/PropertySkeleton";
import { getProperties, getPropertyTypes, getAreas } from "@/lib/propertyApi";

const PropertyMap = dynamic(() => import("@/components/Property/PropertyMap"), {
  ssr: false,
  loading: () => <div className="h-[500px] bg-slate-100 rounded-2xl animate-pulse" />,
});

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "featured", label: "Featured First" },
  { value: "most_viewed", label: "Most Viewed" },
];

const FILTER_KEYS = ["q", "city", "area", "property_type", "purpose", "min_price", "max_price", "beds", "baths", "min_area", "max_area", "featured"];

function readFiltersFromParams(searchParams) {
  const filters = {};
  FILTER_KEYS.forEach((key) => {
    const val = searchParams.get(key);
    if (val) filters[key] = val;
  });
  return filters;
}

export default function PropertiesClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState(() => readFiltersFromParams(searchParams));
  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "latest");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);

  const [result, setResult] = useState({ items: [], total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState("grid");

  const debounceRef = useRef(null);

  // Load filter option lists once
  useEffect(() => {
    getPropertyTypes().then(setPropertyTypes);
    getAreas().then(setAreas);
  }, []);

  // Sync state -> URL (shareable, back/forward friendly)
  const syncUrl = useCallback((nextFilters, nextSort, nextPage) => {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (nextSort && nextSort !== "latest") params.set("sort", nextSort);
    if (nextPage && nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [router, pathname]);

  // Fetch whenever filters/sort/page change
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProperties({ ...filters, sort, page: view === "map" ? 1 : page, limit: view === "map" ? 50 : 9 })
      .then((data) => {
        if (cancelled) return;
        if (!data || !Array.isArray(data.items)) {
          setError("Unable to load properties. Please try again.");
          setResult({ items: [], total: 0, totalPages: 1 });
        } else {
          setResult(data);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load properties. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [filters, sort, page, view]);

  function handleFiltersChange(next) {
    setFilters(next);
    setPage(1);
    syncUrl(next, sort, 1);
  }

  function handleClearFilters() {
    const cleared = {};
    setFilters(cleared);
    setKeyword("");
    setPage(1);
    syncUrl(cleared, sort, 1);
  }

  function handleSortChange(value) {
    setSort(value);
    syncUrl(filters, value, page);
  }

  function handlePageChange(nextPage) {
    setPage(nextPage);
    syncUrl(filters, sort, nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Debounced keyword search — avoids firing a request on every keystroke
  function handleKeywordInput(value) {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const next = { ...filters, q: value || undefined };
      if (!value) delete next.q;
      setFilters(next);
      setPage(1);
      syncUrl(next, sort, 1);
    }, 450);
  }

  function retry() {
    setError(null);
    setPage((p) => p); // trigger effect again by resetting via a no-op state change
    setFilters((f) => ({ ...f }));
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <PropertyFilters
        filters={filters}
        onChange={handleFiltersChange}
        onClear={handleClearFilters}
        propertyTypes={propertyTypes}
        areas={areas}
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
      />

      <div className="flex-1 min-w-0">
        {/* Search + mobile filter/sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            value={keyword}
            onChange={(e) => handleKeywordInput(e.target.value)}
            placeholder="Search by title, city, or area..."
            aria-label="Search properties"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="lg:hidden btn btn-outline !py-3 justify-center"
          >
            Filters
          </button>
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            aria-label="Sort properties"
            className="px-4 py-3 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand bg-white"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>Sort: {opt.label}</option>
            ))}
          </select>
          <div className="flex border border-slate-200 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={`px-4 py-3 text-sm font-medium ${view === "grid" ? "bg-brand text-white" : "bg-white text-slate-600"}`}
            >
              ▦ Grid
            </button>
            <button
              type="button"
              onClick={() => setView("map")}
              className={`px-4 py-3 text-sm font-medium ${view === "map" ? "bg-brand text-white" : "bg-white text-slate-600"}`}
            >
              📍 Map
            </button>
          </div>
        </div>

        {/* Result count */}
        {!loading && !error && (
          <p className="text-sm text-slate-500 mb-4">
            {result.total} {result.total === 1 ? "property" : "properties"} found
          </p>
        )}

        {/* Loading */}
        {loading && (view === "map" ? <div className="h-[500px] bg-slate-100 rounded-2xl animate-pulse" /> : <PropertySkeleton count={6} />)}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <p className="text-slate-600 mb-4">{error}</p>
            <button type="button" onClick={retry} className="btn btn-primary">Retry</button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && result.items.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <p className="text-navy font-display text-lg font-semibold mb-2">No properties found</p>
            <p className="text-slate-500 text-sm mb-5">Try adjusting your filters or search terms.</p>
            <button type="button" onClick={handleClearFilters} className="btn btn-outline">Clear Filters</button>
          </div>
        )}

        {/* Map view */}
        {!loading && !error && result.items.length > 0 && view === "map" && (
          <PropertyMap properties={result.items} />
        )}

        {/* Grid view */}
        {!loading && !error && result.items.length > 0 && view === "grid" && (
          <>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {result.items.map((p) => <PropertyCard key={p.id} property={p} />)}
            </div>

            {/* Pagination */}
            {result.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand"
                >
                  Previous
                </button>
                {Array.from({ length: result.totalPages }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handlePageChange(i + 1)}
                    aria-current={page === i + 1 ? "page" : undefined}
                    className={`w-9 h-9 rounded-lg text-sm font-medium ${page === i + 1 ? "bg-brand text-white" : "border border-slate-200 hover:border-brand"}`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  type="button"
                  disabled={page >= result.totalPages}
                  onClick={() => handlePageChange(page + 1)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:border-brand"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
