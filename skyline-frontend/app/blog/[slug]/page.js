import { notFound } from "next/navigation";
import Image from "next/image";
import Breadcrumbs from "@/components/Property/Breadcrumbs";
import CommentForm from "@/components/Blog/CommentForm";
import { getBlogPostBySlug, getApprovedComments } from "@/lib/blogApi";

export async function generateMetadata({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) return { title: "Post Not Found | Skyline Properties" };
  return {
    title: `${post.title} | Skyline Properties Blog`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function BlogPostPage({ params }) {
  const post = await getBlogPostBySlug(params.slug);
  if (!post) notFound();

  const comments = await getApprovedComments(params.slug);

  return (
    <>
      <section className="py-8">
        <div className="max-w-[760px] mx-auto px-6">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]} />
        </div>
      </section>

      <article className="pb-14">
        <div className="max-w-[760px] mx-auto px-6">
          <div className="text-brand text-xs font-bold tracking-wide mb-3 uppercase">{post.date} • {post.author || "Skyline Properties Team"}</div>
          <h1 className="font-display text-[30px] sm:text-[34px] font-bold text-navy leading-tight mb-6">{post.title}</h1>

          <div className="relative h-[260px] sm:h-[380px] rounded-2xl overflow-hidden mb-8">
            <Image src={post.image} alt={post.title} fill className="object-cover" priority />
          </div>

          <div className="prose-content text-slate-700 text-[15.5px] leading-[1.8] space-y-5">
            {post.content.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
          </div>
        </div>
      </article>

      <section className="pb-16 bg-slate-50 pt-12">
        <div className="max-w-[760px] mx-auto px-6">
          <h2 className="font-display text-xl font-semibold text-navy mb-6">
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>

          {comments.length > 0 && (
            <div className="space-y-4 mb-8">
              {comments.map((c) => (
                <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-semibold text-navy text-sm">{c.name}</span>
                    <span className="text-slate-400 text-xs">{new Date(c.created_at).toLocaleDateString("en-IN")}</span>
                  </div>
                  <p className="text-slate-600 text-sm">{c.comment}</p>
                </div>
              ))}
            </div>
          )}

          <CommentForm slug={params.slug} />
        </div>
      </section>
    </>
  );
}
