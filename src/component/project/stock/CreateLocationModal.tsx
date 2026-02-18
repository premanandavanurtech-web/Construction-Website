"use client";

import { useState } from "react";
import AllLocationsModal from "./AllLocationsModal";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSubmit?: () => void; // 🔄 refresh hook
};

export default function CreateLocationModal({
  open,
  onClose,
  projectId,
  onSubmit,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openAll, setOpenAll] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Location name is required");
      return;
    }

    if (!projectId) {
      alert("Project ID missing");
      return;
    }

    const key = `locations-${projectId}`;
    const existing: string[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    if (existing.includes(name)) {
      alert("Location already exists");
      return;
    }

    const updated = [...existing, name];
    localStorage.setItem(key, JSON.stringify(updated));

    // reset
    setName("");
    setDescription("");

    onSubmit?.();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="w-[420px] bg-white rounded-2xl p-6 shadow-xl">

          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Create Location
          </h2>

          {/* 👀 View All */}
          <button
            onClick={() => setOpenAll(true)}
          className="px-6 h-8 ml-68 relative -top-13  rounded-lg bg-[#344960] text-white text-sm  hover:underline"
          >
            View All 
          </button>

          <div className="space-y-3 text-sm text-gray-900">
            <Input
              label="Location Name"
              value={name}
              onChange={setName}
            />

            <Textarea
              label="Description"
              value={description}
              onChange={setDescription}
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={onClose}
              className="px-6 h-10 rounded-lg border text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 h-10 rounded-lg bg-[#344960] text-white text-sm"
            >
              Create Location
            </button>
          </div>
        </div>
      </div>

      {/* 📦 All Locations */}
      <AllLocationsModal
        open={openAll}
        projectId={projectId}
        onClose={() => setOpenAll(false)}
        onChange={onSubmit}
      />
    </>
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
      <label className="block text-xs text-gray-600 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg bg-gray-100 px-3 outline-none"
      />
    </div>
  );
}

function Textarea({
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
      <label className="block text-xs text-gray-600 mb-1">
        {label}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg bg-gray-100 px-3 py-2 outline-none resize-none"
      />
    </div>
  );
}
