"use client";

import { useEffect, useState } from "react";

type StockLog = {
  item: string;
  quantity: string;
  from: string;
  to: string;
  issuedBy: string;
  date: string;
  invoice: string;
};

export default function IssueStockModal({ open, onClose, onSubmit }: Props) {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [issueTo, setIssueTo] = useState("");
  const [stockItems, setStockItems] = useState<string[]>([]);

  useEffect(() => {
    const logs: StockLog[] = JSON.parse(
      localStorage.getItem("stockLogs") || "[]",
    );

    // extract unique item names
    const uniqueItems = Array.from(new Set(logs.map((log) => log.item)));

    setStockItems(uniqueItems);
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("issuedStocks") || "[]");

    const valid = stored.filter(
      (s: any) => Date.now() - s.createdAt < ONE_WEEK,
    );

    localStorage.setItem("issuedStocks", JSON.stringify(valid));
  }, []);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[520px] bg-white rounded-2xl shadow-xl p-6">
        {/* Title */}
        <h2
          className="text-xl text-slate-800
         font-semibold mb-6"
        >
          Issue Stock
        </h2>

        {/* Form */}
        <div className="space-y-4 text-black">
          {/* Select Item */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Select Item
            </label>
            <select
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="w-full h-10 rounded-md bg-gray-100 px-3 outline-none"
            >
              <option value="">Select an item</option>

              {stockItems.map((stockItem, i) => (
                <option key={i} value={stockItem}>
                  {stockItem}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">Quantity</label>
            <input
              value={quantity}
              onChange={(e) => setItem(e.target.value)}
              className="w-full h-10 rounded-md bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">Unit</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full h-10 rounded-md bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Issue To */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Issue To (Site/Phase)
            </label>
            <input
              value={issueTo}
              onChange={(e) => setIssueTo(e.target.value)}
              className="w-full h-10 rounded-md bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Delivery Chalan/Invoice
            </label>

            <div className="border border-dashed border-gray-300 rounded-lg h-28 flex flex-col items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
              <svg
                className="w-5 h-5 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1"
                />
              </svg>
              <p>Upload A File or Drag And Drop</p>
              <p className="text-xs">PNG, JPG, PDF up to 50MB</p>
              <input type="file" className="hidden" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              const newIssue = {
                item,
                quantity,
                unit,
                issueTo,
                createdAt: Date.now(),
              };

              const stored = JSON.parse(
                localStorage.getItem("issuedStocks") || "[]",
              );

              // 🔥 remove expired (older than 1 week)
              const valid = stored.filter(
                (s: any) => Date.now() - s.createdAt < ONE_WEEK,
              );

              localStorage.setItem(
                "issuedStocks",
                JSON.stringify([...valid, newIssue]),
              );

              onClose();
            }}
            className="px-6 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
          >
            Issue Stock
          </button>
        </div>
      </div>
    </div>
  );
}
