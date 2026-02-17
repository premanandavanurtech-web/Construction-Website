"use client";

import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  item: {
    name: string;
    stock: string;
  } | null;
};

export default function UpdateStockModal({ open, onClose, item }: Props) {
  const [itemName, setItemName] = useState("");
  const [currentQty, setCurrentQty] = useState("");
  const [quantityOut, setQuantityOut] = useState("");

  useEffect(() => {
  if (item && open) {
    setItemName(item.name);
    setCurrentQty(item.stock);
    setQuantityOut("");
  }
}, [item, open]);



  if (!open || !item) return null;

const handleUpdate = () => {
  const current = Number(currentQty);
  const out = Number(quantityOut);

  if (isNaN(current) || isNaN(out)) {
    alert("Please enter valid numbers");
    return;
  }

  if (out > current) {
    alert("Quantity out cannot be greater than current stock");
    return;
  }

  const updatedStock = current - out;

  const data = {
    name: itemName,
    stock: updatedStock,
  };

  // remove old key if name changed
  if (item?.name !== itemName) {
    localStorage.removeItem(`stock-${item.name}`);
  }

  localStorage.setItem(
    `stock-${itemName}`,
    JSON.stringify(data)
  );

  onClose();
};


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[380px] rounded-2xl p-6 space-y-4">

        <h2 className="text-lg font-semibold text-gray-900">
          Update Stock
        </h2>

        {/* Item Name (EDITABLE) */}
        <div>
          <label className="text-xs text-gray-600 block mb-1">
            Item Name
          </label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full h-10 text-black px-3 rounded-lg border text-sm"
          />
        </div>

        {/* Current Quantity (EDITABLE) */}
        <div>
          <label className="text-xs text-black block mb-1">
            Current Quantity
          </label>
          <input
            type="text"
            value={currentQty}
            onChange={(e) => setCurrentQty(e.target.value)}
            className="w-full h-10 px-3 text-black rounded-lg border text-sm"
          />
        </div>

        {/* Quantity Taking Out (EDITABLE) */}
        <div>
          <label className="text-xs text-black block mb-1">
            Quantity Taking Out
          </label>
          <input
            type="number"
            value={quantityOut}
            onChange={(e) => setQuantityOut(e.target.value)}
            className="w-full h-10 px-3 text-black rounded-lg border text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between pt-2">
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