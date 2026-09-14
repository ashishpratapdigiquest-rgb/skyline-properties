import PropertyAlertForm from "@/components/PropertyAlertForm";
import { getAreas, getPropertyTypes } from "@/lib/propertyApi";

export const metadata = {
  title: "Property Alerts | Skyline Properties Gorakhpur",
  description: "Apna budget aur area batayein, matching property listing aane par sabse pehle aapko contact karenge.",
};

export default async function PropertyAlertsPage() {
  const [areas, propertyTypes] = await Promise.all([getAreas(), getPropertyTypes()]);

  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">NEVER MISS A LISTING</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Property Alert Set Karein</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">
            Apna budget, area aur property type batayein — matching listing aate hi hamari team aapko call karegi.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-[600px] mx-auto px-6">
          <PropertyAlertForm areas={areas} propertyTypes={propertyTypes} />
        </div>
      </section>
    </>
  );
}
