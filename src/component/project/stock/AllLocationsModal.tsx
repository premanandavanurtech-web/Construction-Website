"use client";

import { Trash2 } from "lucide-react";

type Props = {
  open: boolean;
  projectId: string;
  onClose: () => void;
  onChange?: () => void;
};

export default function AllLocationsModal({
  open,
  projectId,
  onClose,
  onChange,
}: Props) {
  if (!open) return null;

  const key = `locations-${projectId}`;
  const locations: string[] = JSON.parse(
    localStorage.getItem(key) || "[]"
  );

  const handleDelete = (name: string) => {
    const updated = locations.filter((l) => l !== name);
    localStorage.setItem(key, JSON.stringify(updated));
    onChange?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] bg-white rounded-2xl p-6 shadow-xl">

        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Locations
        </h2>

        {locations.length === 0 ? (
          <p className="text-sm text-gray-800">
            No locations created
          </p>
        ) : (
          <div className="space-y-2">
            {locations.map((loc) => (
              <div
                key={loc}
                className="flex justify-between text-black items-center border rounded-lg px-3 py-2"
              >
                <span className="text-sm">{loc}</span>
                <button
                  onClick={() => handleDelete(loc)}
                  className="text-red-600 text-sm hover:underline"
                >
                    <Trash2 size={16} className="cursor-pointer" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex text-black justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 text-black h-10 rounded-lg border text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
