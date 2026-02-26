"use client";

import Link from "next/link";
import { MapPin, Calendar, User } from "lucide-react";
import { Project } from "@/src/ts/project";

type Props = {
  project: Project;
};

export default function ProjectSectionCard({ project }: Props) {
  const progress = 75;

  const location =
    project.city || project.region
      ? `${project.city}${project.region ? ", " + project.region : ""}`
      : project.address || "--";

  return (
    <Link href={`/projects/${project.id}/reece`} className="block">
      <div className="bg-white border rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">

        {/* Image */}
        <div className="relative">
          {project.projectImage ? (
            <img
              src={project.projectImage}
              className="w-full h-48 object-cover"
              alt={project.name}
            />
          ) : (
            <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <span className="absolute top-4 right-4 bg-white text-blue-600 border border-blue-300 text-xs font-medium px-3 py-1 rounded-md">
            In Progress
          </span>
        </div>

        {/* Content */}
        <div className="p-5">

          <h3 className="text-lg font-semibold text-black mb-2">
            {project.name}
          </h3>

          <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
            <MapPin size={14} />
            {location}
          </div>

          <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
            <Calendar size={14} />
            Due: {project.endDate || "--"}
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1 text-gray-500">
              <span>Progress</span>
              <span className="font-medium text-black">{progress}%</span>
            </div>

            <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-700">
              ₹12000000 / ₹20000000
            </span>

            <div className="flex items-center gap-1 text-gray-600">
              <User size={16} />
              {project.members?.length ?? 0}
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}