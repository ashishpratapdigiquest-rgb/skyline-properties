const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function safeFetch(path, fallback) {
  try {
    const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Bad response");
    return await res.json();
  } catch (err) {
    // Backend not running / unreachable during build — fall back to seed data
    // so the site still renders (useful for static preview/demo).
    return fallback;
  }
}

export async function getAgents() {
  return safeFetch("/api/agents", FALLBACK_AGENTS);
}

export async function getBlogPosts() {
  return safeFetch("/api/blog", FALLBACK_BLOG);
}

export async function getTestimonials() {
  return safeFetch("/api/testimonials", FALLBACK_TESTIMONIALS);
}

export async function submitContact(payload) {
  try {
    const res = await fetch(`${API_URL}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Could not reach the server. Please try again shortly." };
  }
}

export async function subscribeNewsletter(email) {
  try {
    const res = await fetch(`${API_URL}/api/newsletter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    return { success: false, message: "Could not reach the server." };
  }
}

// ---- Fallback seed data (mirrors backend/data/*.json) ----
export const FALLBACK_AGENTS = [
  { id: 1, name: "Rajesh Kumar Srivastava", role: "Senior Property Consultant", phone: "+91 98765 43210", rating: 5, photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Priya Tiwari", role: "Residential Sales Expert", phone: "+91 98765 43211", rating: 5, photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 3, name: "Amit Singh", role: "Investment Advisor", phone: "+91 98765 43212", rating: 4, photo: "https://randomuser.me/api/portraits/men/54.jpg" },
  { id: 4, name: "Neha Gupta", role: "Rental & Relocation Specialist", phone: "+91 98765 43213", rating: 5, photo: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 5, name: "Manoj Pandey", role: "Commercial Property Expert", phone: "+91 98765 43214", rating: 5, photo: "https://randomuser.me/api/portraits/men/22.jpg" },
  { id: 6, name: "Sunita Mishra", role: "Plot & Land Specialist", phone: "+91 98765 43215", rating: 4, photo: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 7, name: "Vikas Yadav", role: "New Project Advisor", phone: "+91 98765 43216", rating: 5, photo: "https://randomuser.me/api/portraits/men/41.jpg" },
  { id: 8, name: "Anjali Verma", role: "Customer Relationship Manager", phone: "+91 98765 43217", rating: 5, photo: "https://randomuser.me/api/portraits/women/56.jpg" },
];

export const FALLBACK_BLOG = [
  { id: 1, slug: "gorakhpur-real-estate-trends-2026", date: "Jan 12, 2026", title: "Gorakhpur Mein Real Estate Trends 2026", excerpt: "Purvanchal Expressway aur AIIMS Gorakhpur ke aane ke baad shehar ke kaunse areas mein property demand sabse zyada badh rahi hai.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80" },
  { id: 2, slug: "taramandal-vs-rapti-nagar", date: "Dec 28, 2025", title: "Taramandal vs Rapti Nagar: Kahan Ghar Lena Better Hai?", excerpt: "Dono premium areas hain, lekin family size, budget aur commute ke hisaab se sahi choice kaise karein.", image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=700&q=80" },
  { id: 3, slug: "first-time-buyer-guide-gorakhpur", date: "Dec 10, 2025", title: "Gorakhpur Mein Pehli Baar Ghar Kharidne Walon Ke Liye Guide", excerpt: "Registry, stamp duty, home loan aur bank verification — Gorakhpur mein property kharidne ka pura process.", image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=700&q=80" },
  { id: 4, slug: "civil-lines-vs-golghar-commercial", date: "Nov 22, 2025", title: "Business Ke Liye Civil Lines Ya Golghar — Kaunsa Behtar?", excerpt: "Dukan ya office lene se pehle in dono commercial hubs ka footfall, rent aur growth potential samjhiye.", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=700&q=80" },
  { id: 5, slug: "choosing-right-property-agent-gorakhpur", date: "Nov 5, 2025", title: "Gorakhpur Mein Sahi Property Dealer Kaise Chunein", excerpt: "Verified agent, clear title, aur bina hidden charges ke deal karne ke liye kya-kya check karna chahiye.", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=700&q=80" },
  { id: 6, slug: "investing-in-mohaddipur-plots", date: "Oct 18, 2025", title: "Mohaddipur Mein Plot Mein Invest Karna: Kya Ye Sahi Waqt Hai?", excerpt: "Rapti river ke aas-paas ke plots ki demand aur aane wale salon mein unki value kaisi rahegi.", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=700&q=80" },
];

export const FALLBACK_TESTIMONIALS = [
  { id: 1, name: "Deepak Chaurasia", rating: 5, quote: "Skyline Properties ki team ne Taramandal mein humara flat dikhane se lekar registry tak sab kuch bahut asaani se karwaya. Bahut transparent process tha.", photo: "https://randomuser.me/api/portraits/men/76.jpg" },
  { id: 2, name: "Kavita Rai", rating: 5, quote: "Rapti Nagar mein apna sapno ka ghar mila, wo bhi bina kisi extra dalali fees ke. Highly recommended for Gorakhpur mein property dhundne walon ke liye.", photo: "https://randomuser.me/api/portraits/women/21.jpg" },
  { id: 3, name: "Sandeep Maurya", rating: 5, quote: "Golghar mein office space kiraye par lena tha, ek hi hafte mein sab ho gaya. Bahut professional service.", photo: "https://randomuser.me/api/portraits/women/29.jpg" },
];
