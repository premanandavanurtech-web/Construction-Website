"use client";
import { useEffect, useState } from "react";
import AddSubTaskModal from "./Addsubtaskmodal ";
import {
  setWithExpiry,
  getWithExpiry,
  removeWithExpiry,
} from "@/src/utils/localStorageWithExpiry";

const TASK_STORAGE_KEY = "assign_task_draft";

// ✅ onCreateTask is required — called with the full task object on submit
export default function AssignTaskModal({
  onClose,
  
}: {
  onClose: () => void;

}) {
  const [openSubTask, setOpenSubTask] = useState(false);

  const [form, setForm] = useState({
    title: "",
    project: "",
    location: "",
    category: "",
    assignedTo: "",
    priority: "",
    startDate: "",
    dueDate: "",
    subtasks: [],
  });

  /* Load task draft */
  useEffect(() => {
    const saved = getWithExpiry(TASK_STORAGE_KEY);
    if (saved) setForm(saved);
  }, []);

  /* Save task draft */
  useEffect(() => {
    setWithExpiry(TASK_STORAGE_KEY, form);
  }, [form]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* Receive subtask from child */
  const handleAddSubtask = (subtask: any) => {
    setForm((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, subtask],
    }));
    setOpenSubTask(false);
  };

const handleCreateTask = () => {
  if (!form.title.trim()) {
    alert("Task title is required");
    return;
  }

  let existingTasks: any[] = [];

  try {
    const raw = localStorage.getItem("tasks_list");
    const parsed = raw ? JSON.parse(raw) : [];
    existingTasks = Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    existingTasks = [];
  }

  const newTask = {
    ...form,
    id: Date.now(),
  };

  localStorage.setItem(
    "tasks_list",
    JSON.stringify([...existingTasks, newTask])
  );

  console.log("TASK SAVED:", newTask);
  localStorage.setItem("tasks_list", JSON.stringify([...existingTasks, newTask]));
  
  window.dispatchEvent(new Event("tasks-updated")); // ← ADD THIS
  
  removeWithExpiry(TASK_STORAGE_KEY);
  onClose();
 
};
 
  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative bg-white w-full max-w-md rounded-xl shadow-lg p-6 z-50 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Assign New Task</h2>
            <button onClick={onClose} className="text-xl text-gray-400">×</button>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <Input label="Task Title *" name="title" value={form.title} onChange={handleChange} />
            <Input label="Project Name" name="project" value={form.project} onChange={handleChange} />
            <Input label="Location/Floor/Room" name="location" value={form.location} onChange={handleChange} />
            <Input label="Task Category" name="category" value={form.category} onChange={handleChange} />
            <Input label="Assigned To" name="assignedTo" value={form.assignedTo} onChange={handleChange} />
            <Input label="Priority" name="priority" value={form.priority} onChange={handleChange} />
            <Input label="Start Date" type="date" name="startDate" value={form.startDate} onChange={handleChange} />
            <Input label="Due Date" type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />

            {/* Subtasks Section */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-600">Subtasks</label>
                <button
                  onClick={() => setOpenSubTask(true)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  + Add Subtask
                </button>
              </div>

              {form.subtasks.length > 0 && (
                <ul className="space-y-1 text-sm">
                  {form.subtasks.map((st: any, index: number) => (
                    <li
                      key={index}
                      className="bg-gray-100 border border-gray-200 rounded px-2 py-1 flex justify-between"
                    >
                      <span>{st.title}</span>
                      <span className={`text-xs font-medium ${st.status === "Completed" ? "text-green-600" : "text-amber-500"}`}>
                        {st.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between mt-6">
            <button className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50">
              Load Templates
            </button>
            <button
              onClick={handleCreateTask}
              className="px-4 py-2 text-sm rounded-md bg-slate-700 text-white hover:bg-slate-800"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>

      {openSubTask && (
        <AddSubTaskModal
          onClose={() => setOpenSubTask(false)}
          onAddSubtask={handleAddSubtask}
        />
      )}
    </>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-xs text-gray-600 mb-1 block">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full h-9 rounded-md bg-gray-100 border border-gray-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
      />
    </div>
  );
}