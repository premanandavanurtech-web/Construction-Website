"use client";
import { useState, useRef } from "react";
import AddMaterialUsageModal from "./Addmaterialusagemodal";
import AddManPowerModal from "./Addmanpowermodal";
import AddMachineUsageModal from "./Addmachineusagemodal ";
import { setWithExpiry } from "@/src/utils/localStorageWithExpiry";
type Props = {
  onClose: () => void;
  onSave: (data: any) => void;
};

export default function UpdateTaskModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState<{
    taskName: string;
    status: string;
    delay: string;
    reasonForDelay: string;
    image: File | null;
  }>({
    taskName: "",
    status: "",
    delay: "",
    reasonForDelay: "",
    image: null,
  });

  const [dragOver, setDragOver]         = useState(false);
  const [showMaterial, setShowMaterial] = useState(false);
  const [showManPower, setShowManPower] = useState(false);
  const [showMachine, setShowMachine]   = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const set = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleFile = (file: File | null) => {
    if (!file) return;
    setForm((p) => ({ ...p, image: file }));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

 const handleSave = () => {
  setWithExpiry("task_update_draft", {
    update: form,
  });

  onSave?.(form);
  onClose?.();
};

  return (
    <>
      <div
        className="fixed inset-0 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.35)", zIndex: 50, fontFamily: "'Inter',sans-serif" }}
      >
        <div className="relative w-[420px] max-h-[90vh] overflow-y-auto rounded-2xl bg-white px-8 py-7 shadow-2xl">

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-xl text-gray-400 hover:text-gray-600 leading-none"
          >
            ×
          </button>

          <h2 className="text-xl font-bold text-gray-900 mb-6">Update Task</h2>

          {/* Task Name */}
          <Field label="Task Name/Subtask Name">
            <input
              name="taskName"
              value={form.taskName}
              onChange={set}
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
            />
          </Field>

          {/* Status */}
          <Field label="Status">
            <div className="relative">
              <select
                name="status"
                value={form.status}
                onChange={set}
                className="w-full appearance-none rounded-lg bg-gray-100 px-3 py-2.5 pr-9 text-sm text-gray-800 outline-none"
              >
                <option value=""></option>
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Not Started">Not Started</option>
                <option value="Delayed">Delayed</option>
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">▾</span>
            </div>
          </Field>

          {/* Delay */}
          <Field label="Delay">
            <input
              name="delay"
              value={form.delay}
              onChange={set}
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
            />
          </Field>

          {/* Reason For Delay */}
          <Field label="Reason For Delay">
            <input
              name="reasonForDelay"
              value={form.reasonForDelay}
              onChange={set}
              className="w-full rounded-lg bg-gray-100 px-3 py-2.5 text-sm text-gray-800 outline-none"
            />
          </Field>

          {/* Add Image */}
          <Field label="Add Image">
            <div
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed cursor-pointer py-6 transition-colors ${
                dragOver ? "border-slate-400 bg-slate-50" : "border-gray-200 bg-white"
              }`}
            >
              {form.image ? (
                <p className="text-xs text-green-600 font-medium">{form.image.name}</p>
              ) : (
                <>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <p className="text-xs text-gray-700">
                    <span className="font-semibold">Upload A File</span> Or Drag And Drop
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Png,Jpg,Gif Upto 50MB</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".png,.jpg,.jpeg,.gif"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
            />
          </Field>

          {/* Tag buttons */}
          <div className="flex gap-2 mt-1 mb-6">
            <button
              onClick={() => setShowMaterial(true)}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600 transition-colors"
            >
              + Material Usage
            </button>
            <button
              onClick={() => setShowManPower(true)}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600 transition-colors"
            >
              + Man Power
            </button>
            <button
              onClick={() => setShowMachine(true)}
              className="rounded-lg bg-slate-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-600 transition-colors"
            >
              + Machinery
            </button>
          </div>

          {/* Footer */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 bg-white py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 rounded-xl bg-slate-800 py-2.5 text-sm font-medium text-white hover:bg-slate-700 transition-colors"
            >
              Save
            </button>
          </div>

        </div>
      </div>

      {/* Add Material Usage Modal */}
      {showMaterial && (
        <AddMaterialUsageModal
          onClose={() => setShowMaterial(false)}
          onSave={(materials) => {
            console.log("Materials saved:", materials);
            setShowMaterial(false);
          }}
        />
      )}

      {/* Add Man Power Modal */}
      {showManPower && (
        <AddManPowerModal
          onClose={() => setShowManPower(false)}
          onSave={(data) => {
            console.log("Man power saved:", data);
            setShowManPower(false);
          }}
        />
      )}

      {/* Add Machine Usage Modal */}
      {showMachine && (
        <AddMachineUsageModal
          onClose={() => setShowMachine(false)}
          onSave={(data) => {
            console.log("Machine usage saved:", data);
            setShowMachine(false);
          }}
        />
      )}
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1.5 block text-xs font-medium text-gray-700">{label}</label>
      {children}
    </div>
  );
}