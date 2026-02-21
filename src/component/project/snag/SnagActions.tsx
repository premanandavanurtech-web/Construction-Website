"use client";

type Props = {
  status: "unresolved" | "in-progress" | "resolved" | "pending";
  onViewDetails?: () => void;
  onViewImages?: () => void;
  onStartWork?: () => void;
  onMarkResolved?: () => void;
};

export default function SnagActions({
  status,
  onViewDetails,
  onStartWork,
  onMarkResolved,
}: Props) {
  return (
    <div className="flex flex-col gap-2 min-w-[130px] justify-center">

      {/* Start Work — only when unresolved */}
      {status === "unresolved" && onStartWork && (
        <button
          onClick={onStartWork}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Start Work
        </button>
      )}

      {/* View Details — always visible */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="w-full px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          View Details
        </button>
      )}

      {/* Mark Resolved — unresolved + in-progress only */}
      {(status === "unresolved" || status === "in-progress") && onMarkResolved && (
        <button
          onClick={onMarkResolved}
          className="w-full px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
        >
          Mark Resolved
        </button>
      )}

    </div>
  );
}