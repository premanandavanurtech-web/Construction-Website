"use client";

import Link from "next/link";
import { MapPin, User, Trash2 } from "lucide-react";

type Props = {
  id: string;
  slug: string;
  project: string;
  location: string;
  onDelete: (id: string) => void;
};

const ProjectCard = ({ id, slug, project, location, onDelete }: Props) => {
  return (
    <Link href={`/projects/${slug}`} className="block">
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm relative cursor-pointer hover:shadow-md transition">

        {/* Delete */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(id);
          }}
          className="absolute top-7 right-1 text-red-400 hover:text-red-600"
        >
          <Trash2 size={16} />
        </button>

        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-black">
            {project}
          </h3>

          <span className="text-xs font-medium text-blue-600 bg-blue-100 border border-blue-300 px-3 py-1 rounded-md">
            On Track
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 mb-5">
          <MapPin size={14} />
          <span className="text-sm">{location}</span>
        </div>

        {/* Progress */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Completion</span>
            <span className="font-medium text-black">65%</span>
          </div>

          <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{
                width: "65%",
                background:
                  "linear-gradient(90deg, #0B1F3A 0%, #2F6FDB 50%, #0B1F3A 100%)",
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="grid grid-cols-3 gap-4 text-xs text-gray-500">
          <div>
            <p>Days Overdue</p>
            <p className="mt-2 font-semibold text-black">On Time</p>
          </div>

          <div>
            <p>Team Members</p>
            <div className="flex items-center gap-1 mt-2 font-semibold text-black">
              <User size={16} />
              12
            </div>
          </div>

          <div>
            <p>Budget Status</p>
            <p className="mt-2 font-semibold text-black">
              ₹16.3L / ₹25.0L
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
