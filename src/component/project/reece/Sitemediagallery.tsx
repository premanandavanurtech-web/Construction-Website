"use client";

import { useState } from "react";

const LABELS = ["Site", "Location", "Overview", "Interior", "Exterior"];

export default function SiteMediaGallery() {
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const selected = Array.from(e.target.files);
    setFiles(selected);
    setPreview(selected.map((f) => URL.createObjectURL(f)));
  };

  const visible = preview.slice(0, 3);
  const extraCount = preview.length - 3;

  return (
    <div className="w-full">
      <h2 className="text-sm font-medium text-gray-900 mb-3">
        Site Media Gallery
      </h2>

      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        {/* Upload Box */}
        <label className="flex flex-col items-center justify-center h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-gray-400 transition mb-5">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />

          <p className="text-sm font-medium text-gray-800">
            Upload A File Or Drag And Drop
          </p>
          <p className="text-xs text-gray-400">
            Png, Jpg, Gif Upto 50MB
          </p>
        </label>

        {/* Image Grid */}
        {preview.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-4">
            {visible.map((src, i) => {
              const isLast = i === 2 && extraCount > 0;

              return (
                <div
                  key={i}
                  className="relative h-48 rounded-xl overflow-hidden cursor-pointer"
                  onClick={() => isLast && setShowModal(true)}
                >
                  <img
                    src={src}
                    className="h-full w-full object-cover"
                    alt="preview"
                  />

                  {isLast ? (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-lg font-semibold">
                        {extraCount + 1}+ Images
                      </span>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-3 py-1 rounded-md">
                      {LABELS[i] ?? "Site"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button className="text-sm px-4 py-2 border border-gray-300 rounded-lg">
          Comments (2)
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl max-w-4xl w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                All Images
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto">
              {preview.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="h-40 w-full object-cover rounded-lg"
                  alt={`image-${i}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}