"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { label: "Current Inventory", slug: "" }, // default
  { label: "Stock Movements Log", slug: "movement-log" },
  { label: "Stock Transfer", slug: "transfer" },
  { label: "Machinery", slug: "machinery" },
];

export default function StockSubTabs() {
  const pathname = usePathname();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  return (
    <div className="border-b mt-7 border-gray-200">
      <div className="flex justify-around gap-10">
        {tabs.map((tab) => {
          const href = tab.slug
            ? `/projects/${projectId}/stock/${tab.slug}`
            : `/projects/${projectId}/stock`;

          const isActive =
            pathname === href ||
            (pathname === `/projects/${projectId}/stock` && tab.slug === "");

          return (
            <Link
              key={tab.label}
              href={href}
              className={clsx(
                "relative pb-3 text-sm font-medium transition-colors",
                isActive
                  ? "text-black"
                  : "text-gray-500 hover:text-slate-800"
              )}
            >
              {tab.label}

              {isActive && (
                <span className="absolute left-1/2 -translate-x-1/2 -bottom-[1px] h-[3px] w-[160px] bg-[#344960] rounded-full transition-all duration-200" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}