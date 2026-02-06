"use client";

import React from "react";
import { X } from "lucide-react";

export type TaskInput = {
  project: string;
  location: string;
};

export type Task = {
  id: string;
  project: string;
  location: string;
};

type Props = {
  onClose: () => void;
  onCreate: (task: TaskInput) => void;
};

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="text-xs font-medium text-gray-600">
      {label}
    </label>
    {children}
  </div>
);

const CreateProjectModal = ({ onClose, onCreate }: Props) => {
  const [task, setTask] = React.useState<TaskInput>({
    project: "",
    location: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.project.trim()) return;

    onCreate(task);
    onClose();
  };

  return (
    <div className="fixed inset-0 text-black bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Create New Project
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">
          <Field label="Project Name">
            <input
              name="project"
              value={task.project}
              onChange={handleChange}
              className="w-full h-9 px-3 bg-[#e6e6e6] rounded-md text-sm"
            />
          </Field>

          <Field label="Location / Floor / Room">
            <input
              name="location"
              value={task.location}
              onChange={handleChange}
              className="w-full h-9 px-3 bg-[#e6e6e6] rounded-md text-sm"
            />
          </Field>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-9 border rounded-md text-xs"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full h-9 bg-slate-800 text-white rounded-md text-xs"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;





