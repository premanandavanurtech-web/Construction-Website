"use client";
import { useState } from "react";

const REPORTS = [
  {
    date: "Sep 1, 2025",
    status: "In Progress",
    notes: "Started initial land clearing and survey marking.",
    images: [1, 2, 3, 4],
    updatedBy: "Rajesh K",
    labour: { skilled: 2, unskilled: 6 },
    machinery: "JCB Excavator - 1 unit",
    materials: ["Cement - 100 unit , 50 kg", "Bricks - 10000 unit"],
  },
  {
    date: "Sep 2, 2025",
    status: "In Progress",
    notes: "Continued levelling work on the north section.",
    images: [1, 2],
    updatedBy: "Rajesh K",
    labour: { skilled: 3, unskilled: 5 },
    machinery: "JCB Excavator - 1 unit",
    materials: ["Cement - 50 unit"],
  },
  {
    date: "Sep 3, 2025",
    status: "In Progress",
    notes: "Completed east boundary levelling.",
    images: [1, 2, 3],
    updatedBy: "Amit P",
    labour: { skilled: 2, unskilled: 4 },
    machinery: "Bulldozer - 1 unit",
    materials: ["Sand - 200 unit"],
  },
  {
    date: "Sep 4, 2025",
    status: "Completed",
    notes: "Final inspection passed. Site fully levelled.",
    images: [1, 2, 3, 4],
    updatedBy: "Rajesh K",
    labour: { skilled: 2, unskilled: 6 },
    machinery: "JCB Excavator - 1 unit",
    materials: ["Cement - 100 unit , 50 kg", "Bricks - 10000 unit"],
  },
];

const DATES = ["Sep 1, 2025", "Sep 2, 2025", "Sep 3, 2025", "Sep 4, 2025"];

// Image placeholder colors matching screenshot gradient
const IMG_COLORS = ["#2d4a6b", "#2a4566", "#3a5a7c", "#1e3a56"];
type Props = {
  onClose: () => void;
};
export default function SubtaskReportModal({ onClose }:Props) {
  const [activeDate, setActiveDate] = useState(0);
  const report = REPORTS[activeDate];

  const prev = () => setActiveDate((d) => Math.max(0, d - 1));
  const next = () => setActiveDate((d) => Math.min(REPORTS.length - 1, d + 1));

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.4)", zIndex: 80, fontFamily: "'Inter',sans-serif" }}
    >
      <div className="relative w-[620px] max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* ── Header ── */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Site Levelling</h2>
              <p className="text-sm text-gray-400 mt-0.5">Sep 1, 2025–Sep 4, 2025</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none mt-1"
            >
              ×
            </button>
          </div>
        </div>

        {/* ── Assigned to / Status banner ── */}
        <div className="mx-6 mb-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-gray-400">Assigned to:</span>
          <span className="text-sm font-medium text-green-600">Completed</span>
        </div>

        {/* ── Date pills ── */}
        <div className="px-6 mb-5">
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              disabled={activeDate === 0}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 flex-shrink-0"
            >
              ‹
            </button>
            <div className="flex gap-2 flex-1 overflow-x-auto no-scrollbar">
              {DATES.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setActiveDate(i)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeDate === i
                      ? "bg-slate-800 text-white"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={next}
              disabled={activeDate === REPORTS.length - 1}
              className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 flex-shrink-0"
            >
              ›
            </button>
          </div>
        </div>

        {/* ── Report Date + Status + Comments ── */}
        <div className="px-6 mb-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-gray-400">Report Date</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">{report.date}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Status</p>
              <p className={`text-sm font-semibold mt-0.5 ${
                report.status === "Completed" ? "text-green-500" : "text-amber-500"
              }`}>
                {report.status}
              </p>
            </div>
          </div>
          <div className="mt-3 flex justify-end">
            <button className="rounded-lg bg-slate-800 px-4 py-2 text-xs font-medium text-white hover:bg-slate-700">
              Comments (2)
            </button>
          </div>
        </div>

        {/* ── Notes ── */}
        <div className="px-6 mb-4">
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">Notes</p>
            <p className="text-sm text-gray-700">{report.notes}</p>
          </div>
        </div>

        {/* ── Images ── */}
        <div className="px-6 mb-5">
          <p className="text-xs text-gray-500 mb-2">Images</p>
          <div className="grid grid-cols-4 gap-3">
            {report.images.map((_, i) => (
              <div
                key={i}
                className="rounded-xl flex items-center justify-center"
                style={{ background: IMG_COLORS[i % IMG_COLORS.length], aspectRatio: "1" }}
              >
                {/* Image placeholder icon */}
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                  <circle cx="8.5" cy="8.5" r="1.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>
                  <path d="M21 15l-5-5L5 21" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            ))}
          </div>
        </div>

        {/* ── Info grid ── */}
        <div className="px-6 mb-5 grid grid-cols-2 gap-3">
          {/* Updated By */}
          <div className="rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">Updated By</p>
            <p className="text-sm font-semibold text-gray-900">{report.updatedBy}</p>
          </div>

          {/* Labour Used */}
          <div className="rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-2">Labour Used</p>
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-gray-400">Skilled</p>
                <p className="text-lg font-bold text-gray-900">{report.labour.skilled}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Unskilled</p>
                <p className="text-lg font-bold text-gray-900">{report.labour.unskilled}</p>
              </div>
            </div>
          </div>

          {/* Machinery Used */}
          <div className="rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">Machinery Used</p>
            <p className="text-sm text-gray-800">{report.machinery}</p>
          </div>

          {/* Material Used */}
          <div className="rounded-xl border border-gray-100 px-4 py-3">
            <p className="text-xs text-gray-400 mb-1">Material Used</p>
            {report.materials.map((m, i) => (
              <p key={i} className="text-sm text-gray-800">{m}</p>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-6 pb-5 flex items-center justify-between border-t border-gray-100 pt-4">
          <p className="text-xs text-gray-400">
            Showing {activeDate + 1} of {REPORTS.length} reports
          </p>
          <div className="flex gap-2">
            <button
              onClick={prev}
              disabled={activeDate === 0}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              ‹ Previous
            </button>
            <button
              onClick={next}
              disabled={activeDate === REPORTS.length - 1}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors"
            >
              Next ›
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}