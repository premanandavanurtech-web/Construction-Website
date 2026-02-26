"use client";

import { useEffect, useState } from "react";
import {
  setWithExpiry,
  getWithExpiry,
  removeWithExpiry,
} from "@/src/utils/localStorageWithExpiry";

const SUBTASK_STORAGE_KEY = "assign_subtask_draft";

export default function AddSubTaskModal({
  onClose,
  onAddSubtask,
}: {
  onClose: () => void;
  onAddSubtask: (subtask: any) => void;
}) {
  const [form, setForm] = useState({
    title: "",
    location: "",
    category: "",
    status: "Not Started",
  });

  /* ✅ Load subtask draft (1 week valid) */
  useEffect(() => {
    const saved = getWithExpiry(SUBTASK_STORAGE_KEY);
    if (saved) setForm(saved);
  }, []);

  /* ✅ Save subtask draft (1 week expiry) */
  useEffect(() => {
    setWithExpiry(SUBTASK_STORAGE_KEY, form);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = () => {
    if (!form.title.trim()) return;

    onAddSubtask(form);

    /* ✅ clear subtask draft after create */
    removeWithExpiry(SUBTASK_STORAGE_KEY);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-50">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">Add Sub Task</h2>
          <button onClick={onClose} className="text-xl text-gray-400">×</button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="SubTask Title"
            name="title"
            value={form.title}
            onChange={handleChange}
          />
          <Input
            label="Location/Floor/Room"
            name="location"
            value={form.location}
            onChange={handleChange}
          />
          <Input
            label="SubTask Category"
            name="category"
            value={form.category}
            onChange={handleChange}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-5 py-2 text-sm rounded-md bg-slate-700 text-white"
          >
            Create SubTask
          </button>
        </div>
      </div>
    </div>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-gray-600 mb-1 block">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-9 rounded-md bg-gray-100 border px-3 text-sm"
      />
    </div>
  );
}