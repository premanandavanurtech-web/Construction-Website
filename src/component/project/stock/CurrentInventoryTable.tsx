// src/components/stock/CurrentInventoryLayout.tsx
"use client";

import { Search } from "lucide-react";

type Props = {
  children: React.ReactNode;
  search: string;
  onSearchChange: (v: string) => void;
  onOpenFilter: () => void;
  onOpenCategory: () => void;
  onOpenLocation?: () => void;
};

export default function CurrentInventoryLayout({
  children,
  search,
  onSearchChange,
  onOpenFilter,
  onOpenCategory,
  onOpenLocation,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border w-full px-6 py-4 space-y-4">
      {/* Search + Filter */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1 border rounded-lg px-3 h-11">
          <Search size={18} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Stocks..."
            className="flex-1 outline-none text-sm text-gray-600"
          />
        </div>
        <button
          onClick={onOpenFilter}
          className="h-11 px-6 rounded-lg border text-sm"
        >
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto text-gray-300 p-3 text-center border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-600">
              <th className="px-6 py-3">Item Name</th>
              <th className="px-6 py-3">
                Category{" "}
                <button onClick={onOpenCategory} className="text-blue-600 font-bold">
                  +
                </button>
              </th>
              <th className="px-6 py-3">Current Stock</th>
              <th className="px-6 py-3">Min. Stock</th>
              <th className="px-6 py-3">
                Location{" "}
                {onOpenLocation && (
                  <button onClick={onOpenLocation} className="text-blue-600 font-bold">
                    +
                  </button>
                )}
              </th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Last Updated</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          {children}
        </table>
      </div>
    </div>
  );
}