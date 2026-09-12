"use client";
import { useState } from "react";

/**
 * Temporary UI-only favorite toggle. No backend/user API exists yet for
 * persistent favorites — that belongs to Phase 3 (auth + user accounts).
 * State resets on page reload by design.
 */
export default function FavoriteButton({ className = "" }) {
  const [saved, setSaved] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setSaved((s) => !s)}
      aria-pressed={saved}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      title="Favorites are temporary until account sign-in is added"
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        saved ? "bg-red-50 text-red-500" : "bg-brand-tint text-brand hover:bg-brand-tint2"
      } ${className}`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
