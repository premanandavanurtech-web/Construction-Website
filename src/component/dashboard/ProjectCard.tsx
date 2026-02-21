"use client";

import Link from "next/link";
import { MapPin, User, Trash2 } from "lucide-react";
import { Project } from "@/src/ts/project";

type Props = {
  project: Project;
  onDelete: (id: string) => void;
};

const ProjectCard = ({ project, onDelete }: Props) => {
  if (!project) return null; // 👈 prevents crash

  const location =
    project.city || project.region
      ? `${project.city}${project.region ? ", " + project.region : ""}`
      : project.address || "--";

  return (
    <Link href={`/projects/${project.id}/reece`} className="block">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative hover:shadow-md transition">

        {/* Delete */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(project.id);
          }}
          className="absolute top-6 right-4 text-red-400 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">
            {project.name || "Untitled Project"}
          </h3>

          <span className="text-xs font-medium text-blue-600 bg-blue-100 border border-blue-300 px-3 py-1 rounded-md">
            Active
          </span>
        </div>

        {/* Image */}
        {project.drawings && (
          <img
            src={project.drawings}
            alt={project.name}
            className="w-full h-36 object-cover rounded-xl mb-4"
          />
        )}

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 mb-5">
          <MapPin size={14} />
          <span className="text-sm">{location}</span>
        </div>

        {/* Progress (STATIC UI – SAFE) */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Completion</span>
            <span className="font-medium text-black">—</span>
          </div>

          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-blue-600 rounded-full" />
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
          <div>
            <p>Days Overdue</p>
            <p className="mt-2 font-semibold text-black">—</p>
          </div>

          <div>
            <p>Team Members</p>
            <div className="flex items-center gap-1 mt-2 font-semibold text-black">
              <User size={16} />
              {project.members?.length ?? 0}
            </div>
          </div>

          <div>
            <p>Budget Status</p>
            <p className="mt-2 font-semibold text-black">
              {project.budget ? `₹${project.budget}` : "—"}
            </p>
          </div>
        </div>

      </div>
    </Link>
  );
};

export default ProjectCard;