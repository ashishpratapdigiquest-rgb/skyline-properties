"use client";
import Image from "next/image";

/**
 * Renders next/image for normal URLs (optimized), but falls back to a plain
 * <img> for base64 data URIs (uploaded files) since Next's image optimizer
 * can't process those. Supports the same `fill` + className/sizes API.
 */
export default function SmartImage({ src, alt, fill, className, sizes, priority, style }) {
  const isDataUri = typeof src === "string" && src.startsWith("data:image/");

  if (isDataUri) {
    return (
      <img
        src={src}
        alt={alt || ""}
        className={className}
        style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style}
      />
    );
  }

  return <Image src={src} alt={alt || ""} fill={fill} className={className} sizes={sizes} priority={priority} style={style} />;
}
