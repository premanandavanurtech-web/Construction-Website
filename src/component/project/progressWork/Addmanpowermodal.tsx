"use client";
import { useState } from "react";
import { getWithExpiry, setWithExpiry } from "@/src/utils/localStorageWithExpiry";
type Props = {
  onClose: () => void;
  onSave: (data: any) => void;
};

export default function AddManPowerModal({ onClose, onSave }:Props) {
  const [skilled, setSkilled]     = useState(0);
  const [unskilled, setUnskilled] = useState(0);

 const handleSave = () => {
  const existing = getWithExpiry("task_update_draft") || {};

  setWithExpiry("task_update_draft", {
    ...existing,
    manPower: { skilled, unskilled },
  });

  onSave?.({ skilled, unskilled });
  onClose?.();
};

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.35)", zIndex: 70, fontFamily: "'Inter',sans-serif" }}
    >
      <div className="relative w-[420px] rounded-2xl bg-white px-8 py-7 shadow-2xl">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-xl text-gray-400 hover:text-gray-600 leading-none"
        >
          ×
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-7">Add Man Power Usage</h2>

        {/* Skilled Labour */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Skilled Labour</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSkilled((v) => Math.max(0, v - 1))}
              className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-600 text-lg font-light hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              −
            </button>
            <div className="flex-1 rounded-xl bg-gray-100 py-3 text-center text-sm font-medium text-gray-800">
              {skilled}
            </div>
            <button
              onClick={() => setSkilled((v) => v + 1)}
              className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-600 text-lg font-light hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              +
            </button>
          </div>
        </div>

        {/* Unskilled Labour */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Unskilled Labour</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setUnskilled((v) => Math.max(0, v - 1))}
              className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-600 text-lg font-light hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              −
            </button>
            <div className="flex-1 rounded-xl bg-gray-100 py-3 text-center text-sm font-medium text-gray-800">
              {unskilled}
            </div>
            <button
              onClick={() => setUnskilled((v) => v + 1)}
              className="w-9 h-9 rounded-full border border-gray-300 bg-white flex items-center justify-center text-gray-600 text-lg font-light hover:bg-gray-50 transition-colors flex-shrink-0"
            >
              +
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3">
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