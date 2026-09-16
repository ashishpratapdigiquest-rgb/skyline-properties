"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/Auth/AuthProvider";
import { getToken, getFavorites as fetchFavorites } from "@/lib/authApi";
import PropertyCard from "@/components/Property/PropertyCard";
import PropertySkeleton from "@/components/Common/PropertySkeleton";

export default function FavoritesPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?next=/favorites");
      return;
    }
    const token = getToken();
    fetchFavorites(token).then((data) => {
      setProperties(data);
      setLoading(false);
    });
  }, [user, authLoading, router]);

  if (authLoading || !user) return null;

  return (
    <section className="py-14">
      <div className="max-w-[1180px] mx-auto px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-[30px] font-bold text-navy">Meri Saved Properties</h1>
            <p className="text-slate-500 text-sm mt-1">Namaste {user.name} — yahan aapki saved properties hain.</p>
          </div>
          <button onClick={logout} className="btn btn-outline">Log Out</button>
        </div>

        {loading ? (
          <PropertySkeleton count={3} />
        ) : properties.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
            <p className="text-navy font-display text-lg font-semibold mb-2">Koi property save nahi ki</p>
            <p className="text-slate-500 text-sm mb-5">Properties browse karte waqt heart ♡ icon par click karo unhe save karne ke liye.</p>
            <Link href="/properties" className="btn btn-primary">Properties Dekhein →</Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
