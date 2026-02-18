"use client";

import { useEffect, useState } from "react";

type StockItem = {
  name: string;
  current: number;
  min: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  item: StockItem | null;
};

export default function UpdateStockModal({
  open,
  onClose,
  projectId,
  item,
}: Props) {
  const [itemName, setItemName] = useState("");
  const [currentQty, setCurrentQty] = useState("");
  const [quantityOut, setQuantityOut] = useState("");
  const [minQty, setMinQty] = useState("");


  useEffect(() => {
    if (item && open) {
      setItemName(item.name);
      setCurrentQty(String(item.current)); // ✅ correct field
      setQuantityOut("");
    }
  }, [item, open]);

  
useEffect(() => {
  if (item && open) {
    setItemName(item.name);
    setCurrentQty(String(item.current));
    setMinQty(String(item.min)); // ✅ load min
    setQuantityOut("");
  }
}, [item, open]);



  if (!open || !item) return null;

const handleUpdate = () => {
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  const key = `stock-${projectId}-${item.name}`;
  const raw = localStorage.getItem(key);
  if (!raw) return;

  const original = JSON.parse(raw);

  const baseCurrent = Number(currentQty);
  const deducted = Number(quantityOut || 0);

  const newCurrent =
    quantityOut === ""
      ? baseCurrent            // ✅ direct update
      : baseCurrent - deducted; // ✅ issue stock

  if (newCurrent < 0) {
    alert("Stock cannot be negative");
    return;
  }

  const updatedStock = {
    ...original,
    current: newCurrent,
    status:
      newCurrent <= Number(original.min)
        ? "Low Stock"
        : "In stock",
    updated: "Just now",
    updatedAt: Date.now(), 
    expiresAt: Date.now() + ONE_WEEK,
  };

  localStorage.setItem(key, JSON.stringify(updatedStock));
  onClose();
};


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center text-blac z-50">
      <div className="bg-white p-6 rounded-xl w-[380px] shadow-lg">
        <h2 className="font-semibold mb-4 text-gray-900">
          Update Stock
        </h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Item Name
            </label>
            <input
              value={itemName}
              disabled
              className="w-full h-10 px-3 border rounded bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">
              Current Quantity
            </label>
           <input
  type="number"
  value={currentQty}
  onChange={(e) => setCurrentQty(e.target.value)}
  className="w-full text-black h-10 px-3 border rounded"
/>

          </div>

          <div>
            <label className="block text-xs text-black mb-1">
              Quantity Taking Out
            </label>
            <input
              type="number"
              placeholder="Enter quantity to deduct"
              value={quantityOut}
              onChange={(e) => setQuantityOut(e.target.value)}
              className="w-full h-10 text-black px-3 border rounded"
            />
          </div>

          {quantityOut && (
            <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded">
              New Quantity:{" "}
              <span className="font-semibold text-gray-900">
                {Number(currentQty) - Number(quantityOut)}
              </span>
            </div>
          )}
        </div>

        <div className="flex text-black justify-between mt-6">
          <button
            onClick={onClose}
            className="px-6 h-10 rounded-lg border text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 h-10 rounded-lg bg-[#344960] text-white text-sm"
          >
            Update Stock
          </button>
        </div>
      </div>
    </div>
  );
}
