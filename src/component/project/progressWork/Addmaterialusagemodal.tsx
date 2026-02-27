"use client";
import { useState } from "react";
type Props = {
  onClose: () => void;
  onSave: (data: any) => void;
};

export default function AddMaterialUsageModal({ onClose, onSave }:Props) {
  const [materials, setMaterials] = useState([
    { name: "", unit: "", quantity: "", description: "" },
  ]);

  const setField = (index:number, field:string, value:string) => {
    setMaterials((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleAddMore = () => {
    setMaterials((prev) => [
      ...prev,
      { name: "", unit: "", quantity: "", description: "" },
    ]);
  };

  const handleSave = () => {
    onSave?.(materials);
    onClose?.();
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)", zIndex: 70, fontFamily: "'Inter',sans-serif" }}
    >
      <div className="relative w-[460px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white px-8 py-7 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-xl text-gray-400 hover:text-gray-600 leading-none"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Add Material Usage</h2>

        {materials.map((mat, index) => (
          <div key={index} className={index > 0 ? "mt-6 pt-6 border-t border-gray-100" : ""}>

            {/* Material Name */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Material Name
              </label>
              <input
                value={mat.name}
                onChange={(e) => setField(index, "name", e.target.value)}
                className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
              />
            </div>

            {/* Unit + Quantity Used */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Unit</label>
                <input
                  value={mat.unit}
                  onChange={(e) => setField(index, "unit", e.target.value)}
                  className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Quantity Used</label>
                <input
                  value={mat.quantity}
                  onChange={(e) => setField(index, "quantity", e.target.value)}
                  className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
              <input
                value={mat.description}
                onChange={(e) => setField(index, "description", e.target.value)}
                className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
              />
            </div>

            {/* Remaining Stock + Add More */}
            <div className="flex items-center justify-between mt-1">
              <span className="text-xs font-medium text-green-600">Remaining Stock:</span>
              {index === materials.length - 1 && (
                <button
                  onClick={handleAddMore}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900"
                >
                  + Add More Materials
                </button>
              )}
            </div>

          </div>
        ))}

        {/* Footer */}
        <div className="flex gap-3 mt-7">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
          >
            Save
          </button>
        </div>

      </div>
    </div>
  );
}