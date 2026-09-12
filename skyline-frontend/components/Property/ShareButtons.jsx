"use client";
import { useState } from "react";

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — no-op, button still visually responds via `copied` staying false
    }
  }

  async function handleNativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // user cancelled share sheet — nothing to do
      }
    } else {
      handleCopy();
    }
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="w-9 h-9 rounded-full bg-brand-tint text-brand flex items-center justify-center hover:bg-brand-tint2"
        aria-label="Copy link"
        title={copied ? "Copied!" : "Copy link"}
      >
        {copied ? "✓" : "🔗"}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="w-9 h-9 rounded-full bg-brand-tint text-brand flex items-center justify-center hover:bg-brand-tint2"
        aria-label="Share on WhatsApp"
      >
        💬
      </a>
      <button
        type="button"
        onClick={handleNativeShare}
        className="w-9 h-9 rounded-full bg-brand-tint text-brand flex items-center justify-center hover:bg-brand-tint2"
        aria-label="Share"
      >
        ↗
      </button>
    </div>
  );
}
