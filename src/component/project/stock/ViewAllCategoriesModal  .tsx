"use client";

import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  projectId: string;
  onClose: () => void;
  onChange?: () => void;

  // 👇 FILTER
  onlyCategory?: string;
};

export default function AllCategoriesModal({
  open,
  projectId,
  onClose,
  onChange,
  onlyCategory,
}: Props) {
  if (!open) return null;

  const key = `categories-${projectId}`;
  const categories: string[] = JSON.parse(
    localStorage.getItem(key) || "[]"
  );

  const visibleCategories = onlyCategory
    ? categories.filter((c) => c === onlyCategory)
    : categories;

  const handleDelete = (name: string) => {
    const updated = categories.filter((c) => c !== name);
    localStorage.setItem(key, JSON.stringify(updated));
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
                  className="text-red-600"
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
            className="px-6 h-10 rounded-lg border text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
