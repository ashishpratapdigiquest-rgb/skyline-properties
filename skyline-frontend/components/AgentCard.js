import Image from "next/image";
import Link from "next/link";

export default function AgentCard({ agent }) {
  return (
    <div className="bg-white border border-slate-200 rounded-[10px] p-5.5 text-center shadow-card">
      <div className="w-[76px] h-[76px] rounded-full overflow-hidden mx-auto mb-3.5 relative">
        <Image src={agent.photo} alt={agent.name} fill className="object-cover" />
      </div>
      <h4 className="text-[15.5px] font-display font-semibold text-navy">{agent.name}</h4>
      <p className="text-brand text-xs font-semibold my-1">{agent.role}</p>
      <p className="text-slate-500 text-[13px] mb-2">{agent.phone}</p>
      <div className="text-gold text-[13px] mb-3.5">{"★".repeat(agent.rating)}{"☆".repeat(5 - agent.rating)}</div>
      <Link href="/contact" className="btn btn-primary w-full justify-center !py-2.5 text-sm">
        Contact
      </Link>
    </div>
  );
}
