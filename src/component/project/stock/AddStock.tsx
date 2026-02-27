"use client";

import { useState, useEffect } from "react";
import CreateCategoryModal from "./CreateCategoryModal";
import CreateLocationModal from "./CreateLocationModal";

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

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  const loadCategories = () => {
    if (!projectId) return;
    try {
      const stored = JSON.parse(
        localStorage.getItem(`categories-${projectId}`) || "[]"
      );
      setCategories(Array.isArray(stored) ? stored : []);
    } catch {
      setCategories([]);
    }
  };

  const loadLocations = () => {
    if (!projectId) return;
    try {
      const stored = JSON.parse(
        localStorage.getItem(`locations-${projectId}`) || "[]"
      );
      setLocations(Array.isArray(stored) ? stored : []);
    } catch {
      setLocations([]);
    }
  };

  // Load both when modal opens
  useEffect(() => {
    if (!open || !projectId) return;
    loadCategories();
    loadLocations();
  }, [open, projectId]);

  // Keep locations in sync with external updates (e.g. AllLocationsModal deletes)
  useEffect(() => {
    if (!projectId) return;
    window.addEventListener("locations-updated", loadLocations);
    return () => window.removeEventListener("locations-updated", loadLocations);
  }, [projectId]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setItemName("");
      setQuantity("");
      setUnit("");
      setVendor("");
      setCategory("");
      setLocation("");
      setMinStock("");
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = () => {
    if (!itemName.trim() || !quantity || !minStock) {
      alert("Item name, quantity and minimum stock are required.");
      return;
    }
    if (!category) {
      alert("Please select a category.");
      return;
    }

    const now = Date.now();
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    const currentQty = Number(quantity);
    const minQty = Number(minStock);

    const stockData = {
      name: itemName.trim(),
    category: category.trim(),
      unit: unit.trim(),
      current: currentQty,
      min: minQty,
      location: location || "Warehouse A",
      status: currentQty <= minQty ? "Low Stock" : "In stock",
      updated: "Just now",
      vendor: vendor.trim(),
      createdAt: now,
      updatedAt: now,
      expiresAt: now + ONE_WEEK,
    };

    const stockKey = `stock-${projectId}-${itemName.trim().toLowerCase().replace(/\s+/g, "-")}`;
    localStorage.setItem(stockKey, JSON.stringify(stockData));
    window.dispatchEvent(new Event("stock-updated"));
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-[420px] max-h-[700px] overflow-y-auto bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Add New Stock Entry
          </h2>

          <div className="space-y-3 text-black text-sm">
            <Input label="Item Name" value={itemName} onChange={setItemName} />
            <Input label="Quantity" value={quantity} onChange={setQuantity} type="number" />
            <Input label="Unit (e.g. kg, pcs)" value={unit} onChange={setUnit} />
            <Input label="Vendor" value={vendor} onChange={setVendor} />

            {/* Category */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs text-gray-600">Category</label>
                <button
                  onClick={() => setShowCategoryModal(true)}
                  className="text-xs text-[#344960] hover:underline"
                >
                  + Create New
                </button>
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 rounded-lg bg-gray-100 px-3 outline-none"
              >
                <option value="">Select a category</option>
                {categories.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs text-gray-600">Storage Location</label>
                <button
                  onClick={() => setShowLocationModal(true)}
                  className="text-xs text-[#344960] hover:underline"
                >
                  + Create New
                </button>
              </div>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 rounded-lg bg-gray-100 px-3 outline-none"
              >
                <option value="">Select a location</option>
                {locations.length > 0 ? (
                  locations.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))
                ) : (
                  <option value="Warehouse A">Warehouse A</option>
                )}
              </select>
            </div>

            <Input
              label="Minimum Stock Level"
              value={minStock}
              onChange={setMinStock}
              type="number"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="px-6 text-black h-10 rounded-lg border text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 h-10 rounded-lg bg-[#344960] text-white text-sm hover:bg-[#2a3a4a]"
            >
              Add Stock
            </button>
          </div>
        </div>
      </div>

      <CreateCategoryModal
        open={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        projectId={projectId}
        onSubmit={() => {
          loadCategories();
          setShowCategoryModal(false);
        }}
      />

      <CreateLocationModal
        open={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        projectId={projectId}
        onSubmit={() => {
          loadLocations();
          setShowLocationModal(false);
        }}
      />
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg bg-gray-100 px-3 outline-none focus:ring-1 focus:ring-[#344960]"
      />
    </div>
  );
}