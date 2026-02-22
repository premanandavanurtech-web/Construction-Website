"use client";

import { StockFilters } from "./StockFilterModal";

type Props = {
  filters: StockFilters;
  onChange: (filters: StockFilters) => void;
  categories: string[];
  locations: string[];
};

export default function InlineStockFilters({
  filters,
  onChange,
  categories,
  locations,
}: Props) {
  const set = (key: keyof StockFilters) => (value: string) =>
    onChange({ ...filters, [key]: value });

  return (
    <div className="border rounded-lg p-4 bg-gray-50 grid grid-cols-5 gap-4">
      {/* Category */}
      <select
        className="h-10 border rounded px-3 text-sm text-black"
        value={filters.category}
        onChange={(e) => set("category")(e.target.value)}
      >
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* Location */}
      <select
        className="h-10 border rounded px-3 text-sm text-black"
        value={filters.location}
        onChange={(e) => set("location")(e.target.value)}
      >
        <option value="">All Locations</option>
        {locations.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      {/* Min Stock */}
      <input
        type="number"
        placeholder="Min Stock ≤"
        className="h-10 border rounded px-3 text-sm text-black"
        value={filters.minStock}
        onChange={(e) => set("minStock")(e.target.value)}
      />

      {/* Current Stock */}
      <input
        type="number"
        placeholder="Current Stock ≤"
        className="h-10 border rounded px-3 text-sm text-black"
        value={filters.currentStock}
        onChange={(e) => set("currentStock")(e.target.value)}
      />

      {/* Created On */}
      <input
        type="date"
        className="h-10 border rounded px-3 text-sm text-black"
        value={filters.createdOn}
        onChange={(e) => set("createdOn")(e.target.value)}
      />
    </div>
  );
}