"use client";

import { useState } from "react";
import { StockItem } from "@/src/ts/stock";

type Props = {
  open: boolean;
  item: StockItem | null;
  projectId: string;
  onClose: () => void;
  onSuccess: () => void;
};

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

export default function UpdateQuantityModal({ open, item, projectId, onClose, onSuccess }: Props) {
  const [quantityOut, setQuantityOut] = useState("");

  if (!open || !item) return null;

  const handleUpdate = () => {
    if (!quantityOut) return;

    const now = Date.now();
    const taken = Number(quantityOut);
    const newCurrent = Number(item.current) - taken;

    const updated: StockItem = {
      ...item,
      current: newCurrent,
      updatedAt: now,
      expiresAt: now + SEVEN_DAYS,
      status: newCurrent <= Number(item.min) ? "Low Stock" : "In Stock",
      history: [
        ...(item.history || []),
        {
          timestamp: now,
          quantityUsed: taken,
          task: "Stock Updated",
          approvedBy: item.vendor || "Vendor",
          remarks: `Quantity reduced from ${item.current} to ${newCurrent}`,
        },
      ],
    };

    localStorage.setItem(`stock-${projectId}-${item.name}`, JSON.stringify(updated));
    setQuantityOut("");
    onSuccess();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-[420px] bg-white rounded-xl shadow-xl p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold text-gray-900">Update Stock</h2>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Item Name</label>
            <input
              value={item.name}
              disabled
              className="w-full border rounded-lg px-3 h-10 text-sm bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Current Quantity</label>
            <input
              value={`${item.current} Bags`}
              disabled
              className="w-full border rounded-lg px-3 h-10 text-sm bg-gray-100 text-gray-700"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1">Quantity Taking Out</label>
            <input
              type="number"
              value={quantityOut}
              onChange={(e) => setQuantityOut(e.target.value)}
              placeholder=""
              className="w-full border rounded-lg px-3 h-10 text-sm outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 border rounded-lg text-sm text-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              className="flex-1 h-10 rounded-lg bg-[#344960] text-white text-sm"
            >
              Update Stock
            </button>
          </div>
        </div>
      </div>
    </>
  );
}