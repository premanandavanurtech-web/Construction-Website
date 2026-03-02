"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import ProjectTabs from "@/src/layout/ProjectTab";

type Project = {
  id: string;
  name?: string;
  title?: string;
  project?: string;
  status?: string;
};

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const projectId = params?.projectId as string | undefined;

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (!stored) return;
    const allProjects: Project[] = JSON.parse(stored);
    setProjects(allProjects);
    const found = allProjects.find((p) => p.id === projectId);
    if (found) setCurrentProject(found);
  }, [projectId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getProjectName = (p: Project) =>
    p.name ?? p.title ?? p.project ?? "Unknown";

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "completed": return "bg-green-100 text-green-600";
      case "on hold": return "bg-yellow-100 text-yellow-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-blue-100 text-blue-600";
    }
  };

  const handleSelectProject = (project: Project) => {
    setCurrentProject(project);
    setDropdownOpen(false);
    // Navigate to the same sub-route but for the new project
    const currentPath = window.location.pathname;
    const newPath = currentPath.replace(projectId!, project.id);
    router.push(newPath);
  };

  if (!projectId) {
    return <div className="p-6">Loading project...</div>;
  }

  const projectName = currentProject ? getProjectName(currentProject) : "Loading...";
  const projectStatus = currentProject?.status ?? "In Progress";

  return (
    <div className="p-6">
      <div className="mb-6">

        {/* Top row: dropdown + breadcrumb */}
        <div className="flex items-center gap-4 mb-4">

          {/* Project dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-semibold text-gray-900">{projectName}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(projectStatus)}`}>
                {projectStatus}
              </span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-3 py-2 border-b border-gray-100">
                  <p className="text-xs text-gray-400 font-medium">All Projects</p>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {projects.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">No projects found</p>
                  ) : (
                    projects.map((project) => {
                      const isActive = project.id === projectId;
                      const name = getProjectName(project);
                      const status = project.status ?? "In Progress";
                      return (
                        <button
                          key={project.id}
                          onClick={() => handleSelectProject(project)}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${isActive ? "bg-slate-50" : ""}`}
                        >
                          <div className="flex items-center gap-2">
                            {isActive && (
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-800 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${isActive ? "font-semibold text-gray-900" : "text-gray-700"}`}>
                              {name}
                            </span>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${getStatusColor(status)}`}>
                            {status}
                          </span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span
              className="cursor-pointer hover:text-gray-600 transition-colors"
              onClick={() => router.push("/projects")}
            >
              Projects
            </span>
            <span>{">"}</span>
            <span className="text-gray-900 font-medium">{projectName}</span>
          </div>
        </div>

        <ProjectTabs />
      </div>

      {children}
    </div>
  );
}