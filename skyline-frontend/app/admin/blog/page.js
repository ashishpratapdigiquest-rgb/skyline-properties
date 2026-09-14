"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getBlogPosts } from "@/lib/blogApi";
import { getStoredAdminKey, clearAdminKey, adminCreateBlogPost, adminUpdateBlogPost, adminDeleteBlogPost } from "@/lib/adminApi";

const EMPTY_FORM = { title: "", excerpt: "", content: "", image: "", author: "Skyline Properties Team" };

export default function AdminBlogPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = getStoredAdminKey();
    if (!stored) {
      router.push("/admin");
      return;
    }
    setKey(stored);
  }, [router]);

  useEffect(() => {
    if (!key) return;
    loadPosts();
  }, [key]);

  async function loadPosts() {
    setLoading(true);
    setPosts(await getBlogPosts());
    setLoading(false);
  }

  function openAddForm() {
    setForm(EMPTY_FORM);
    setEditingSlug(null);
    setError("");
    setFormOpen(true);
  }

  function openEditForm(post) {
    setForm({ title: post.title, excerpt: post.excerpt, content: post.content, image: post.image, author: post.author || "Skyline Properties Team" });
    setEditingSlug(post.slug);
    setError("");
    setFormOpen(true);
  }

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (editingSlug) {
        await adminUpdateBlogPost(key, editingSlug, form);
      } else {
        await adminCreateBlogPost(key, form);
      }
      setFormOpen(false);
      await loadPosts();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(post) {
    if (!confirm(`Delete "${post.title}"? Iske saath saare comments bhi delete ho jaayenge.`)) return;
    try {
      await adminDeleteBlogPost(key, post.slug);
      await loadPosts();
    } catch (err) {
      alert(err.message);
    }
  }

  if (!key) return null;

  return (
    <div className="max-w-[1180px] mx-auto px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-navy">Manage Blog Posts</h1>
          <p className="text-slate-500 text-sm mt-1">Add, edit, or remove blog articles.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={openAddForm} className="btn btn-primary">+ Add New Post</button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500">Loading posts...</p>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-navy">{p.title}</td>
                  <td className="px-5 py-3 text-slate-600">{p.date}</td>
                  <td className="px-5 py-3 text-right space-x-3">
                    <Link href={`/blog/${p.slug}`} target="_blank" className="text-slate-500 font-semibold hover:underline">View</Link>
                    <button onClick={() => openEditForm(p)} className="text-brand font-semibold hover:underline">Edit</button>
                    <button onClick={() => handleDelete(p)} className="text-red-500 font-semibold hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr><td colSpan={3} className="px-5 py-8 text-center text-slate-400">No posts yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-7 w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-navy">{editingSlug ? "Edit Post" : "Add New Post"}</h2>
              <button type="button" onClick={() => setFormOpen(false)} className="text-slate-400 text-2xl leading-none">✕</button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Title</label>
                <input required value={form.title} onChange={(e) => updateField("title", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Excerpt (short summary, shown on blog list)</label>
                <textarea required rows={2} value={form.excerpt} onChange={(e) => updateField("excerpt", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Full Content (separate paragraphs with a blank line)</label>
                <textarea required rows={10} value={form.content} onChange={(e) => updateField("content", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Cover Image URL</label>
                <input value={form.image} onChange={(e) => updateField("image", e.target.value)} placeholder="https://..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-navy mb-1.5">Author</label>
                <input value={form.author} onChange={(e) => updateField("author", e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

            <div className="flex gap-3 mt-6">
              <button type="submit" disabled={saving} className="btn btn-primary flex-1 justify-center disabled:opacity-60">
                {saving ? "Saving..." : editingSlug ? "Save Changes" : "Publish Post"}
              </button>
              <button type="button" onClick={() => setFormOpen(false)} className="btn btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
