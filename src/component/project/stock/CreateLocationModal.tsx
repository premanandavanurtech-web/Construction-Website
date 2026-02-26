"use client";

import { useState } from "react";
import AllLocationsModal from "./AllLocationsModal";

type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSubmit?: () => void;
};

export default function CreateLocationModal({
  open,
  onClose,
  onSubmit,
  projectId,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openAll, setOpenAll] = useState(false);

  const handleSubmit = () => {
    if (!projectId) {
      alert("Project not selected. Please reopen the modal.");
      return;
    }

    if (!name.trim()) {
      alert("Location name is required");
      return;
    }

    const key = `locations-${projectId}`;
    const existing: string[] = JSON.parse(localStorage.getItem(key) || "[]");

    if (existing.includes(name.trim())) {
      alert("Location already exists");
      return;
    }

    localStorage.setItem(key, JSON.stringify([...existing, name.trim()]));
    window.dispatchEvent(new Event("locations-updated"));

    onSubmit?.();
    setName("");
    setDescription("");
    onClose();
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="relative w-[420px] bg-white rounded-2xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">
              Create Location
            </h2>

            {/* View All button — same as CreateCategoryModal */}
            <button
              onClick={() => setOpenAll(true)}
              className="absolute right-6 top-6 px-4 h-8 rounded-lg bg-[#344960] text-white text-xs hover:bg-[#2a3a4a]"
            >
              View All
            </button>

            {/* Form — same structure as CreateCategoryModal */}
            <div className="space-y-3 text-sm text-gray-900">
              <Input label="Location Name" value={name} onChange={setName} />
              <Textarea
                label="Description"
                value={description}
                onChange={setDescription}
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="px-6 h-10 rounded-lg border text-sm text-black hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 h-10 rounded-lg bg-[#344960] text-white text-sm hover:bg-[#2a3a4a]"
              >
                Create Location
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Always mounted so it keeps its state */}
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
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg bg-gray-100 px-3 outline-none focus:ring-1 focus:ring-[#344960]"
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
      <label className="block text-xs text-gray-600 mb-1">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full rounded-lg bg-gray-100 px-3 py-2 outline-none resize-none focus:ring-1 focus:ring-[#344960]"
      />
    </div>
  );
}