const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function safeFetch(path, fallback) {
  try {
    const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } });
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

export const FALLBACK_TESTIMONIALS = [
  { id: 1, name: "Deepak Chaurasia", rating: 5, quote: "Skyline Properties ki team ne Taramandal mein humara flat dikhane se lekar registry tak sab kuch bahut asaani se karwaya. Bahut transparent process tha.", photo: "https://randomuser.me/api/portraits/men/76.jpg" },
  { id: 2, name: "Kavita Rai", rating: 5, quote: "Rapti Nagar mein apna sapno ka ghar mila, wo bhi bina kisi extra dalali fees ke. Highly recommended for Gorakhpur mein property dhundne walon ke liye.", photo: "https://randomuser.me/api/portraits/women/21.jpg" },
  { id: 3, name: "Sandeep Maurya", rating: 5, quote: "Golghar mein office space kiraye par lena tha, ek hi hafte mein sab ho gaya. Bahut professional service.", photo: "https://randomuser.me/api/portraits/women/29.jpg" },
];
