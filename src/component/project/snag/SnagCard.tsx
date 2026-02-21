"use client";

import SnagActions from "./SnagActions";
import { SnagIssue } from "@/src/ts/snag";

type Props = SnagIssue & {
  onViewImages?: (images: string[]) => void;
  onViewDetails?: () => void;
  onStartWork?: () => void;
  onMarkResolved?: () => void;
};

const priorityStyle: Record<string, string> = {
  high: "bg-red-100 text-red-600 border-red-300",
  medium: "bg-yellow-100 text-yellow-600 border-yellow-300",
  low: "bg-green-100 text-green-600 border-green-300",
};

export default function SnagCard({
  title,
  location,
  description,
  assignedTo,
  deadline,
  reportedOn,
  status,
  priority,
  images,
  onViewImages,
  onViewDetails,
  onStartWork,
  onMarkResolved,
}: Props) {
  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white mb-4 shadow-sm">
      <div className="flex justify-between gap-3">

        {/* Left content */}
        <div className="flex-1">

          {/* Title + Badges */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="text-base font-semibold text-black">{title}</h3>

            {status === "unresolved" && (
              <>
                <span className="px-3 py-0.5 text-xs border rounded bg-yellow-50 text-yellow-600 border-yellow-300">
                  Pending
                </span>
                <span className="px-3 py-0.5 text-xs border rounded bg-gray-100 text-gray-500 border-gray-300">
                  Unresolved
                </span>
              </>
            )}

            {status === "in-progress" && (
              <>
                {priority && (
                  <span className={`px-3 py-0.5 text-xs border rounded font-medium ${priorityStyle[priority]}`}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                )}
                <span className="px-3 py-0.5 text-xs border rounded bg-gray-100 text-gray-500 border-gray-300">
                  Unresolved
                </span>
              </>
            )}

            {status === "resolved" && (
              <span className="px-3 py-0.5 text-xs border rounded bg-green-100 text-green-600 border-green-300">
                Resolved
              </span>
            )}
          </div>

          <p className="text-sm text-zinc-500">{location}</p>
          <p className="text-sm text-zinc-400 mt-1">{description}</p>

          <div className="grid grid-cols-3 mt-5 text-sm">
            <div>
              <p className="text-zinc-400 text-xs">Assigned To</p>
              <p className="font-semibold text-black mt-0.5">{assignedTo}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs">Deadline</p>
              <p className="font-semibold text-black mt-0.5">{deadline}</p>
            </div>
            <div>
              <p className="text-zinc-400 text-xs">Reported On</p>
              <p className="font-semibold text-black mt-0.5">{reportedOn}</p>
            </div>
          </div>
        </div>

        {/* Right actions */}
        <SnagActions
          status={status}
          onViewImages={images?.length ? () => onViewImages?.(images) : undefined}
          onViewDetails={onViewDetails}
          onStartWork={onStartWork}
          onMarkResolved={onMarkResolved}
        />
      </div>
    </div>
  );
}