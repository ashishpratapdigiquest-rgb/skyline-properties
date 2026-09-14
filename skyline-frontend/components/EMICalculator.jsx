"use client";
import { useState, useMemo } from "react";

function formatINR(num) {
  return "₹" + Math.round(num).toLocaleString("en-IN");
}

export default function EMICalculator({ defaultAmount = 5000000 }) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(8.5);
  const [years, setYears] = useState(20);

  const { emi, totalPayment, totalInterest } = useMemo(() => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    if (!amount || !monthlyRate || !months) return { emi: 0, totalPayment: 0, totalInterest: 0 };
    const emiVal =
      (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const total = emiVal * months;
    return { emi: emiVal, totalPayment: total, totalInterest: total - amount };
  }, [amount, rate, years]);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-card">
      <h3 className="font-display text-lg font-semibold text-navy mb-1">Home Loan EMI Calculator</h3>
      <p className="text-slate-500 text-[13.5px] mb-6">Andaza lagayein ki aapki monthly EMI kitni banegi.</p>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-semibold text-navy">Loan Amount</label>
            <span className="text-brand font-semibold">{formatINR(amount)}</span>
          </div>
          <input
            type="range"
            min="500000"
            max="50000000"
            step="100000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-semibold text-navy">Interest Rate (per year)</label>
            <span className="text-brand font-semibold">{rate}%</span>
          </div>
          <input
            type="range"
            min="6"
            max="15"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <label className="font-semibold text-navy">Loan Tenure</label>
            <span className="text-brand font-semibold">{years} years</span>
          </div>
          <input
            type="range"
            min="1"
            max="30"
            step="1"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full accent-brand"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mt-7 pt-6 border-t border-slate-200 text-center">
        <div>
          <span className="block text-[11.5px] text-slate-500">Monthly EMI</span>
          <b className="block text-navy font-display text-lg mt-1">{formatINR(emi)}</b>
        </div>
        <div>
          <span className="block text-[11.5px] text-slate-500">Total Interest</span>
          <b className="block text-navy font-display text-lg mt-1">{formatINR(totalInterest)}</b>
        </div>
        <div>
          <span className="block text-[11.5px] text-slate-500">Total Payment</span>
          <b className="block text-navy font-display text-lg mt-1">{formatINR(totalPayment)}</b>
        </div>
      </div>

      <p className="text-[11.5px] text-slate-400 mt-4">
        * Ye sirf estimate hai — actual EMI bank ke terms aur processing fees ke hisaab se alag ho sakti hai.
      </p>
    </div>
  );
}
