"use client";

import { useState } from "react";
import AllCategoriesModal from "./ViewAllCategoriesModal  ";


type Props = {
  open: boolean;
  onClose: () => void;
  projectId: string;
  onSubmit?: (data: { name: string; description: string }) => void;

  // 👇 ADD THIS (optional)
  onlyCategory?: string;
};

export default function CreateCategoryModal({
  open,
  onClose,
  onSubmit,
  projectId,
  onlyCategory,
}: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [openAll, setOpenAll] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    const key = `categories-${projectId}`;
    const existing: string[] = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    if (existing.includes(name)) {
      alert("Category already exists");
      return;
    }

    const updated = [...existing, name];
    localStorage.setItem(key, JSON.stringify(updated));

    onSubmit?.({ name, description });

    setName("");
    setDescription("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Create Category
        </h2>

        <button
          onClick={() => setOpenAll(true)}
          className="px-4 h-8 mb-4 rounded-lg bg-[#344960] text-white text-sm"
        >
          View All
        </button>

        {/* Form */}
        <div className="space-y-3 text-sm text-gray-900">
          <Input label="Category Name" value={name} onChange={setName} />
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
            Create Category
          </button>
        </div>
      </div>

      {/* 👇 PASS FILTER DOWN */}
      <AllCategoriesModal
        open={openAll}
        projectId={projectId}
        onClose={() => setOpenAll(false)}
        onChange={() => onSubmit?.({ name: "", description: "" })}
        onlyCategory={onlyCategory}
      />
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
        className="w-full rounded-lg bg-gray-100 px-3 py-2 outline-none resize-none"
      />
    </div>
  );
}
