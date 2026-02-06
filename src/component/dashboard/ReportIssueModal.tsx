"use client";

import React from "react";
import { X } from "lucide-react";

/* 🔹 Helper Field component */
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

type Issue = {
  module: string;
  priority: string;
  title: string;
  description: string;
};

type Props = {
  onClose: () => void;
};

const ReportIssueModal = ({ onClose }: Props) => {
  const [issue, setIssue] = React.useState<Issue>({
    module: "",
    priority: "",
    title: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setIssue((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const existing = JSON.parse(
      localStorage.getItem("reportedIssues") || "[]"
    );

    localStorage.setItem(
      "reportedIssues",
      JSON.stringify([...existing, issue])
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white w-full max-w-[420px] rounded-2xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={18} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Report Issue
        </h2>

        <form onSubmit={handleSubmit} className="space-y-2">

          <Field label="Module">
            <input
              name="module"
              value={issue.module}
              onChange={handleChange}
              className="w-full h-9 px-3 text-black rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          <Field label="Priority">
            <select
              name="priority"
              value={issue.priority}
              onChange={handleChange}
              className="w-full h-9 px-3 text-black rounded-md bg-[#e6e6e6] text-sm outline-none"
            >
              <option value="">Select</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </Field>

          <Field label="Issue Title">
            <input
              name="title"
              value={issue.title}
              onChange={handleChange}
              className="w-full h-9 px-3 text-black rounded-md bg-[#e6e6e6] text-sm outline-none"
            />
          </Field>

          <Field label="Description">
            <textarea
              name="description"
              value={issue.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 text-black rounded-md bg-[#e6e6e6] text-sm outline-none resize-none"
            />
          </Field>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full h-9 border rounded-md text-xs text-gray-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="w-full h-9 rounded-md bg-slate-800 text-white text-xs"
            >
              Report Issue
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ReportIssueModal;