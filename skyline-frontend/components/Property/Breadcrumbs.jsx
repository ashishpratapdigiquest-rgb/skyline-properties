import Link from "next/link";

export default function Breadcrumbs({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13.5px] text-slate-500 flex flex-wrap items-center gap-1.5">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden="true">/</span>}
            {isLast || !item.href ? (
              <span className="text-navy font-medium" aria-current={isLast ? "page" : undefined}>
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="hover:text-brand">
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
