"use client";

type Props = {
  status: "unresolved" | "in-progress" | "resolved" | "pending"; // ✅ FIX
  onViewDetails?: () => void;
  onViewImages?: () => void;
  onStartWork?: () => void;
  onMarkResolved?: () => void;
};

export default function SnagActions({
  status,
  onViewDetails,
  onViewImages,
  onStartWork,
  onMarkResolved,
}: Props) {
  return (
    <div className="flex flex-col gap-2 mt-7 items-end">
      {/* View Images (optional) */}
      {onViewImages && (
        <button
          onClick={onViewImages}
          className="px-6 py-1.5 text-sm border text-[#344960] rounded-md"
        >
          View Images
        </button>
      )}

      {/* View Details */}
      {onViewDetails && (
        <button
          onClick={onViewDetails}
          className="px-6 py-1.5 text-sm border text-[#344960] rounded-md"
        >
          View Details
        </button>
      )}

      {/* Start Work (only if unresolved) */}
      {status === "unresolved" && onStartWork && (
        <button
          onClick={onStartWork}
          className="px-7 py-1.5 text-sm text-[#344960] border rounded-md"
        >
          Start Work
        </button>
      )}

      {/* Mark Resolved (if not already resolved) */}
      {status !== "resolved" && onMarkResolved && (
        <button
          onClick={onMarkResolved}
          className="px-4 py-1.5 text-sm text-yellow-100 bg-[green] rounded-md border"
        >
          Mark Resolved
        </button>
      )}
    </div>
  );
}