import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";
import PropertySkeleton from "@/components/Common/PropertySkeleton";

export const metadata = {
  title: "Properties | Unique Property",
  description: "Search and filter 500+ verified luxury listings by location, price, type, and more.",
};

export default function PropertiesPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">FIND YOUR PLACE IN THE SKY</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Browse Our Properties</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">500+ verified luxury listings across the world's most desirable skylines.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-[1180px] mx-auto px-6">
          <Suspense fallback={<PropertySkeleton count={6} />}>
            <PropertiesClient />
          </Suspense>
        </div>
      </section>
    </>
  );
}
