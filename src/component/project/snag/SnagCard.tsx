  "use client";

import SnagStatusBadge from "./Badges/StatusBadge";
  // import SnagPriorityBadge from "./badges/PriorityBadge";
  // import SnagStatusBadge from "./badges/StatusBadge";
import SnagActions from "./SnagActions";


  type Props = {
    title: string;
    location: string;
    description: string;
    assignedTo: string;
    deadline: string;
    reportedOn: string;
    priority: "high" | "pending" | "low";
    status: "unresolved" | "in-progress" | "resolved" | "pending";
    images?: string[];
    onViewImages?: (images: string[]) => void;
    onViewDetails?: () => void;   // ✅ ADD THIS
  };

  export default function SnagCard({
  title,
  location,
  description,
  assignedTo,
  deadline,
  reportedOn,
  priority,
  status,
  images,
  onViewImages,
  onViewDetails,   // ✅ ADD THIS
}: Props) {
    return (
      <div className="border rounded-xl p-5 bg-white mb-4">
        <div className="flex justify-between gap-6">
          
          {/* LEFT */}
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-[20px] text-black">{title}</h3>
              {/* <SnagPriorityBadge /> */}
              <SnagStatusBadge status={status} />
            </div>

            <p className="text-sm text-zinc-600 mt-1">{location}</p>
            <p className="text-sm text-zinc-500 mt-1">{description}</p>

            <div className="grid grid-cols-3 gap-6 mt-4 text-sm">
              <div>
                <p className="text-zinc-500">Assigned To</p>
                <p className="font-medium text-black">{assignedTo}</p>
              </div>
              <div>
                <p className="text-zinc-500">Deadline</p>
                <p className="font-medium text-black">{deadline}</p>
              </div>
              <div>
                <p className="text-zinc-500">Reported On</p>
                <p className="font-medium text-black">{reportedOn}</p>
              </div>
            </div>
          </div>

          {/* RIGHT ACTIONS */}
        <SnagActions
    status={status}
    onViewImages={
      images && onViewImages
        ? () => onViewImages(images)
        : undefined
    }
onViewDetails={onViewDetails}
    onStartWork={() => console.log("start work")}
    onMarkResolved={() => console.log("mark resolved")}
  />
        </div>
      </div>
    );
  }