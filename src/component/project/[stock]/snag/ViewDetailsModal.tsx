
"use client";

import Image from "next/image";

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
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[560px] bg-white rounded-2xl p-6 shadow-xl">
        
        {/* Header */}
        <h2 className="text-xl font-semibold text-gray-900">
          View Details
        </h2>

        {/* Title */}
        <p className="mt-3 text-lg font-medium text-gray-900">
          {title}
        </p>

        {/* Location */}
        <p className="text-sm text-gray-500 mt-1">
          {location}
        </p>

        {/* Description */}
        <p className="mt-2 text-sm text-gray-600">
          {description}
        </p>

        {/* Meta Info */}
        <div className="grid grid-cols-3 gap-6 mt-6 text-sm">
          <div>
            <p className="text-gray-500">Assigned To</p>
            <p className="font-medium text-gray-900 mt-1">
              {assignedTo}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Deadline</p>
            <p className="font-medium text-gray-900 mt-1">
              {deadline}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Reported On</p>
            <p className="font-medium text-gray-900 mt-1">
              {reportedOn}
            </p>
          </div>
        </div>

        {/* Images */}
        <div className="mt-6">
          <p className="text-sm text-gray-500 mb-3">
            Images
          </p>

          <div className="grid grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative h-[130px] rounded-xl overflow-hidden bg-gray-100"
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
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-8">
          <button
            onClick={onClose}
            className="px-8 py-2 rounded-lg border border-[#5B6B7F] text-[#344960] hover:bg-gray-100 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}