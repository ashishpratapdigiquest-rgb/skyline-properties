const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const DEFAULT_SETTINGS = {
  site_name: "Skyline Properties",
  logo_image: null,
  phone_number: "+91 98765 43210",
  whatsapp_number: "919876543210",
  email: "hello@skylineproperties.co.in",
  address: "Bank Road, Golghar, Gorakhpur, Uttar Pradesh 273001",
};

export async function getSettings() {
  try {
    const res = await fetch(`${API_URL}/api/settings`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Request failed");
    return await res.json();
  } catch {
    return DEFAULT_SETTINGS;
  }
}
