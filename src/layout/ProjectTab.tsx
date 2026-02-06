"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { label: "Reece", slug: "reece" },
  { label: "Design", slug: "design" },
  { label: "BOQ", slug: "boq" },
  { label: "Order", slug: "order" },
  { label: "Work Progress", slug: "work-progress" },
  { label: "Snag", slug: "snag" },
  { label: "Finance", slug: "finance" },
  { label: "Stock", slug: "stock" },
];

export default function ProjectTabs() {
  const pathname = usePathname();

  return (
    <div className="bg-white border rounded-xl p-1 flex gap-1 w-full">
      {tabs.map((tab) => {
        const href = `/projects/${tab.slug}`;

        // ✅ FIX: startsWith instead of ===
        const isActive = pathname.startsWith(href);

        return (
          <Link
            key={tab.slug}
            href={href}
            className={clsx(
              "flex-1 text-center px-4 py-2 rounded-lg text-sm font-medium transition",
              isActive
                ? "bg-[#344960] text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}