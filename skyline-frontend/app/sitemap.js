import { getProperties, getAreas } from "@/lib/propertyApi";
import { getBlogPosts } from "@/lib/blogApi";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://skyline-properties-iota.vercel.app";

export default async function sitemap() {
  const staticPages = [
    "", "properties", "about", "services", "agents", "blog", "contact",
    "areas", "emi-calculator", "property-alerts",
  ].map((path) => ({
    url: `${SITE_URL}/${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: path === "" ? 1.0 : 0.7,
  }));

  let propertyPages = [];
  let areaPages = [];
  let blogPages = [];

  try {
    const result = await getProperties({ limit: 50 });
    propertyPages = (result.items || []).map((p) => ({
      url: `${SITE_URL}/properties/${p.slug}`,
      lastModified: new Date(p.createdAt || Date.now()),
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const areas = await getAreas();
    areaPages = areas.map((a) => ({
      url: `${SITE_URL}/areas/${a.toLowerCase().replace(/\s+/g, "-")}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.75,
    }));

    const posts = await getBlogPosts();
    blogPages = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    // backend unreachable at build time — sitemap still returns static pages
  }

  return [...staticPages, ...propertyPages, ...areaPages, ...blogPages];
}
