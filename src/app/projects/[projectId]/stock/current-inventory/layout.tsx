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
      {/* Search */}
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
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th>Item Name</th>
              <th>
                Category{" "}
                <button onClick={onOpenCategory} className="text-blue-600">+</button>
              </th>
              <th>Current Stock</th>
              <th>Min. Stock</th>
              <th>
                Location{" "}
                {onOpenLocation && (
                  <button onClick={onOpenLocation} className="text-blue-600">+</button>
                )}
              </th>
              <th>Status</th>
              <th>Last Updated</th>
              <th>Actions</th>
            </tr>
          </thead>

          {children}
        </table>
      </div>
    </div>
  );
}
