"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStoredAdminKey, adminGetComments, adminApproveComment, adminDeleteComment } from "@/lib/adminApi";

export default function AdminCommentsPage() {
  const router = useRouter();
  const [key, setKey] = useState(null);
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);

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
    loadComments();
  }, [key, filter]);

  async function loadComments() {
    setLoading(true);
    try {
      setComments(await adminGetComments(key, filter));
    } catch {
      setComments([]);
    }
    setLoading(false);
  }

  async function handleApprove(id) {
    await adminApproveComment(key, id);
    await loadComments();
  }

  async function handleDelete(id) {
    if (!confirm("Ye comment permanently delete ho jaayega. Confirm karein?")) return;
    await adminDeleteComment(key, id);
    await loadComments();
  }

  if (!key) return null;

  return (
    <div className="max-w-[900px] mx-auto px-6 py-10">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-navy">Moderate Comments</h1>
        <p className="text-slate-500 text-sm mt-1">Comments sirf approve karne ke baad hi blog par public dikhte hain.</p>
      </div>

      <div className="flex gap-2 mb-6">
        {["pending", "approved", ""].map((f) => (
          <button
            key={f || "all"}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border ${filter === f ? "bg-brand text-white border-brand" : "bg-white text-slate-600 border-slate-200"}`}
          >
            {f === "" ? "All" : f === "pending" ? "Pending" : "Approved"}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : comments.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl">
          <p className="text-slate-500">Koi comment nahi mila.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <span className="font-semibold text-navy text-sm">{c.name}</span>
                  <span className="text-slate-400 text-xs ml-2">{c.email}</span>
                </div>
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${c.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                  {c.approved ? "APPROVED" : "PENDING"}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-2">{c.comment}</p>
              <p className="text-slate-400 text-xs mb-3">
                Post: <Link href={`/blog/${c.blog_slug}`} target="_blank" className="text-brand hover:underline">{c.blog_slug}</Link>
                {" • "}{new Date(c.created_at).toLocaleString("en-IN")}
              </p>
              <div className="flex gap-3">
                {!c.approved && (
                  <button onClick={() => handleApprove(c.id)} className="btn btn-primary !py-2 !px-4 text-sm">Approve</button>
                )}
                <button onClick={() => handleDelete(c.id)} className="btn btn-outline !py-2 !px-4 text-sm text-red-500 border-red-200 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
