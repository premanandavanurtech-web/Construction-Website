"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Data Base", path: "database" },
  { label: "Onboarding", path: "onboarding" },
  { label: "Contract", path: "contract" },
  { label: "Orders", path: "orders" },
  { label: "Performance", path: "performance" },
  { label: "Reports", path: "reports" },
];

export default function VendorManagementTabs() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-white rounded-xl  border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-gray-900">
          Vendor Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage vendors, contracts, and performance tracking
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-around border-2  text-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => {
          const isActive = pathname.includes(`/vendors/${tab.path}`);

          return (
            <Link
              key={tab.path}
              href={`/vendors/${tab.path}`}
              className={`px-5 py-2 text-sm rounded-md transition-all
                ${
                  isActive
                    ? "bg-slate-700 text-white shadow"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                }
              `}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}