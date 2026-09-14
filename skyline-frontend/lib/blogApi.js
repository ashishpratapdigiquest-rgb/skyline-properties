const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function safeGet(path, fallback) {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Request failed");
    return await res.json();
  } catch {
    return fallback;
  }
}

export async function getBlogPosts() {
  return safeGet("/api/blog", []);
}

export async function getBlogPostBySlug(slug) {
  return safeGet(`/api/blog/${encodeURIComponent(slug)}`, null);
}

export async function getApprovedComments(slug) {
  return safeGet(`/api/blog/${encodeURIComponent(slug)}/comments`, []);
}

export async function submitComment(slug, payload) {
  try {
    const res = await fetch(`${API_URL}/api/blog/${encodeURIComponent(slug)}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { success: false, message: "Could not reach the server. Please try again shortly." };
  }
}
