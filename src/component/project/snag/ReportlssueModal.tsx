"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (snag: any) => void;
};

type FormState = {
  title: string;
  location: string;
  description: string;
  assignedTo: string;
  deadline: string;
  priority: "high" | "medium" | "low" | "";
  image: string;
};

export default function ReportIssueModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormState>({
    title: "",
    location: "",
    description: "",
    assignedTo: "",
    deadline: "",
    priority: "",
    image: "",
  });

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = () => {
    if (!form.title || !form.location) return;

    const newSnag = {
      id: crypto.randomUUID(),
      title: form.title,
      location: form.location,
      description: form.description,
      assignedTo: form.assignedTo,
      deadline: form.deadline,
      priority: form.priority || "pending",
      status: "unresolved",
      reportedOn: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      images: form.image ? [form.image] : [],
    };

    onSubmit(newSnag);

    // reset form
    setForm({
      title: "",
      location: "",
      description: "",
      assignedTo: "",
      deadline: "",
      priority: "",
      image: "",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[440px] rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-black">
          Report New Issue
        </h2>

        <div>
          <label className="text-sm text-black">Issue Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            className="w-full text-black h-10 mt-1 bg-zinc-100 rounded-lg px-3"
          />
        </div>

        <div>
          <label className="text-sm text-black">Floor And Room</label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            className="w-full text-black h-10 mt-1 bg-zinc-100 rounded-lg px-3"
          />
        </div>

        <div>
          <label className="text-sm text-black">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full text-black h-16 mt-1 bg-zinc-100 rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="text-sm text-black">Assigned To</label>
          <input
            name="assignedTo"
            value={form.assignedTo}
            onChange={handleChange}
            className="w-full text-black h-10 mt-1 bg-zinc-100 rounded-lg px-3"
          />
        </div>

        <div>
          <label className="text-sm text-black">Deadline</label>
          <input
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="w-full text-black h-10 mt-1 bg-zinc-100 rounded-lg px-3"
          />
        </div>

        <div>
          <label className="text-sm text-black">Priority</label>
          <select
            name="priority"
            value={form.priority}
            onChange={handleChange}
            className="w-full text-black h-10 mt-1 bg-zinc-100 rounded-lg px-3"
          >
            <option value="">Select</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div>
          <label className="text-sm text-black">Add Image</label>
          <label className="mt-1 flex flex-col items-center justify-center h-24 border border-dashed rounded-lg text-xs text-zinc-500 cursor-pointer">
            Upload A File Or Drag And Drop
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImage}
            />
          </label>
        </div>

        <div className="flex justify-between pt-2">
          <button
            onClick={onClose}
            className="px-6 text-black h-10 border rounded-lg text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 h-10 bg-[#344960] text-white rounded-lg text-sm"
          >
            Report Issue
          </button>
        </div>
      </div>
    </div>
  );
}
