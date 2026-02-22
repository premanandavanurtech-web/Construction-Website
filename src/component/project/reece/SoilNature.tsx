"use client";

import { useState } from "react";

type SoilData = {
  soilType: string;
  bearingCapacity: string;
  waterTableDepth: string;
  soilPh: string;
  additionalObservation: string;
  document: string | null;
  savedAt: number;
};

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export default function SoilNature() {
  const [data, setData] = useState<SoilData>({
    soilType: "",
    bearingCapacity: "",
    waterTableDepth: "",
    soilPh: "",
    additionalObservation: "",
    document: null,
    savedAt: Date.now(),
  });

  const update = (key: keyof SoilData, value: any) =>
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
      "soilNature",
      JSON.stringify(payload)
    );

    alert("Soil report saved (valid for 1 week)");
  };

  /* -------- AUTO EXPIRE -------- */
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("soilNature");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.savedAt > ONE_WEEK) {
        localStorage.removeItem("soilNature");
      }
    }
  }

  return (
    <div>
      <h2 className="text-lg text-black font-semibold mb-1">
        Soil Nature
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Soil Testing Report
      </p>

  
    <div className="bg-white text-black w-full rounded-2xl border p-6">

      <div className="space-y-5">
        {/* Soil Type */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Soil Type
          </label>
          <input
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Clay, Sandy, Rocky..."
            onChange={(e) =>
              update("soilType", e.target.value)
            }
          />
        </div>

        {/* Bearing Capacity */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Bearing Capacity (kN/m²)
          </label>
          <input
            type="number"
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Enter Bearing Capacity"
            onChange={(e) =>
              update("bearingCapacity", e.target.value)
            }
          />
        </div>

        {/* Water Table Depth */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Water Table Depth (ft)
          </label>
          <input
            type="number"
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Enter Depth"
            onChange={(e) =>
              update("waterTableDepth", e.target.value)
            }
          />
        </div>

        {/* Soil pH */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Soil pH Level
          </label>
          <input
            type="number"
            step="0.1"
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Enter pH Level"
            onChange={(e) =>
              update("soilPh", e.target.value)
            }
          />
        </div>

        {/* Additional Observation */}
        <div>
          <label className="text-sm font-medium block mb-1">
            Additional Observation
          </label>
          <input
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Enter issues, observation, recommendations"
            onChange={(e) =>
              update("additionalObservation", e.target.value)
            }
          />
        </div>

        {/* Upload */}
        <div>
          <label className="text-sm font-medium block mb-2">
            Upload Soil Test Report
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