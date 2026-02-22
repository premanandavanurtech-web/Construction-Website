"use client";

import { useState, useEffect } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
};




export default function AddStock({ open, onClose, projectId }: Props) {
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [vendor, setVendor] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [minStock, setMinStock] = useState("");

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  /* 🔄 Load categories */
useEffect(() => {
  if (!open || !projectId) return;

  const stored = JSON.parse(
    localStorage.getItem(`categories-${projectId}`) || "[]"
  );

  console.log("Loaded categories:", stored); // 🔍 debug
  setCategories(stored);
}, [open, projectId]);


  /* 🔄 Load locations */
  useEffect(() => {
    const loadLocations = () => {
      const stored = JSON.parse(
        localStorage.getItem(`locations-${projectId}`) || "[]"
      );
      setLocations(stored);
    };

    loadLocations();
    window.addEventListener("locations-updated", loadLocations);

    return () =>
      window.removeEventListener("locations-updated", loadLocations);
  }, [projectId]);

  if (!open) return null;
const handleSubmit = () => {
  if (!itemName || !quantity || !minStock) {
    alert("Item name, quantity and minimum stock are required");
    return;
  }

  if (!category) {
    alert("Please select a category");
    return;
  }

  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  const currentQty = Number(quantity);
  const minQty = Number(minStock);

  const stockData = {
    name: itemName.trim(),
    category: category.trim().toLowerCase(), // ✅ NORMALIZED
    current: currentQty,
    min: minQty,
    location: location || "Warehouse A",
    status: currentQty <= minQty ? "Low Stock" : "In stock",
    updated: "Just now",
    vendor: vendor.trim(),                          // ✅ REQUIRED
    createdAt: now,
    updatedAt: now,
    expiresAt: now + ONE_WEEK,
  };

  localStorage.setItem(
    `stock-${projectId}-${itemName}`,
    JSON.stringify(stockData)
  );

  onClose();
};



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] h-[700px] bg-white rounded-2xl p-4 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Add New Stock Entry
        </h2>

        <div className="space-y-1 text-black text-sm">
          <Input label="Item Name" value={itemName} onChange={setItemName} />
          <Input label="Quantity" value={quantity} onChange={setQuantity} />
          <Input label="Unit" value={unit} onChange={setUnit} />
          <Input label="Vendor" value={vendor} onChange={setVendor} />

          {/* Category */}
          <Select
            label="Category"
            value={category}
            onChange={setCategory}
            options={categories}
          />

          {/* Location */}
          <Select
            label="Storage Location"
            value={location}
            onChange={setLocation}
            options={locations.length ? locations : ["Warehouse A"]}
          />

          <Input
            label="Minimum Stock Level"
            value={minStock}
            onChange={setMinStock}
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-6 text-black h-10 rounded-lg border text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 h-10 rounded-lg bg-[#344960] text-white text-sm"
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Inputs ---------- */

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg bg-gray-100 px-3 outline-none"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg bg-gray-100 px-3 outline-none"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
