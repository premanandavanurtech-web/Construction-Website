"use client";

import { useState } from "react";

type VegetationData = {
  vegetationDensity: string;
  largeTreesPresent: string;
  treesToRemove: string;
  protectedSpecies: string;
  clearingRequirements: string;
  document: string | null;
  savedAt: number;
};

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export default function VegetationAssessment() {
  const [data, setData] = useState<VegetationData>({
    vegetationDensity: "",
    largeTreesPresent: "",
    treesToRemove: "",
    protectedSpecies: "",
    clearingRequirements: "",
    document: null,
    savedAt: Date.now(),
  });

  const update = (key: keyof VegetationData, value: any) =>
    setData((prev) => ({ ...prev, [key]: value }));

  /* -------- FILE UPLOAD -------- */
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      update("document", reader.result as string);
    reader.readAsDataURL(file);
  };

  /* -------- SUBMIT -------- */
  const handleSubmit = () => {
    const payload = {
      ...data,
      savedAt: Date.now(),
    };

    localStorage.setItem(
      "vegetationAssessment",
      JSON.stringify(payload)
    );

    alert("Vegetation data saved (valid for 1 week)");
  };

  /* -------- AUTO EXPIRE -------- */
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("vegetationAssessment");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.savedAt > ONE_WEEK) {
        localStorage.removeItem("vegetationAssessment");
      }
    }
  }

  return (
    <div>
      <h2 className="text-lg text-black font-semibold mb-1">
        Vegetation
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Existing site grasses and trees
      </p>

  
    <div className="bg-white text-black w-full rounded-2xl border p-6">

      <div className="space-y-5">
        {/* Vegetation Density */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Vegetation Density
          </label>
          <input
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Moderate / Dense..."
            onChange={(e) =>
              update("vegetationDensity", e.target.value)
            }
          />
        </div>

        {/* Trees */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium block mb-1">
              Large Trees Present?
            </label>
            <select
              className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
              onChange={(e) =>
                update("largeTreesPresent", e.target.value)
              }
            >
              <option value="">Yes / No</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Number of Trees To Be Removed
            </label>
            <input
              className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
              type="number"
              placeholder="0"
              onChange={(e) =>
                update("treesToRemove", e.target.value)
              }
            />
          </div>
        </div>

        {/* Protected Species */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Protected Species Present?
          </label>
          <select
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            onChange={(e) =>
              update("protectedSpecies", e.target.value)
            }
          >
            <option value="">Yes / No</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        {/* Clearing Requirements */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Clearing Requirements
          </label>
          <input
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Any special conditions or requirement"
            onChange={(e) =>
              update("clearingRequirements", e.target.value)
            }
          />
        </div>

        {/* Upload */}
        <div>
          <label className="text-sm font-medium block mb-2">
            Upload Supporting Document
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