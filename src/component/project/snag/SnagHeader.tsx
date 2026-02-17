"use client";

type Props = {
  onReport: () => void;
};

export default function SnagHeader({ onReport }: Props) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-xl font-semibold text-black">
          Quality & Issue Management
        </h1>
        <p className="text-sm text-zinc-500">
          Track defects, quality issues, and resolutions
        </p>
      </div>

      <button
        onClick={onReport}
        className="px-4 py-2 rounded-lg bg-[#344960] text-white text-sm"
      >
        + Report New Issue
      </button>
    </div>
  );
}