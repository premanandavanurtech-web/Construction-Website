"use client";

import { Trash2, MapPin } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    if (open && !projectId) {
      onClose();
      return;
    }
    if (open && projectId) {
      loadLocations();
    }
  }, [open, projectId]);

  const loadLocations = () => {
    try {
      const stored = localStorage.getItem(`locations-${projectId}`);
      const parsed = stored ? JSON.parse(stored) : [];
      setLocations(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      console.error("Error loading locations:", err);
      setLocations([]);
    }
  };

  const handleDelete = (name: string) => {
    try {
      const updated = locations.filter((l) => l !== name);
      localStorage.setItem(`locations-${projectId}`, JSON.stringify(updated));
      setLocations(updated);
      window.dispatchEvent(new Event("locations-updated"));
      onChange?.();
    } catch (err) {
      console.error("Error deleting location:", err);
    }
  };

  if (!open || !projectId) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] bg-white rounded-2xl p-6 shadow-xl">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          All Locations
        </h2>

        {locations.length === 0 ? (
          <div className="text-center py-8">
            <MapPin size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No locations created yet.</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto mb-4">
            {locations.map((loc) => (
              <div
                key={loc}
                className="flex justify-between items-center border rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <span className="text-sm font-medium text-black">{loc}</span>
                <button
                  onClick={() => handleDelete(loc)}
                  className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                  title={`Delete "${loc}"`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t mt-4">
          <button
            onClick={onClose}
            className="px-6 h-10 rounded-lg border text-sm hover:bg-gray-50 text-black transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}