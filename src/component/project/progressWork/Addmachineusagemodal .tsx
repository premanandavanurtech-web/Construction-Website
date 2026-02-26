"use client";
import { useState } from "react";
import { getWithExpiry, setWithExpiry } from "@/src/utils/localStorageWithExpiry";
type Props = {
  onClose: () => void;
  onSave: (data: any) => void;
};

export default function AddMachineUsageModal({ onClose, onSave }: Props) {
  const [machines, setMachines] = useState([
    { name: "", quantity: "", description: "" },
  ]);

  const setField = (index:number, field:string, value:string) => {
    setMachines((prev) =>
      prev.map((m, i) => (i === index ? { ...m, [field]: value } : m))
    );
  };

  const handleAddMore = () => {
    setMachines((prev) => [...prev, { name: "", quantity: "", description: "" }]);
  };

 const handleSave = () => {
  const existing = getWithExpiry("task_update_draft") || {};

  setWithExpiry("task_update_draft", {
    ...existing,
    machines,
  });

  onSave?.(machines);
  onClose?.();
};

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)", zIndex: 70, fontFamily: "'Inter',sans-serif" }}
    >
      <div className="relative w-[440px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white px-8 py-7 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-xl text-gray-400 hover:text-gray-600 leading-none"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Add Machine Usage</h2>

        {machines.map((machine, index) => (
          <div key={index} className={index > 0 ? "mt-6 pt-6 border-t border-gray-100" : ""}>

            {/* Machine Name */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Machine Name</label>
              <input
                value={machine.name}
                onChange={(e) => setField(index, "name", e.target.value)}
                className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
              />
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Quantity</label>
              <input
                value={machine.quantity}
                onChange={(e) => setField(index, "quantity", e.target.value)}
                className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
              />
            </div>

            {/* Description */}
            <div className="mb-2">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Description</label>
              <input
                value={machine.description}
                onChange={(e) => setField(index, "description", e.target.value)}
                className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
              />
            </div>

            {/* + Add More Machine — only on last entry */}
            {index === machines.length - 1 && (
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleAddMore}
                  className="text-xs font-medium text-slate-700 hover:text-slate-900"
                >
                  + Add More Machine
                </button>
              </div>
            )}

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