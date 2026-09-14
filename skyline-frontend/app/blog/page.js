import Image from "next/image";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blogApi";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata = { title: "Blog | Skyline Properties Gorakhpur", description: "Gorakhpur real estate market ki latest updates, guides aur tips." };

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <section className="bg-gradient-to-b from-white to-brand-tint py-16 text-center">
        <div className="max-w-[1180px] mx-auto px-6">
          <p className="text-brand font-bold text-[13px] tracking-[.08em]">SKYLINE INSIGHTS</p>
          <h1 className="font-display text-[38px] font-bold text-navy mt-1.5">News, Guides &amp; Market Trends</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-3.5">Everything you need to know about buying, selling, and living above the skyline.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[1180px] mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block bg-white border border-slate-200 rounded-[10px] overflow-hidden shadow-card hover:shadow-elevated transition-shadow">
              <div className="relative h-[180px]">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-5">
                <div className="text-brand text-xs font-bold tracking-wide mb-2 uppercase">{post.date}</div>
                <h3 className="font-display text-[16.5px] font-semibold text-navy mb-2">{post.title}</h3>
                <p className="text-slate-500 text-[13.5px] leading-relaxed">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-brand font-semibold text-[13.5px] mt-3.5">Read More →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-11 bg-gradient-to-br from-navy to-[#163663] text-white">
        <div className="max-w-[1180px] mx-auto px-6 flex flex-wrap items-center justify-between gap-7">
          <div>
            <h3 className="text-2xl font-display font-semibold text-white">Never Miss a Market Update</h3>
            <p className="mt-1.5 text-[14.5px] text-[#c7d4e8]">Get our latest guides and listings straight to your inbox.</p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
