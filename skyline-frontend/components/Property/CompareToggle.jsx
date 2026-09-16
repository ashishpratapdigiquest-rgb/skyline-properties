"use client";
import { useCompare } from "./CompareProvider";

export default function CompareToggle({ slug, title }) {
  const { isInCompare, addToCompare, removeFromCompare, slugs, maxCompare } = useCompare();
  const checked = isInCompare(slug);
  const disabled = !checked && slugs.length >= maxCompare;

  function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (checked) removeFromCompare(slug);
    else if (!disabled) addToCompare(slug);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      title={disabled ? `Max ${maxCompare} properties compare kar sakte ho` : checked ? "Compare list se hatao" : "Compare ke liye add karo"}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
        checked ? "bg-brand text-white" : "bg-white/90 text-navy hover:bg-white"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${checked ? "border-white bg-white/20" : "border-slate-400"}`}>
        {checked && "✓"}
      </span>
      Compare
    </button>
  );
}
