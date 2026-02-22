"use client";

import { useState } from "react";

type LocationData = {
  siteAccessDescription: string;
  roadCondition: string;
  wideForVehicles: string;
  accessDocument: string | null;

  plotLength: string;
  plotWidth: string;
  terrainType: string;
  measurementDocument: string | null;

  waterSupply: string;
  electricitySupply: string;
  additionalNotes: string;
  utilityDocument: string | null;

  savedAt: number;
};

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export default function LocationEvaluation() {
  const [data, setData] = useState<LocationData>({
    siteAccessDescription: "",
    roadCondition: "",
    wideForVehicles: "",
    accessDocument: null,

    plotLength: "",
    plotWidth: "",
    terrainType: "",
    measurementDocument: null,

    waterSupply: "",
    electricitySupply: "",
    additionalNotes: "",
    utilityDocument: null,

    savedAt: Date.now(),
  });

  const update = (key: keyof LocationData, value: any) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const handleFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    key:
      | "accessDocument"
      | "measurementDocument"
      | "utilityDocument"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () =>
      update(key, reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    localStorage.setItem(
      "locationEvaluation",
      JSON.stringify({ ...data, savedAt: Date.now() })
    );

    alert("Location evaluation saved (valid for 1 week)");
  };

  /* ---------- AUTO EXPIRE ---------- */
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("locationEvaluation");
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.savedAt > ONE_WEEK) {
        localStorage.removeItem("locationEvaluation");
      }
    }
  }

  return (
  

<div>

      <h2 className="text-lg text-black mb-4 font-semibold">
        Location Evaluation
      </h2>

    <div className="bg-white text-black w-full rounded-2xl border p-6 space-y-8">

      {/* ================= SITE ACCESS ================= */}
      <div className="border rounded-xl p-5">
        <h3 className="font-medium mb-4">Site Access Detail</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">
              Description
            </label>
            <input
              className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
              placeholder="Enter Site Access Details"
              onChange={(e) =>
                update("siteAccessDescription", e.target.value)
              }
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Road Condition
            </label>
            <select
              className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
              onChange={(e) =>
                update("roadCondition", e.target.value)
              }
            >
              <option value="">Select Road Condition</option>
              <option>Good</option>
              <option>Average</option>
              <option>Poor</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">
              Wide Enough For Construction Vehicles
            </label>
            <select
              className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
              onChange={(e) =>
                update("wideForVehicles", e.target.value)
              }
            >
              <option value="">Yes / No</option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>

          <UploadBox
            onChange={(e) => handleFile(e, "accessDocument")}
            uploaded={!!data.accessDocument}
          />
        </div>
      </div>

      {/* ================= SITE MEASUREMENT ================= */}
      <div className="border rounded-xl p-5">
        <h3 className="font-medium mb-4">Site Measurement</h3>

        <div className="grid grid-cols-2 gap-6 mb-4">
              <div className="mb-4">
             <label className="text-sm font-medium block mb-1">
            Plot Length (ft)
          </label>
          <input
            className="h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Plot Length "
            type="number"
            onChange={(e) =>
              update("plotLength", e.target.value)
            }
          />
          </div>


           <div className="mb-4">
             <label className="text-sm font-medium block mb-1">
            Plot Width (ft)
          </label>
          <input
            className="h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Plot Width"
            type="number"
            onChange={(e) =>
              update("plotWidth", e.target.value)
            }
          />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium block mb-1">
            Terrain Type
          </label>
          <input
            className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none"
            placeholder="Flat, Sloped, Hilly..."
            onChange={(e) =>
              update("terrainType", e.target.value)
            }
          />
        </div>

        <UploadBox
          onChange={(e) => handleFile(e, "measurementDocument")}
          uploaded={!!data.measurementDocument}
        />
      </div>

      {/* ================= UTILITIES ================= */}
      <div className="border rounded-xl p-5">
        <h3 className="font-medium mb-4">
          Utility Connections
        </h3>

        <div className="grid grid-cols-2 gap-6 mb-4">
          <select
            className="h-10 px-3 rounded-md bg-gray-100 outline-none"
            onChange={(e) =>
              update("waterSupply", e.target.value)
            }
          >
            <option value="">Water Supply Available?</option>
            <option>Yes</option>
            <option>No</option>
          </select>

          <select
            className="h-10 px-3 rounded-md bg-gray-100 outline-none"
            onChange={(e) =>
              update("electricitySupply", e.target.value)
            }
          >
            <option value="">Electricity Supply Available?</option>
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>

        <input
          className="w-full h-10 px-3 rounded-md bg-gray-100 outline-none mb-4"
          placeholder="Enter any additional observation"
          onChange={(e) =>
            update("additionalNotes", e.target.value)
          }
        />

        <UploadBox
          onChange={(e) => handleFile(e, "utilityDocument")}
          uploaded={!!data.utilityDocument}
        />
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-4 pt-4">
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
  );
}

/* ================= UPLOAD BOX ================= */
function UploadBox({
  onChange,
  uploaded,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploaded: boolean;
}) {
  return (
    <label className="flex flex-col items-center justify-center h-32 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
      <input
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onChange}
      />
      {uploaded ? (
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
   
  );
}