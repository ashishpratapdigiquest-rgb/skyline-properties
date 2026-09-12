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

export async function getProperties() {
  return safeFetch("/api/properties", FALLBACK_PROPERTIES);
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
export const FALLBACK_PROPERTIES = [
  { id: 1, title: "Unique Penthouse", location: "Downtown, New York", price: 2800000, priceDisplay: "$2.8M", beds: 4, baths: 4, sqft: 3200, floor: "28th Floor", tag: "FEATURED", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Rooftop Haven", location: "Waterfront, Miami", price: 3600000, priceDisplay: "$3.6M", beds: 4, baths: 5, sqft: 4100, floor: "Penthouse", tag: "NEW", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Executive Residence", location: "Business District, Chicago", price: 4500000, priceDisplay: "$4.5M", beds: 5, baths: 6, sqft: 5500, floor: "45th Floor", tag: "LUXURY", image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Sky Garden Suite", location: "Sky Gardens, Singapore", price: 1900000, priceDisplay: "$1.9M", beds: 3, baths: 3, sqft: 2400, floor: "18th Floor", tag: null, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" },
  { id: 5, title: "Harbor Vista Loft", location: "Harbor View, Boston", price: 2100000, priceDisplay: "$2.1M", beds: 2, baths: 2, sqft: 1850, floor: "12th Floor", tag: "NEW", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" },
  { id: 6, title: "Azure Tower Residence", location: "Waterfront, Dubai", price: 5200000, priceDisplay: "$5.2M", beds: 6, baths: 7, sqft: 6800, floor: "60th Floor", tag: "LUXURY", image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80" },
];

export const FALLBACK_AGENTS = [
  { id: 1, name: "James Anderson", role: "Luxury Property Specialist", phone: "+1 (555) 123 4567", rating: 5, photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, name: "Sophia Martinez", role: "Residential Expert", phone: "+1 (555) 234 5678", rating: 5, photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { id: 3, name: "Michael Roberts", role: "Investment Consultant", phone: "+1 (555) 345 6789", rating: 4, photo: "https://randomuser.me/api/portraits/men/54.jpg" },
  { id: 4, name: "Olivia Bennett", role: "Relocation Specialist", phone: "+1 (555) 456 7890", rating: 5, photo: "https://randomuser.me/api/portraits/women/68.jpg" },
  { id: 5, name: "Daniel Kim", role: "Commercial & High-Rise", phone: "+1 (555) 567 8901", rating: 5, photo: "https://randomuser.me/api/portraits/men/22.jpg" },
  { id: 6, name: "Isabella Cruz", role: "Waterfront Specialist", phone: "+1 (555) 678 9012", rating: 4, photo: "https://randomuser.me/api/portraits/women/12.jpg" },
  { id: 7, name: "Ethan Brooks", role: "New Development Advisor", phone: "+1 (555) 789 0123", rating: 5, photo: "https://randomuser.me/api/portraits/men/41.jpg" },
  { id: 8, name: "Grace Lin", role: "International Buyers", phone: "+1 (555) 890 1234", rating: 5, photo: "https://randomuser.me/api/portraits/women/56.jpg" },
];

export const FALLBACK_BLOG = [
  { id: 1, slug: "luxury-market-trends-2026", date: "Jan 12, 2026", title: "5 Trends Shaping the Luxury Market in 2026", excerpt: "From smart-home integration to wellness amenities, here's what buyers are prioritizing this year.", image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=700&q=80" },
  { id: 2, slug: "penthouse-value-upgrades", date: "Dec 28, 2025", title: "What Actually Adds Value to a Penthouse", excerpt: "Not every upgrade pays off. Here's where high-rise buyers should focus their renovation budget.", image: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=700&q=80" },
  { id: 3, slug: "first-time-buyer-financing-guide", date: "Dec 10, 2025", title: "A First-Time Buyer's Guide to Financing a High-Rise Home", excerpt: "Jumbo loans, co-op boards, and everything else first-timers get wrong about buying up high.", image: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&w=700&q=80" },
  { id: 4, slug: "waterfront-vs-downtown", date: "Nov 22, 2025", title: "Waterfront vs. Downtown: Which Fits Your Lifestyle?", excerpt: "We break down the trade-offs between two of our most popular neighborhoods.", image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=700&q=80" },
  { id: 5, slug: "choosing-the-right-agent", date: "Nov 5, 2025", title: "How to Choose the Right Agent for a Luxury Sale", excerpt: "Questions to ask before you list — and the red flags that should make you walk away.", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&w=700&q=80" },
  { id: 6, slug: "investing-in-sky-gardens", date: "Oct 18, 2025", title: "Investing in Sky Gardens: Is It Worth the Premium?", excerpt: "A look at rental yields and resale value for properties with dedicated green space.", image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=700&q=80" },
];

export const FALLBACK_TESTIMONIALS = [
  { id: 1, name: "David Thompson", rating: 5, quote: "The best real estate experience I've ever had. Professional, transparent, and truly caring.", photo: "https://randomuser.me/api/portraits/women/21.jpg" },
  { id: 2, name: "Emily Carter", rating: 5, quote: "They helped us find our dream home with the perfect view. Highly recommended!", photo: "https://randomuser.me/api/portraits/women/29.jpg" },
  { id: 3, name: "Robert Williams", rating: 5, quote: "Exceptional service and incredible attention to detail. Highly satisfied.", photo: "https://randomuser.me/api/portraits/men/76.jpg" },
];
