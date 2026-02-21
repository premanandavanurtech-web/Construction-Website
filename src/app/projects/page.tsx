"use client";

import { useEffect, useState } from "react";
import CreateProjectModal from "../../component/dashboard/CreateProjectModal";
import ProjectCard from "../../component/dashboard/ProjectCard";
import { Project } from "@/src/ts/project";

export default function ProjectPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  // Read from same "projects" key as dashboard
  useEffect(() => {
    const stored = localStorage.getItem("projects");
    if (stored) {
      setProjects(JSON.parse(stored) as Project[]);
    }
  }, []);

  // Called by modal — modal already saved to localStorage
  const handleCreate = (project: Project) => {
    setProjects((prev) => [...prev, project]);
  };

  // Delete project
  const handleDelete = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    localStorage.setItem("projects", JSON.stringify(updated));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-medium text-[16px] text-black">
          Project Portfolio
        </h2>

        <button
          onClick={() => setIsOpen(true)}
          className="px-4 py-2 text-sm bg-black text-white rounded-md"
        >
          New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {isOpen && (
        <CreateProjectModal
          onClose={() => setIsOpen(false)}
          onCreate={(project) => {
            handleCreate(project);
            setIsOpen(false);
          }}
        />
      )}
    </div>
  );
}