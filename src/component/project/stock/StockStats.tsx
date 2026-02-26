"use client";

import { useEffect, useState } from "react";

type StockItem = {
  name: string;
  current: number;
  min: number;
  unit: string;
  category: string;
  location: string;
  vendor: string;
  status: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
};

type Props = {
  projectId: string;
};

export default function StockStats({ projectId }: Props) {
  const [stocks, setStocks] = useState<StockItem[]>([]);

  const loadStocks = () => {
    if (!projectId) return;
    const now = Date.now();
    const valid: StockItem[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`stock-${projectId}-`)) {
        try {
          const parsed: StockItem = JSON.parse(
            localStorage.getItem(key) || "{}"
          );
          // only include non-expired items
          if (!parsed.expiresAt || parsed.expiresAt > now) {
            valid.push(parsed);
          }
        } catch {
          // skip invalid
        }
      }
    });

    setStocks(valid);
  };

  // Load on mount and when projectId changes
  useEffect(() => {
    loadStocks();
  }, [projectId]);

  // ✅ Listen for stock changes (add, edit, delete)
  useEffect(() => {
    window.addEventListener("stock-updated", loadStocks);
    return () => window.removeEventListener("stock-updated", loadStocks);
  }, [projectId]);

  // ✅ Real calculations using your actual data shape
  const totalItems = stocks.length;

  const lowStockCount = stocks.filter(
    (item) => item.current <= item.min
  ).length;

  const inStockCount = stocks.filter(
    (item) => item.current > item.min
  ).length;

  return (
    <div className="grid mt-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {/* Total Items */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm text-gray-500">Total Items</p>
        <h2 className="text-2xl font-bold mt-2 text-[#38485e]">
          {String(totalItems).padStart(2, "0")}
        </h2>
        <p className="text-xs text-gray-400 mt-1">Items tracked</p>
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm text-gray-500">Low Stock Alert</p>
        <h2
          className={`text-2xl font-bold mt-2 ${
            lowStockCount > 0 ? "text-red-500" : "text-[#38485e]"
          }`}
        >
          {String(lowStockCount).padStart(2, "0")}
        </h2>
        <p className="text-xs text-gray-400 mt-1">Below minimum level</p>
      </div>

      {/* Out of Stock */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm text-gray-500">Out of Stock</p>
        <h2
          className={`text-2xl font-bold mt-2 ${
            stocks.filter((i) => i.current === 0).length > 0
              ? "text-orange-500"
              : "text-[#38485e]"
          }`}
        >
          {String(stocks.filter((i) => i.current === 0).length).padStart(
            2,
            "0"
          )}
        </h2>
        <p className="text-xs text-gray-400 mt-1">Zero quantity items</p>
      </div>

      {/* In Stock */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <p className="text-sm text-gray-500">In Stock</p>
        <h2 className="text-2xl font-bold mt-2 text-green-600">
          {String(inStockCount).padStart(2, "0")}
        </h2>
        <p className="text-xs text-gray-400 mt-1">Above minimum level</p>
      </div>
    </div>
  );
}