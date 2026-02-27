"use client";

import Image from "next/image";
import { useState } from "react";

type Props = {
  title: string;
  location: string;
  description: string;
  assignedTo: string;
  deadline: string;
  reportedOn: string;
  images: string[];
  onClose: () => void;
};

export default function ViewDetailsModal({
  title,
  location,
  description,
  assignedTo,
  deadline,
  reportedOn,
  images,
  onClose,
}: Props) {
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    <>
      {/* MAIN MODAL */}
      <div className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center">
        <div className="bg-white w-[560px] rounded-2xl p-6">
          <h2 className="text-xl text-black font-semibold">
            View Details
          </h2>

          <p className="mt-3 font-medium">{title}</p>
          <p className="text-sm text-gray-800">{location}</p>
          <p className="text-sm text-black mt-2">{description}</p>

          <div className="grid grid-cols-3 gap-6 mt-6 text-sm">
            <div>
              <p className="text-gray-500">Assigned To</p>
              <p className="text-black font-medium">{assignedTo}</p>
            </div>
            <div>
              <p className="text-gray-500">Deadline</p>
              <p className="font-medium text-black">{deadline}</p>
            </div>
            <div>
              <p className="text-gray-500">Reported On</p>
              <p className="font-medium text-black">{reportedOn}</p>
            </div>
          </div>

          {/* IMAGE GRID */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {images.map((img, i) => (
              <div
                key={i}
                className="relative h-32 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setActiveImage(img)}
              >
                <Image
                  src={img}
                  alt="issue"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-6 text-black py-2 border rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* 🔍 IMAGE PREVIEW MODAL */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setActiveImage(null)}
        >
          <div
            className="relative w-[80vw] h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={activeImage}
              alt="preview"
              fill
              className="object-contain rounded-lg"
            />

            <button
              onClick={() => setActiveImage(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}