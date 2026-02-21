"use client";

import { useState } from "react";

type PreExistingStructure = {
  structurePresent: string;
  structureType: string;
  structureCondition: string;
  demolitionRequired: string;
  document: string | null;
  savedAt: number;
};

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export default function PreExistingStructureForm() {
  const [data, setData] = useState<PreExistingStructure>({
    structurePresent: "",
    structureType: "",
    structureCondition: "",
    demolitionRequired: "",
    document: null,
    savedAt: Date.now(),
  });

  const update = (key: keyof PreExistingStructure, value: any) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      update("document", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    const payload = {
      ...data,
      savedAt: Date.now(),
    };

    localStorage.setItem(
      "preExistingStructure",
      JSON.stringify(payload)
    );

    alert("Saved successfully (valid for 1 week)");
  };

  /* ---------- Auto Cleanup ---------- */
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("preExistingStructure");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.savedAt > ONE_WEEK) {
        localStorage.removeItem("preExistingStructure");
      }
    }
  }

  return (
    <div className="">
    
      <h2 className="text-lg text-black font-semibold mb-4">
        Pre-Existing Structure
      </h2>
    <div className="bg-white text-black rounded-2xl  border p-6 max-w-7xl">
      <p className="text-sm text-gray-500 mb-6">
        Existing Structure Survey
      </p>

      <div className="space-y-5">
        {/* Structure Present */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Structure Present On The Site?
          </label>
          <select
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            onChange={(e) =>
              update("structurePresent", e.target.value)
            }
          >
            <option value="">Yes / No</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Structure Type */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Structure Type
          </label>
          <input
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Shed / Wall..."
            onChange={(e) =>
              update("structureType", e.target.value)
            }
          />
        </div>

        {/* Structure Condition */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Structure Condition
          </label>
          <select
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            onChange={(e) =>
              update("structureCondition", e.target.value)
            }
          >
            <option value="">Poor / Bad / Good</option>
            <option>Poor</option>
            <option>Bad</option>
            <option>Good</option>
          </select>
        </div>

        {/* Demolition */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Demolition Required?
          </label>
          <select
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            onChange={(e) =>
              update("demolitionRequired", e.target.value)
            }
          >
            <option value="">Yes / No</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Upload */}
        <div>
          <label className="text-sm font-medium block mb-2">
            Upload Document
          </label>

          <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFile}
            />

            {data.document ? (
              <span className="text-sm text-green-600">
                File uploaded successfully
              </span>
            ) : (
              <>
                <span className="text-sm font-medium">
                  Upload A File
                </span>
                <span className="text-xs text-gray-500">
                  Or Drag And Drop (PNG, JPG, GIF up to 50MB)
                </span>
              </>
            )}
          </label>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-4 pt-6">
          <button className="px-6 py-2 rounded-lg border">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-slate-800 text-white"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}