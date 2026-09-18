const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Discovered existing FastAPI contract (see skyline-backend/main.py):
 *   GET  /api/properties            -> { items, total, page, limit, totalPages } (filters via query params)
 *   GET  /api/properties/{slug}     -> single property (slug or numeric id both work)
 *   GET  /api/properties/featured   -> array
 *   GET  /api/properties/latest     -> array
 *   GET  /api/properties/{slug}/similar -> array
 *   GET  /api/property-types        -> array of strings
 *   GET  /api/locations             -> array of strings (cities)
 *
 * Supported filter query params on /api/properties:
 *   q, city, property_type, purpose (sale|rent), min_price, max_price,
 *   beds, baths, min_area, max_area, featured, sort, page, limit
 *
 * Supported sort values: latest | price_asc | price_desc | featured | most_viewed
 */

const EMPTY_RESULT = { items: [], total: 0, page: 1, limit: 9, totalPages: 1 };

function buildQuery(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

async function safeGet(path, fallback) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 30 } });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return await res.json();
  } catch (err) {
    return fallback;
  }
}

/**
 * Fetch a filtered/sorted/paginated list of properties.
 * params: { q, city, property_type, purpose, min_price, max_price, beds, baths,
 *           min_area, max_area, featured, sort, page, limit }
 */
export async function getProperties(params = {}) {
  const qs = buildQuery(params);
  return safeGet(`/api/properties${qs}`, EMPTY_RESULT);
}

export async function getPropertyBySlug(slug) {
  return safeGet(`/api/properties/${encodeURIComponent(slug)}`, null);
}

export async function getFeaturedProperties(limit = 3) {
  return safeGet(`/api/properties/featured?limit=${limit}`, []);
}

export async function getLatestProperties(limit = 6) {
  return safeGet(`/api/properties/latest?limit=${limit}`, []);
}

export async function getSimilarProperties(slug, limit = 3) {
  return safeGet(`/api/properties/${encodeURIComponent(slug)}/similar?limit=${limit}`, []);
}

export async function getPropertyTypes() {
  return safeGet(`/api/property-types`, []);
}

export async function getPropertyLocations() {
  return safeGet(`/api/locations`, []);
}

export async function getAreas() {
  return safeGet(`/api/areas`, []);
}

export async function createPropertyAlert(payload) {
  try {
    const res = await fetch(`${API_URL}/api/property-alerts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Could not reach the server. Please try again shortly." };
  }
}
