const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80";

/**
 * Resolve an image reference coming from the API into a usable URL.
 * Handles: null/undefined, absolute URLs, protocol-relative URLs,
 * relative/media paths, and trailing-slash edge cases.
 */
export function getImageUrl(image) {
  if (!image || typeof image !== "string" || image.trim() === "") {
    return FALLBACK_IMAGE;
  }

  const trimmed = image.trim();

  // Base64 data URI (from a direct file upload) — use as-is
  if (trimmed.startsWith("data:image/")) return trimmed;

  // Already absolute (http/https) or protocol-relative
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;

  // Relative/media path returned by the backend, e.g. "/media/foo.jpg" or "media/foo.jpg"
  const base = API_URL.replace(/\/+$/, "");
  const path = trimmed.replace(/^\/+/, "");
  return `${base}/${path}`;
}

/**
 * Resolve a whole images array, always returning at least one (fallback) image.
 */
export function getImageUrls(images) {
  if (!Array.isArray(images) || images.length === 0) return [FALLBACK_IMAGE];
  return images.map(getImageUrl);
}

export { FALLBACK_IMAGE };
