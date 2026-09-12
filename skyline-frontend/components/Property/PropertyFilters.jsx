"use client";

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5];

export default function PropertyFilters({
  filters,
  onChange,
  onClear,
  propertyTypes = [],
  locations = [],
  isOpen = false,
  onClose,
}) {
  function update(field, value) {
    onChange({ ...filters, [field]: value });
  }

  const activeCount = Object.values(filters).filter((v) => v !== "" && v !== undefined && v !== null).length;

  const content = (
    <div className="space-y-6">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-display font-semibold text-navy text-lg">Filters</h3>
        <button type="button" onClick={onClose} aria-label="Close filters" className="text-slate-500 text-2xl leading-none">
          ✕
        </button>
      </div>

      {/* Purpose: Buy / Rent */}
      <div>
        <label className="block text-[13px] font-semibold text-navy mb-2">Purpose</label>
        <div className="flex gap-2">
          {["", "sale", "rent"].map((p) => (
            <button
              key={p || "all"}
              type="button"
              onClick={() => update("purpose", p)}
              className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium border ${
                filters.purpose === p ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200 hover:border-brand"
              }`}
            >
              {p === "" ? "All" : p === "sale" ? "Buy" : "Rent"}
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="filter-city" className="block text-[13px] font-semibold text-navy mb-2">Location</label>
        <select
          id="filter-city"
          value={filters.city || ""}
          onChange={(e) => update("city", e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>

      {/* Property Type */}
      <div>
        <label htmlFor="filter-type" className="block text-[13px] font-semibold text-navy mb-2">Property Type</label>
        <select
          id="filter-type"
          value={filters.property_type || ""}
          onChange={(e) => update("property_type", e.target.value)}
          className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
        >
          <option value="">Any Type</option>
          {propertyTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </div>

      {/* Price range */}
      <div>
        <label className="block text-[13px] font-semibold text-navy mb-2">Price Range (USD)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.min_price || ""}
            onChange={(e) => update("min_price", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.max_price || ""}
            onChange={(e) => update("max_price", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>
        {filters.min_price && filters.max_price && Number(filters.min_price) > Number(filters.max_price) && (
          <p className="text-red-500 text-xs mt-1.5">Min price should be less than max price.</p>
        )}
      </div>

      {/* Bedrooms */}
      <div>
        <label className="block text-[13px] font-semibold text-navy mb-2">Bedrooms (min)</label>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => update("beds", "")}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border ${!filters.beds ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}
          >
            Any
          </button>
          {BEDROOM_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update("beds", String(n))}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border ${String(filters.beds) === String(n) ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}
            >
              {n}+
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms */}
      <div>
        <label className="block text-[13px] font-semibold text-navy mb-2">Bathrooms (min)</label>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => update("baths", "")}
            className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border ${!filters.baths ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}
          >
            Any
          </button>
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => update("baths", String(n))}
              className={`px-3.5 py-1.5 rounded-lg text-sm font-medium border ${String(filters.baths) === String(n) ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}
            >
              {n}+
            </button>
          ))}
        </div>
      </div>

      {/* Area */}
      <div>
        <label className="block text-[13px] font-semibold text-navy mb-2">Area (sqft)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={filters.min_area || ""}
            onChange={(e) => update("min_area", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
          <span className="text-slate-400">–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={filters.max_area || ""}
            onChange={(e) => update("max_area", e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand"
          />
        </div>
      </div>

      {/* Featured only */}
      <label className="flex items-center gap-2.5 cursor-pointer">
        <input
          type="checkbox"
          checked={filters.featured === "true"}
          onChange={(e) => update("featured", e.target.checked ? "true" : "")}
          className="w-4 h-4 accent-brand"
        />
        <span className="text-sm text-slate-700">Featured properties only</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onClear} className="btn btn-outline flex-1 justify-center !py-2.5 text-sm">
          Clear All
        </button>
        {onClose && (
          <button type="button" onClick={onClose} className="btn btn-primary flex-1 justify-center !py-2.5 text-sm lg:hidden">
            Show Results
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-[280px] flex-shrink-0 bg-white border border-slate-200 rounded-2xl p-6 h-fit sticky top-24">
        {content}
      </aside>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white p-6 overflow-y-auto">
            {content}
          </div>
        </div>
      )}

      {activeCount > 0 && (
        <span className="sr-only">{activeCount} filters active</span>
      )}
    </>
  );
}
