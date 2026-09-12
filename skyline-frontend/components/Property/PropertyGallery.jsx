"use client";
import { useEffect, useCallback, useState } from "react";
import Image from "next/image";

export default function PropertyGallery({ images = [], title = "Property" }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const count = images.length;
  const next = useCallback(() => setActive((i) => (i + 1) % count), [count]);
  const prev = useCallback(() => setActive((i) => (i - 1 + count) % count), [count]);

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, next, prev]);

  if (count === 0) return null;

  return (
    <div>
      {/* Main image */}
      <div className="relative h-[320px] sm:h-[420px] lg:h-[480px] rounded-2xl overflow-hidden bg-slate-100">
        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 w-full h-full focus:outline-none focus:ring-2 focus:ring-brand"
          aria-label={`Open fullscreen gallery, image ${active + 1} of ${count}`}
        >
          <Image src={images[active]} alt={`${title} — photo ${active + 1}`} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 900px" />
        </button>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-navy shadow hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-navy shadow hover:bg-white"
            >
              ›
            </button>
            <span className="absolute bottom-3 right-3 bg-navy/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {active + 1} / {count}
            </span>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show image ${i + 1}`}
              aria-current={i === active}
              className={`relative w-20 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 ${i === active ? "border-brand" : "border-transparent"}`}
            >
              <Image src={img} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Image gallery fullscreen"
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label="Close fullscreen gallery"
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 text-white text-xl flex items-center justify-center hover:bg-white/20"
          >
            ✕
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous image"
            className="absolute left-4 sm:left-8 w-11 h-11 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center hover:bg-white/20"
          >
            ‹
          </button>
          <div className="relative w-[90vw] h-[80vh] max-w-5xl">
            <Image src={images[active]} alt={`${title} — photo ${active + 1}`} fill className="object-contain" sizes="90vw" />
          </div>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-4 sm:right-8 w-11 h-11 rounded-full bg-white/10 text-white text-2xl flex items-center justify-center hover:bg-white/20"
          >
            ›
          </button>
          <span className="absolute bottom-6 text-white/80 text-sm">{active + 1} / {count}</span>
        </div>
      )}
    </div>
  );
}
