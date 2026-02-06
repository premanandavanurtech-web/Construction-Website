"use client";

import {  useState } from "react";
import CreateProjectModal, {
  Task,
  TaskInput,
} from "../dashboard/components/CreateProjectModal";
import ProjectCard from "../dashboard/components/ProjectCard";

export default function ProjectPage() {
  const [projects, setProjects] = useState<Task[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // useEffect(() => {
  //   const stored = JSON.parse(localStorage.getItem("tasks") || "[]");
  //   setProjects(stored);
  // }, []);

  const handleCreate = (task: TaskInput) => {
    const newProject: Task = {
      id: crypto.randomUUID(),
      project: task.project,
      location: task.location,
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = projects.filter((item) => item.id !== id);
    setProjects(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
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
        {projects.map((item) => (
          <ProjectCard
            key={item.id}
            id={item.id}
            slug={item.id}
            project={item.project}
            location={item.location}
            onDelete={handleDelete}
          />
        ))}
      </div>

     {isOpen && (
  <CreateProjectModal
    onClose={() => setIsOpen(false)}
    onCreate={(task) => {
      handleCreate(task);
      setIsOpen(false);
    }}
  />
)}

    </div>
  );
}
