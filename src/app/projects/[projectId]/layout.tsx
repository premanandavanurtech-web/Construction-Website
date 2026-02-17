"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectTabs from "@/src/layout/ProjectTab";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const projectId = params?.projectId as string | undefined;

  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return; // 🔒 VERY IMPORTANT

    const stored = localStorage.getItem("tasks");
    if (!stored) return;

    const projects = JSON.parse(stored);
    const currentProject = projects.find(
      (p: any) => p.id === projectId
    );

    if (currentProject) {
      setProjectName(currentProject.project);
    } else {
      setProjectName("Unknown Project");
    }
  }, [projectId]);

  // 🔒 Prevent rendering until projectId is ready
  if (!projectId) {
    return <div className="p-6">Loading project...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Projects</span>
          <span>{">"}</span>
          <span className="text-black font-medium">
            {projectName ?? "Loading..."}
          </span>
        </div>

        <ProjectTabs />
      </div>

      {children}
    </div>
  );
}
