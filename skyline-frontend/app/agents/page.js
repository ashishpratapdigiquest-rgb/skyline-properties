import Link from "next/link";
import AgentCard from "@/components/AgentCard";
import { getAgents } from "@/lib/api";

export const metadata = { title: "Our Agents | Skyline Properties Gorakhpur", description: "Gorakhpur ke verified property agents se milein — Taramandal, Golghar, Civil Lines aur poore shehar mein." };

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">MEET THE TEAM</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">Our Elite Agents</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">Licensed specialists across every skyline we serve — ready to guide your next move.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-5.5">
          {agents.map((a) => <AgentCard key={a.id} agent={a} />)}
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-6 pb-6">
        <div className="rounded-2xl p-9 lg:p-11 flex flex-col lg:flex-row items-center justify-between gap-6 text-white bg-brand">
          <h3 className="text-2xl font-display font-semibold max-w-md text-center lg:text-left">Want to join our team of elite agents?</h3>
          <Link href="/contact" className="btn bg-white text-brand border border-white hover:bg-brand-tint">Apply Now →</Link>
        </div>
      </div>
    </>
  );
}
