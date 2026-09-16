"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/Auth/AuthProvider";

export default function FavoriteButton({ slug, className = "" }) {
  const router = useRouter();
  const { user, favoriteSlugs, toggleFavorite } = useAuth();
  const saved = favoriteSlugs.includes(slug);

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    await toggleFavorite(slug);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      title={user ? (saved ? "Favorites se hatao" : "Favorites mein save karo") : "Save karne ke liye login karein"}
      className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
        saved ? "bg-red-50 text-red-500" : "bg-brand-tint text-brand hover:bg-brand-tint2"
      } ${className}`}
    >
      {saved ? "♥" : "♡"}
    </button>
  );
}
