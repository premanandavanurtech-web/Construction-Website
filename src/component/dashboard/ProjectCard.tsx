"use client";

import Link from "next/link";
import { MapPin, User, Trash2 } from "lucide-react";
import { Project } from "@/src/ts/project";

type Props = {
  project: Project;
  onDelete: (id: string) => void;
  variant?: "dashboard" | "project";
};

export default function ProjectCard({
  project,
  onDelete,
  variant = "dashboard",
}: Props) {
  const location =
    project.city || project.region
      ? `${project.city}${project.region ? ", " + project.region : ""}`
      : project.address || "--";

  const progress = 65; // mock for now

  return (
    <Link href={`/projects/${project.id}/reece`} className="block">
      <div className="bg-white rounded-2xl border shadow-sm p-5 hover:shadow-md transition relative">

        {/* Delete */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="absolute top-4 right-4 text-red-400 hover:text-red-600"
        >
          <Trash2 size={14} />
        </button>

        {/* ================= PROJECT PAGE (IMAGE) ================= */}
        {variant === "project" && (
          <div className="mb-4">
            {project.projectImage ? (
              <img
                src={project.projectImage}
                className="w-full h-40 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>
        )}

        {/* ================= COMMON CONTENT ================= */}
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-black">
            {project.name}
          </h3>

          <span className="text-xs font-medium text-blue-600 bg-blue-100 border px-3 py-1 rounded-md">
            On Track
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <MapPin size={14} />
          {location}
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
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