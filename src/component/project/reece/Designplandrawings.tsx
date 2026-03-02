"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Drawing {
  id: string;
  drawingNumber: string;
  title: string;
  category: string;
  floors: number;
  roomDetails: string[];
  revision: string;
  status: "Approved" | "Pending" | "Rejected";
}

interface ApprovalItem {
  id: string;
  drawingNumber: string;
  title: string;
  requestedBy: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

interface RevisionItem {
  id: string;
  drawingNumber: string;
  title: string;
  revision: string;
  date: string;
  changes: string;
}

// ── Sample data ───────────────────────────────────────────────────────────────
const DRAWINGS: Drawing[] = [
  { id: "1", drawingNumber: "ARCH-FL-001", title: "Ground Floor Plan - Main Building", category: "Architectural", floors: 1, roomDetails: ["4 Bedrooms", "1 Kitchen", "+5 more"], revision: "Rev5", status: "Approved" },
  { id: "2", drawingNumber: "ARCH-FL-001", title: "Ground Floor Plan - Main Building", category: "Architectural", floors: 1, roomDetails: ["4 Bedrooms", "1 Kitchen", "+5 more"], revision: "Rev5", status: "Approved" },
  { id: "3", drawingNumber: "ARCH-FL-001", title: "Ground Floor Plan - Main Building", category: "Architectural", floors: 1, roomDetails: ["4 Bedrooms", "1 Kitchen", "+5 more"], revision: "Rev5", status: "Approved" },
  { id: "4", drawingNumber: "ARCH-FL-001", title: "Ground Floor Plan - Main Building", category: "Architectural", floors: 1, roomDetails: ["4 Bedrooms", "1 Kitchen", "+5 more"], revision: "Rev5", status: "Approved" },
  { id: "5", drawingNumber: "ARCH-FL-001", title: "Ground Floor Plan - Main Building", category: "Architectural", floors: 1, roomDetails: ["4 Bedrooms", "1 Kitchen", "+5 more"], revision: "Rev5", status: "Approved" },
  { id: "6", drawingNumber: "ARCH-FL-001", title: "Ground Floor Plan - Main Building", category: "Architectural", floors: 1, roomDetails: ["4 Bedrooms", "1 Kitchen", "+5 more"], revision: "Rev5", status: "Approved" },
  { id: "7", drawingNumber: "ARCH-FL-002", title: "First Floor Plan - Main Building",  category: "Structural",     floors: 2, roomDetails: ["3 Bedrooms", "2 Bathrooms", "+3 more"], revision: "Rev3", status: "Pending" },
  { id: "8", drawingNumber: "ARCH-FL-003", title: "Roof Plan - Main Building",          category: "Architectural", floors: 3, roomDetails: ["Terrace", "Tank Room", "+1 more"],   revision: "Rev2", status: "Rejected" },
];

const APPROVALS: ApprovalItem[] = [
  { id: "1", drawingNumber: "ARCH-FL-007", title: "Basement Plan",        requestedBy: "Ravi Kumar",   date: "Mar 01, 2026", status: "Pending" },
  { id: "2", drawingNumber: "ARCH-FL-008", title: "Section A-A",          requestedBy: "Priya Nair",   date: "Feb 28, 2026", status: "Pending" },
  { id: "3", drawingNumber: "ARCH-FL-009", title: "Elevation - East",     requestedBy: "Arun Sharma",  date: "Feb 27, 2026", status: "Pending" },
  { id: "4", drawingNumber: "ARCH-FL-005", title: "Staircase Detail",     requestedBy: "Deepa Menon",  date: "Feb 25, 2026", status: "Approved" },
  { id: "5", drawingNumber: "ARCH-FL-006", title: "Foundation Layout",    requestedBy: "Suresh Pillai", date: "Feb 24, 2026", status: "Approved" },
];

const REVISIONS: RevisionItem[] = [
  { id: "1", drawingNumber: "ARCH-FL-001", title: "Ground Floor Plan",    revision: "Rev8", date: "Mar 02, 2026", changes: "Updated room dimensions and door positions" },
  { id: "2", drawingNumber: "ARCH-FL-002", title: "First Floor Plan",     revision: "Rev7", date: "Feb 28, 2026", changes: "Added balcony railing details" },
  { id: "3", drawingNumber: "ARCH-FL-003", title: "Roof Plan",            revision: "Rev6", date: "Feb 25, 2026", changes: "Modified parapet wall height" },
  { id: "4", drawingNumber: "ARCH-EL-001", title: "Elevation - North",    revision: "Rev5", date: "Feb 22, 2026", changes: "Facade material updated to stone cladding" },
  { id: "5", drawingNumber: "ARCH-EL-002", title: "Elevation - South",    revision: "Rev4", date: "Feb 20, 2026", changes: "Window sizes revised per client request" },
];

// ── Stat cards ────────────────────────────────────────────────────────────────
function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 flex-1 min-w-0">
      <span className="text-xs text-gray-500">{label}</span>
      <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
    </div>
  );
}

// ── Status badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: "Approved" | "Pending" | "Rejected" }) {
  const map = {
    Approved: "bg-green-100 text-green-700",
    Pending:  "bg-amber-100 text-amber-700",
    Rejected: "bg-red-100 text-red-600",
  };
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${map[status]}`}>
      {status}
    </span>
  );
}

// ── Upload modal ──────────────────────────────────────────────────────────────
function UploadModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ number: "", title: "", category: "Architectural", floors: "", revision: "" });

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900">Upload New Design</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        <div className="space-y-3">
          {[
            { label: "Drawing Number", key: "number", placeholder: "e.g. ARCH-FL-010" },
            { label: "Title", key: "title", placeholder: "e.g. Ground Floor Plan" },
            { label: "Floors", key: "floors", placeholder: "Number of floors", type: "number" },
            { label: "Revision", key: "revision", placeholder: "e.g. Rev1" },
          ].map(f => (
            <div key={f.key}>
              <label className="text-xs font-medium text-gray-700 block mb-1">{f.label}</label>
              <input
                type={f.type ?? "text"}
                value={form[f.key as keyof typeof form]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full h-9 px-3 rounded-lg bg-gray-100 outline-none text-sm"
              />
            </div>
          ))}
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">Category</label>
            <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="w-full h-9 px-3 rounded-lg bg-gray-100 outline-none text-sm">
              {["Architectural", "Structural", "MEP", "Interior", "Landscape"].map(o => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-1">File</label>
            <label className="flex items-center justify-center h-20 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-50 transition">
              <input type="file" className="hidden" accept=".pdf,.dwg,.png,.jpg" />
              <div className="text-center">
                <p className="text-sm text-gray-500">Click to upload</p>
                <p className="text-xs text-gray-400">PDF, DWG, PNG up to 50MB</p>
              </div>
            </label>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 h-9 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onClose} className="flex-1 h-9 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">Upload</button>
        </div>
      </div>
    </div>
  );
}

// ── Filter modal ──────────────────────────────────────────────────────────────
function FilterModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState("All");
  const [category, setCategory] = useState("All");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-semibold text-gray-900">Filters</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Status</label>
            <div className="flex flex-wrap gap-2">
              {["All", "Approved", "Pending", "Rejected"].map(s => (
                <button key={s} onClick={() => setStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${status === s ? "bg-slate-800 text-white border-slate-800" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-700 block mb-2">Category</label>
            <div className="flex flex-wrap gap-2">
              {["All", "Architectural", "Structural", "MEP", "Interior"].map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition ${category === c ? "bg-slate-800 text-white border-slate-800" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 h-9 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Reset</button>
          <button onClick={onClose} className="flex-1 h-9 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700">Apply</button>
        </div>
      </div>
    </div>
  );
}

// ── Drawing Database tab ──────────────────────────────────────────────────────
function DrawingDatabase() {
  const [search, setSearch] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = DRAWINGS.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.drawingNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-5">
        {/* Table header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Drawings Database</h3>
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 h-9 px-4 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload New Design
          </button>
        </div>

        {/* Search + Filter row */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search Drawing......"
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-gray-200 bg-white outline-none text-sm focus:border-gray-400 transition"
            />
          </div>
          <button
            onClick={() => setShowFilter(true)}
            className="h-10 px-4 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Drawing Number", "Title", "Category", "Floors", "Room Details", "Revision", "Status", "Action"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-600 py-3 pr-4 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id} className={`border-b border-gray-50 hover:bg-gray-50/60 transition ${i % 2 === 0 ? "" : ""}`}>
                  <td className="py-3 pr-4 text-xs text-gray-700 whitespace-nowrap">{d.drawingNumber}</td>
                  <td className="py-3 pr-4 text-xs text-gray-800 font-medium max-w-[180px] truncate">{d.title}</td>
                  <td className="py-3 pr-4 text-xs text-gray-600 whitespace-nowrap">{d.category}</td>
                  <td className="py-3 pr-4 text-xs text-gray-600 text-center">{d.floors}</td>
                  <td className="py-3 pr-4">
                    <div className="text-xs text-gray-600 leading-relaxed">
                      {d.roomDetails.map((r, ri) => <div key={ri}>{r}</div>)}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-600 whitespace-nowrap">{d.revision}</td>
                  <td className="py-3 pr-4"><StatusBadge status={d.status} /></td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      {/* Download */}
                      <button className="text-gray-400 hover:text-gray-700 transition" title="Download">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      {/* View */}
                      <button className="text-gray-400 hover:text-gray-700 transition" title="View">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="text-center py-10 text-sm text-gray-400">No drawings found.</div>
          )}
        </div>
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      {showFilter && <FilterModal onClose={() => setShowFilter(false)} />}
    </>
  );
}

// ── Approvals tab ─────────────────────────────────────────────────────────────
function Approvals() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Pending Approvals</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Drawing Number", "Title", "Requested By", "Date", "Status", "Action"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-600 py-3 pr-4 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {APPROVALS.map((a) => (
              <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                <td className="py-3 pr-4 text-xs text-gray-700">{a.drawingNumber}</td>
                <td className="py-3 pr-4 text-xs text-gray-800 font-medium">{a.title}</td>
                <td className="py-3 pr-4 text-xs text-gray-600">{a.requestedBy}</td>
                <td className="py-3 pr-4 text-xs text-gray-500">{a.date}</td>
                <td className="py-3 pr-4"><StatusBadge status={a.status} /></td>
                <td className="py-3">
                  {a.status === "Pending" ? (
                    <div className="flex gap-2">
                      <button className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition">Approve</button>
                      <button className="text-xs px-3 py-1 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition">Reject</button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Revision Tracking tab ─────────────────────────────────────────────────────
function RevisionTracking() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5">
      <h3 className="text-base font-semibold text-gray-900 mb-4">Revision History</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Drawing Number", "Title", "Revision", "Date", "Changes"].map(h => (
                <th key={h} className="text-left text-xs font-semibold text-gray-600 py-3 pr-4 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REVISIONS.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition">
                <td className="py-3 pr-4 text-xs text-gray-700">{r.drawingNumber}</td>
                <td className="py-3 pr-4 text-xs text-gray-800 font-medium">{r.title}</td>
                <td className="py-3 pr-4">
                  <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">{r.revision}</span>
                </td>
                <td className="py-3 pr-4 text-xs text-gray-500 whitespace-nowrap">{r.date}</td>
                <td className="py-3 pr-4 text-xs text-gray-600 max-w-[260px]">{r.changes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DesignPlanDrawings() {
  const [activeTab, setActiveTab] = useState<"database" | "approvals" | "revisions">("database");

  const tabs = [
    { id: "database",  label: "Drawing Database" },
    { id: "approvals", label: "Approvals" },
    { id: "revisions", label: "Revision Tracking" },
  ] as const;

  return (
    <div className="w-full" style={{ fontFamily: "inherit" }}>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Design Plan & Drawings</h1>
        <p className="text-sm text-gray-500 mt-0.5">Manage architectural drawings, plans, and design revisions</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Drawings"    value={284} />
        <StatCard label="Pending Approvals" value={18}  />
        <StatCard label="Approved Drawings" value={242} />
        <StatCard label="Latest Revision"   value="Rev 8" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "database"  && <DrawingDatabase />}
      {activeTab === "approvals" && <Approvals />}
      {activeTab === "revisions" && <RevisionTracking />}
    </div>
  );
}