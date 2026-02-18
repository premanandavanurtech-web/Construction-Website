"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import clsx from "clsx";

const tabs = [
  { label: "Photo/Video Library", slug: "PhotoVideoLibrary" },
  { label: "Room Evaluations", slug: "RoomEvaluations" },
  { label: "Location Evaluation", slug: "LocationEvaluation" },
  { label: "Soil Nature", slug: "SoilNature" },
  { label: "Foundation Details", slug: "Foundation" },
  { label: "Vegetation", slug: "vegetation" },
  { label: "Pre-Existing Structure", slug: "Pre-existing" },
];

export default function ReeceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { projectId } = useParams<{ projectId: string }>();
  const pathname = usePathname();

  if (!projectId) return null;

  return (
    <div>
      {/* Header */}
      <h1 className="text-[20px] font-medium text-gray-900">
        Reece
      </h1>

      <p className="text-[13px] text-gray-700 mt-1">
        Quality sitework and project management
      </p>

      {/* Tabs */}
      <div className="flex gap-14 mt-6  ">
        {tabs.map((tab) => {
          const href = `/projects/${projectId}/reece/${tab.slug}`;
          const isActive = pathname === href;

          return (
            <Link
              key={tab.slug}
              href={href}
              className={clsx(
                "pb-2 text-[15px] whitespace-nowrap transition-colors",
                isActive
                  ? "text-gray-900 border-b-2 border-gray-900 font-medium"
                  : "text-gray-900 hover:text-gray-700"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {/* Page content */}
      <div className="pt-6">
        {children}
      </div>
    </div>
  );
}
