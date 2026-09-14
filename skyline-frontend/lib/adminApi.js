const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const KEY_STORAGE = "admin_key";

export function getStoredAdminKey() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(KEY_STORAGE) || "";
}

export function storeAdminKey(key) {
  if (typeof window !== "undefined") sessionStorage.setItem(KEY_STORAGE, key);
}

export function clearAdminKey() {
  if (typeof window !== "undefined") sessionStorage.removeItem(KEY_STORAGE);
}

export async function verifyAdminKey(key) {
  try {
    const res = await fetch(`${API_URL}/api/admin/verify`, {
      headers: { "X-Admin-Key": key },
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function adminCreateProperty(key, data) {
  const res = await fetch(`${API_URL}/api/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": key },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to create property");
  return res.json();
}

export async function adminUpdateProperty(key, slug, data) {
  const res = await fetch(`${API_URL}/api/properties/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Key": key },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to update property");
  return res.json();
}

export async function adminDeleteProperty(key, slug) {
  const res = await fetch(`${API_URL}/api/properties/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": key },
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to delete property");
  return res.json();
}

// ---- Blog ----
export async function adminCreateBlogPost(key, data) {
  const res = await fetch(`${API_URL}/api/blog`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Admin-Key": key },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to create post");
  return res.json();
}

export async function adminUpdateBlogPost(key, slug, data) {
  const res = await fetch(`${API_URL}/api/blog/${encodeURIComponent(slug)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "X-Admin-Key": key },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to update post");
  return res.json();
}

export async function adminDeleteBlogPost(key, slug) {
  const res = await fetch(`${API_URL}/api/blog/${encodeURIComponent(slug)}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": key },
  });
  if (!res.ok) throw new Error((await res.json()).detail || "Failed to delete post");
  return res.json();
}

// ---- Comments ----
export async function adminGetComments(key, status = "") {
  const qs = status ? `?status=${status}` : "";
  const res = await fetch(`${API_URL}/api/admin/comments${qs}`, {
    headers: { "X-Admin-Key": key },
  });
  if (!res.ok) throw new Error("Failed to load comments");
  return res.json();
}

export async function adminApproveComment(key, id) {
  const res = await fetch(`${API_URL}/api/admin/comments/${id}/approve`, {
    method: "PUT",
    headers: { "X-Admin-Key": key },
  });
  if (!res.ok) throw new Error("Failed to approve comment");
  return res.json();
}

export async function adminDeleteComment(key, id) {
  const res = await fetch(`${API_URL}/api/admin/comments/${id}`, {
    method: "DELETE",
    headers: { "X-Admin-Key": key },
  });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}
