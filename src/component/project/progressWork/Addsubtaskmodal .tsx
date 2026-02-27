"use client";
import { useEffect, useState } from "react";
import {
  setWithExpiry,
  getWithExpiry,
  removeWithExpiry,
} from "@/src/utils/localStorageWithExpiry";
import { SubTask } from "@/src/ts/task";

const SUBTASK_STORAGE_KEY = "subtask_draft";

type FormState = {
  title: string;
  location: string;
  category: string;
  assignedTo: string;
  startDate: string;
  dueDate: string;
};

type Props = {
  onClose: () => void;
  onAddSubtask: (subtask: SubTask) => void;
};

export default function AddSubTaskModal({ onClose, onAddSubtask }: Props) {
  const [form, setForm] = useState<FormState>({
    title: "",
    location: "",
    category: "",
    assignedTo: "",
    startDate: "",
    dueDate: "",
  });

  useEffect(() => {
    const saved = getWithExpiry(SUBTASK_STORAGE_KEY);
    if (saved) setForm(saved as FormState); // ✅ cast unknown to FormState
  }, []);

  useEffect(() => {
    setWithExpiry(SUBTASK_STORAGE_KEY, form);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const subtask: SubTask = {
      ...form,
      status: "In Progress",
    };
    onAddSubtask(subtask);
    removeWithExpiry(SUBTASK_STORAGE_KEY);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Sub Task</h2>
          <button onClick={onClose} className="text-xl text-gray-400">
            ×
          </button>
        </div>

        <div className="space-y-4">
          <Input label="SubTask Title" name="title" value={form.title} onChange={handleChange} />
          <Input label="Location/Floor/Room" name="location" value={form.location} onChange={handleChange} />
          <Input label="SubTask Category" name="category" value={form.category} onChange={handleChange} />
          <Input label="Assigned To" name="assignedTo" value={form.assignedTo} onChange={handleChange} />
          <Input label="Starting Date" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
          <Input label="Due Date" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
        </div>

        <div className="flex justify-between mt-6">
          <button onClick={onClose} className="px-6 py-2 text-sm border rounded-md">
            Cancel
          </button>
          <button onClick={handleSubmit} className="px-6 py-2 text-sm rounded-md bg-slate-700 text-white">
            Create Subtask
          </button>
        </div>
      </div>
    </div>
  );
}

type InputProps = {
  label: string;
  name: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  type?: string;
};

function Input({ label, name, value, onChange, type = "text" }: InputProps) {
  return (
    <div>
      <label className="text-xs text-gray-600 mb-1 block">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-9 rounded-md bg-gray-100 border border-gray-200 px-3 text-sm"
      />
    </div>
  );
}