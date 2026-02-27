"use client";

import { useEffect, useState } from "react";
import { Search, Eye } from "lucide-react";
import AddSubTaskModal from "./Addsubtaskmodal ";
import { Task, SubTask } from "@/src/ts/task";

const TASKS_KEY = "tasks_list";

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [openSubTask, setOpenSubTask] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  /* ---------------- LOAD TASKS ---------------- */
  useEffect(() => {
    const load = () => {
      const saved = localStorage.getItem(TASKS_KEY);
      try {
        const parsed: Task[] = saved ? JSON.parse(saved) : [];
        setTasks(parsed);
      } catch {
        setTasks([]);
      }
    };

    load();
    window.addEventListener("storage", load);
    window.addEventListener("tasks-updated", load);

    return () => {
      window.removeEventListener("storage", load);
      window.removeEventListener("tasks-updated", load);
    };
  }, []);

  /* ---------------- ADD SUBTASK ---------------- */
  const addSubtaskToTask = (taskId: number, subtask: SubTask) => {
    const updatedTasks: Task[] = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: [...task.subtasks, subtask],
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    window.dispatchEvent(new Event("tasks-updated"));
  };

  return (
    <div className="p-6 text-black bg-gray-50 min-h-screen">
      <h2 className="text-xl font-semibold mb-4">Tasks</h2>

      {/* ---------------- SEARCH ---------------- */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            placeholder="Search By Tasks...."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />
        </div>
        <button className="px-4 py-2 border rounded-lg text-sm">
          Filters
        </button>
      </div>

      {/* ---------------- SUBTASK MODAL ---------------- */}
      {openSubTask && activeTaskId !== null && (
        <AddSubTaskModal
          onClose={() => {
            setOpenSubTask(false);
            setActiveTaskId(null);
          }}
          onAddSubtask={(subtask: SubTask) => { // ✅ consistent casing, correct type
            addSubtaskToTask(activeTaskId, subtask);
            setOpenSubTask(false);
            setActiveTaskId(null);
          }}
        />
      )}

      {/* ---------------- TASK LIST ---------------- */}
      <div className="space-y-6">
        {tasks.map((task) => {
          const completed = task.subtasks.filter(
            (s) => s.status === "Completed"
          ).length;
          const total = task.subtasks.length;
          const progress =
            total > 0 ? Math.round((completed / total) * 100) : 0;

          return (
            <div key={task.id} className="bg-white border rounded-xl p-5">
              {/* Header */}
              <div className="flex justify-between mb-4">
                <div>
                  <h3 className="font-semibold">{task.title}</h3>
                  <p className="text-xs text-gray-500">
                    {task.startDate} - {task.dueDate}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded">
                    In Progress
                  </span>
                  <button
                    onClick={() => {
                      setActiveTaskId(task.id);
                      setOpenSubTask(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#344960] text-white"
                  >
                    Add Subtask
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-gray-200 rounded mb-4">
                <div
                  className="h-2 bg-green-500 rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Subtask Table */}
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">Sub Task</th>
                    <th className="px-4 py-2 text-left">Start Date</th>
                    <th className="px-4 py-2 text-left">End Date</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Assigned To</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {task.subtasks.length > 0 ? (
                    task.subtasks.map((st, i) => (
                      <tr key={i}>
                        <td className="px-4 py-2">{st.title}</td>
                        <td className="px-4 py-2">{st.startDate || "-"}</td>
                        <td className="px-4 py-2">{st.dueDate || "-"}</td>
                        <td className="px-4 py-2">
                          <span className="px-2 py-0.5 text-xs rounded bg-green-100 text-green-700">
                            {st.status}
                          </span>
                        </td>
                        <td className="px-4 py-2">{st.assignedTo || "-"}</td>
                        <td className="px-4 py-2 text-center">
                          <Eye className="w-4 h-4 inline" />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-3 text-center text-gray-400"
                      >
                        No subtasks added
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </div>
  );
}