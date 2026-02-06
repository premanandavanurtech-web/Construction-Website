"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const [projectName, setProjectName] = useState("");

  // useEffect(() => {
  //   const projects = JSON.parse(
  //     localStorage.getItem("tasks") || "[]"
  //   );

  //   const currentProject = projects.find(
  //     (p: any) => p.slug === projectId
  //   );

  //   if (currentProject) {
  //     setProjectName(currentProject.project);
  //   }
  // }, [projectId]);

  return (
    <div className="p-6">
      {/* 🔹 Project Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Projects</span>
          <span>{">"}</span>
          <span className="text-black font-medium">
            {projectName || "Loading..."}
          </span>
        </div>

        <h1 className="text-2xl font-semibold mt-2">
          {projectName || "Loading..."}
        </h1>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex gap-3 border-b mb-6">
        {[
          "reece",
          "design",
          "boq",
          "order",
          "work-progress",
          "snag",
          "finance",
          "stock",
        ].map((tab) => (
          <Link
            key={tab}
            href={`/projects/${projectId}/${tab}`}
            className="px-4 py-2 text-sm capitalize rounded-md hover:bg-gray-100"
          >
            {tab.replace("-", " ")}
          </Link>
        ))}
      </div>

      {/* 🔹 Page Content */}
      {children}
    </div>
  );
}
