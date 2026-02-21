"use client";

import { X } from "lucide-react";
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (role: {
    title: string;
    description: string;
    modules: string[];
  }) => void;
};

export default function AddRoleModal({ open, onClose, onSave }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [moduleInput, setModuleInput] = useState("");
  const [modules, setModules] = useState<string[]>([]);

  if (!open) return null;

  const addModule = () => {
    if (!moduleInput.trim()) return;
    setModules((prev) => [...prev, moduleInput.trim()]);
    setModuleInput("");
  };

  const removeModule = (index: number) => {
    setModules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!title.trim()) return;

    onSave({
      title,
      description,
      modules,
    });

    // reset
    setTitle("");
    setDescription("");
    setModules([]);
    setModuleInput("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-xl p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-black mb-5">
          Add New Role
        </h2>

        {/* Role Name */}
        <div className="mb-4">
          <label className="text-sm font-medium text-black mb-1 block">
            Role Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Manager"
            className="w-full text-black h-10 px-3 rounded-md bg-gray-100 text-sm outline-none"
          />
        </div>
        <div className="mb-4">
          <label className="text-sm font-medium text-black mb-1 block">
            User Name
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Manager"
            className="w-full text-black h-10 px-3 rounded-md bg-gray-100 text-sm outline-none"
          />
        </div>

        {/* Role Description */}
        <div className="mb-4">
          <label className="text-sm font-medium text-black mb-1 block">
            Role Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Access to vendor and labour management with reporting"
            className="w-full text-black h-20 px-3 py-2 rounded-md bg-gray-100 text-sm outline-none"
          />
        </div>

        {/* Module Input */}
        <div className="mb-3">
          <label className="text-sm font-medium text-black mb-1 block">
            Module Name
          </label>

          <div className="flex gap-2">
            <input
              value={moduleInput}
              onChange={(e) => setModuleInput(e.target.value)}
              placeholder="e.g. Labour Management"
              className="flex-1 text-black h-10 px-3 rounded-md bg-gray-100 text-sm outline-none"
            />
            <button
              onClick={addModule}
              className="px-4 rounded-md border text-sm"
            >
              Add
            </button>
          </div>
        </div>

        {/* Module Chips */}
        {modules.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {modules.map((mod, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs border rounded-md flex items-center gap-2"
              >
                {mod}
                <button
                  onClick={() => removeModule(idx)}
                  className="text-gray-400 hover:text-red-500"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 h-9 rounded-lg border text-gray-700 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 h-9 rounded-lg bg-[#344960] text-white text-sm"
          >
            Save Role
          </button>
        </div>
      </div>
    </div>
  );
}