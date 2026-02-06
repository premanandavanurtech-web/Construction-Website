"use client";

import Image from "next/image";

type Props = {
  images: string[];
  onClose: () => void;
};

export default function ViewImagesModal({ images, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-[520px] rounded-2xl p-6 shadow-xl">
        <h1 className="font-bold text-black text-lg ">View Images</h1>
        <p className="text-black">Crack in external wall plaster</p>
        
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Images
        </h2>
cd
        <div className="grid grid-cols-2 gap-4">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative h-[140px] rounded-xl overflow-hidden bg-gray-100"
            >
              <Image
                src={img}
                alt={`Image ${index + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
        </div>5
      </div>
    </div>
  );
}