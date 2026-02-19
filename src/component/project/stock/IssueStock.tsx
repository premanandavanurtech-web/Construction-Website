"use client";

import { useEffect, useState } from "react";

type StockLog = {
  item: string;
  type: "Received" | "Issued";
  quantity: string;
  from: string;
  to: string;
  issuedBy: string;
  date: string;
  invoice: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function IssueStockModal({ open, onClose }: Props) {
  const [item, setItem] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [issueTo, setIssueTo] = useState("");
  const [stockItems, setStockItems] = useState<string[]>([]);

  /* 🔹 Load available items from RECEIVED logs */
 useEffect(() => {
  const logs: StockLog[] = JSON.parse(
    localStorage.getItem("stockLogs") || "[]"
  );

  const receivedItems = logs
    .filter((log) => log.type === "Received")
    .map((log) => log.item);

  setStockItems([...new Set(receivedItems)]);
}, []);


  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[520px] bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl text-slate-800 font-semibold mb-6">
          Issue Stock
        </h2>

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
            <label className="text-sm text-gray-700 block mb-1">
              Quantity
            </label>
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
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
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700"
          >
            Cancel
          </button>

          <button
          onClick={() => {
  if (!item || !quantity || !issueTo) return;

  const logs: StockLog[] = JSON.parse(
    localStorage.getItem("stockLogs") || "[]"
  );

  // 🔍 Find RECEIVED item
  const updatedLogs = logs.map((log) => {
    if (log.item === item && log.type === "Received") {
      return {
        ...log,
        type: "Issued",                 // ✅ convert
        quantity: `${quantity} ${unit}`,
        from: "Warehouse",
        to: issueTo,
        issuedBy: "Admin",
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        invoice: `ISS-${Date.now()}`,
      };
    }
    return log;
  });

  localStorage.setItem("stockLogs", JSON.stringify(updatedLogs));

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
