"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  projectId: string;
  onClose: () => void;
  onChange?: () => void;
  onlyCategory?: string;
};

export default function AllCategoriesModal({
  open,
  projectId,
  onClose,
  onChange,
  onlyCategory,
}: Props) {
  const key = `categories-${projectId}`;

  // ✅ Categories in state so deletes trigger re-render
  const [categories, setCategories] = useState<string[]>(() =>
    JSON.parse(localStorage.getItem(key) || "[]")
  );

  // ✅ Re-read from localStorage whenever modal opens
  // (picks up any new categories created since last open)
  if (open && categories.length === 0) {
    const fresh = JSON.parse(localStorage.getItem(key) || "[]");
    if (fresh.length > 0) setCategories(fresh);
  }

  if (!open) return null;

  const visibleCategories = onlyCategory
    ? categories.filter((c) => c === onlyCategory)
    : categories;

  const handleDelete = (name: string) => {
    const updated = categories.filter((c) => c !== name);
    localStorage.setItem(key, JSON.stringify(updated));
    setCategories(updated); // ✅ update state so list re-renders immediately
    onChange?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Categories
        </h2>

        {visibleCategories.length === 0 ? (
          <p className="text-sm text-gray-500">No categories found</p>
        ) : (
          <div className="space-y-2">
            {visibleCategories.map((cat) => (
              <div
                key={cat}
                className="flex justify-between items-center border rounded-lg px-3 py-2"
              >
                <span className="text-sm text-gray-900">{cat}</span>
                <button
                  onClick={() => handleDelete(cat)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 text-black h-10 rounded-lg border text-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}