"use client";

import { useState, useEffect } from "react";
import UpdateStockModal from "@/src/app/projects/[projectId]/stock/current-inventory/page";

type StockItem = {
  name: string;
  stock: string;
};

export default function StockClient({
  projectId,
}: {
  projectId: string;
}) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] =
    useState<StockItem | null>(null);

  useEffect(() => {
    const stored: StockItem[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`stock-`)) {
        const data = localStorage.getItem(key);
        if (data) stored.push(JSON.parse(data));
      }
    });

    setItems(stored);
  }, []);

  return (
    <div className="p-6 space-y-4">

      <h1 className="text-xl font-semibold">
        Current Inventory
      </h1>

      <div className="grid gap-3">
        {items.map((item) => (
          <div
            key={item.name}
            className="flex justify-between items-center border rounded-lg p-4"
          >
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">
                Stock: {item.stock}
              </p>
            </div>

            <button
              onClick={() => {
                setSelectedItem(item);
                setOpen(true);
              }}
              className="px-4 py-2 text-sm bg-black text-white rounded-lg"
            >
              Update
            </button>
          </div>
        ))}
      </div>

      <UpdateStockModal
        open={open}
        item={selectedItem}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
