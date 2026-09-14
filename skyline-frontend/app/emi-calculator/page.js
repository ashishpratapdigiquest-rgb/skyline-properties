import EMICalculator from "@/components/EMICalculator";
import Link from "next/link";

export const metadata = {
  title: "Home Loan EMI Calculator | Skyline Properties Gorakhpur",
  description: "Free home loan EMI calculator — Gorakhpur mein property lene se pehle apni monthly EMI, total interest aur total payment turant calculate karein.",
};

export default function EMICalculatorPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">FREE TOOL</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Home Loan EMI Calculator</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">
            Gorakhpur mein ghar, plot ya office kharidne se pehle apni monthly EMI turant pata karein.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-[600px] mx-auto px-6">
          <EMICalculator />

          <div className="text-center mt-8">
            <p className="text-slate-500 text-sm mb-4">Property dekhna chahte hain jo aapke budget mein fit ho?</p>
            <Link href="/properties" className="btn btn-primary">Properties Browse Karein →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
