"use client";

import { useState } from "react";
import AssignTaskModal from "./AssignTaskModal";
import UpdateTaskModal from "./Updatetaskmodal ";

export default function WorkProgressPage() {
  const [open, setOpen] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  return (
    <div className="p-6 bg-gray-50 text-gray-800">
      {open && <AssignTaskModal onClose={() => setOpen(false)} />}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Work Progress & Execution</h1>
          <p className="text-sm text-gray-500">
            Track construction milestones and daily progress
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100">
            Export PDF
          </button>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 text-sm rounded-md bg-slate-700 text-white hover:bg-slate-800"
          >
            + Assign Task
          </button>
          <button
            onClick={() => setOpenUpdate(true)}
            className="px-4 py-2 text-sm rounded-md bg-slate-700 text-white hover:bg-slate-800"
          >
            Update Task
          </button>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-medium mb-4">Overall Project Progress</h2>

        {/* Progress Bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 min-h-[14px] bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500"
              style={{ width: "41%" }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">41%</span>
        </div>

        {/* Daily Progress */}
        <h3 className="text-sm font-medium mb-3">Daily Progress</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Completed" value="01" />
          <StatCard title="In Progress" value="02" />
          <StatCard title="Not Started" value="01" />
          <StatCard title="Delayed" value="01" />
        </div>
      </div>

      {openUpdate && (
        <UpdateTaskModal
          onClose={() => setOpenUpdate(false)}
          onSave={(data) => {
            console.log("UPDATED TASK DATA:", data);
          }}
        />
      )}

      {/* Daily Progress Logs */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-gray-800 mb-4">
          Daily Progress Logs
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <LogCard title="Masonry & Plastering" date="Oct 7, 2025" name="Amit Patel" />
          <LogCard title="Structural Work" date="Oct 8, 2025" name="Raj Kumar" />
          <LogCard title="Structural Work" date="Oct 8, 2025" name="Raj Kumar" />
          <LogCard title="Masonry & Plastering" date="Oct 7, 2025" name="Amit Patel" />
          <LogCard title="Structural Work" date="Oct 8, 2025" name="Raj Kumar" />
          <LogCard title="Structural Work" date="Oct 8, 2025" name="Raj Kumar" />
        </div>
      </div>
    </div>
  );
}

/* ───────────────── COMPONENTS ───────────────── */

// ✅ Added explicit prop types
function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <p className="text-xs text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}

// ✅ Added explicit prop types
function LogCard({ title, date, name }: { title: string; date: string; name: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-1">
          {date} • {name}
        </p>
      </div>
      <span className="text-xs font-medium bg-green-100 text-green-600 px-2 py-1 rounded">
        65%
      </span>
    </div>
  );
}