"use client";

import { ChevronDown } from "lucide-react";

type Props = {
  projectName: string;
  status: "In Progress" | "Completed" | "On Hold";
};

const statusStyles = {
  "In Progress": "bg-blue-100 text-blue-700",
  "Completed": "bg-green-100 text-green-700",
  "On Hold": "bg-yellow-100 text-yellow-700",
};

export default function ProjectHeader({ projectName, status }: Props) {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-600">
      
      {/* Project Dropdown */}
      <button className="flex items-center gap-7 px-3 py-2 mr-3 border rounded-lg bg-white hover:bg-gray-50">
        <span className="font-medium text-gray-900">{projectName}</span>
      {/* Status Badge */}
      <span
        className={`px-2 py-1 rounded-2xl text-xs border-zinc-400 bg-white border text-[#1114eb]  ${statusStyles[status]}`}
      >
        {status}
      </span>
        <ChevronDown size={16} />
      </button>


      {/* Breadcrumb */}
      <div className="flex items-center gap-5 text-gray-500">
        <span className="font-medium">Projects</span>
        <span className="text-gray-400">{">"}</span>
        <span className="text-gray-900 font-medium">{projectName}</span>
      </div>
    </div>
  );
}