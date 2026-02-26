"use client";

import Link from "next/link";
import { MapPin, User } from "lucide-react";
import { Project } from "@/src/ts/project";

type Props = {
  project: Project;
};

export default function DashboardProjectCard({ project }: Props) {
  const progress = 65;

  const location =
    project.city || project.region
      ? `${project.city}${project.region ? ", " + project.region : ""}`
      : project.address || "--";

  return (
    <Link href={`/projects/${project.id}/reece`} className="block">
      <div className="bg-white border rounded-2xl p-5 shadow-sm hover:shadow-md transition">

        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-black">
            {project.name}
          </h3>

          <span className="text-xs font-medium text-blue-600 bg-blue-100 border border-blue-300 px-3 py-1 rounded-md">
            On Track
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin size={14} />
          {location}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1 text-gray-500">
            <span>Completion</span>
            <span className="font-medium text-black">{progress}%</span>
          </div>

          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-700 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
          <div>
            <p>Days Overdue</p>
            <p className="mt-1 font-semibold text-black">On Time</p>
          </div>

          <div>
            <p>Team Members</p>
            <div className="flex items-center gap-1 mt-1 font-semibold text-black">
              <User size={14} />
              {project.members?.length ?? 0}
            </div>
          </div>

          <div>
            <p>Budget Status</p>
            <p className="mt-1 font-semibold text-black">
              ₹16.3L / ₹25.0L
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}