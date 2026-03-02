"use client";

import { useState } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// STORAGE
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "boq_v3";

function load(): BOQState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { tabs: [] };
}
function persist(s: BOQState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

// A column definition — user creates these manually per tab
interface Column {
  id: string;
  label: string;       // e.g. "Item No", "Name & Description"
  type: "text" | "number" | "currency"; // how to render the cell
}

// A cell value map  colId -> value
type RowData = Record<string, string>;

interface SubRow {
  id: string;
  data: RowData;
}

interface Row {
  id: string;
  data: RowData;
  expanded: boolean;
  subRows: SubRow[];
}

interface Tab {
  id: string;
  label: string;
  color: string;
  columns: Column[];
  rows: Row[];
}

interface BOQState {
  tabs: Tab[];
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 10);

const COLORS = [
  { key: "slate",  border: "border-slate-700", text: "text-slate-800",  badge: "bg-slate-100 text-slate-700",   dot: "#475569" },
  { key: "blue",   border: "border-blue-600",  text: "text-blue-700",   badge: "bg-blue-100 text-blue-700",     dot: "#3b82f6" },
  { key: "green",  border: "border-green-600", text: "text-green-700",  badge: "bg-green-100 text-green-700",   dot: "#22c55e" },
  { key: "amber",  border: "border-amber-500", text: "text-amber-700",  badge: "bg-amber-100 text-amber-700",   dot: "#f59e0b" },
  { key: "purple", border: "border-purple-600",text: "text-purple-700", badge: "bg-purple-100 text-purple-700", dot: "#a855f7" },
  { key: "rose",   border: "border-rose-500",  text: "text-rose-600",   badge: "bg-rose-100 text-rose-600",     dot: "#f43f5e" },
  { key: "cyan",   border: "border-cyan-500",  text: "text-cyan-700",   badge: "bg-cyan-100 text-cyan-700",     dot: "#06b6d4" },
  { key: "orange", border: "border-orange-500",text: "text-orange-700", badge: "bg-orange-100 text-orange-700", dot: "#f97316" },
];
const getColor = (k: string) => COLORS.find(c => c.key === k) ?? COLORS[0];

const inp  = "w-full h-9 px-3 rounded-xl bg-gray-100 outline-none text-sm focus:ring-1 focus:ring-slate-300 transition";
const sel  = "w-full h-9 px-3 rounded-xl bg-gray-100 outline-none text-sm";
const btnP = "flex-1 h-10 bg-slate-800 text-white rounded-xl text-sm hover:bg-slate-700 disabled:opacity-40 transition font-medium";
const btnS = "flex-1 h-10 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition";

// ─────────────────────────────────────────────────────────────────────────────
// MODAL SHELL
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ title, subtitle, onClose, children }: {
  title: string; subtitle?: string; onClose: () => void; children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between px-6 pt-6 pb-3 flex-shrink-0">
          <div>
            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl ml-4">✕</button>
        </div>
        <div className="px-6 pb-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <label className="text-xs font-medium text-gray-700 block mb-1">{label}</label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CREATE CATEGORY MODAL
// ─────────────────────────────────────────────────────────────────────────────
function CreateCategoryModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (label: string, color: string) => void;
}) {
  const [label, setLabel] = useState("");
  const [color, setColor] = useState("slate");

  const submit = () => {
    if (!label.trim()) return;
    onAdd(label.trim(), color);
    onClose();
  };

  const c = getColor(color);

  return (
    <Modal title="Create Category" subtitle="A new tab will be added to your BOQ" onClose={onClose}>
      <div className="space-y-0">
        <Field label="Category Name *">
          <input autoFocus value={label} onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="e.g. BOQ Items & Scope, Civil Works, MEP..."
            className={inp} />
        </Field>

        <Field label="Tab Color">
          <div className="flex flex-wrap gap-2 mt-1 mb-2">
            {COLORS.map(c => (
              <button key={c.key} onClick={() => setColor(c.key)} title={c.key}
                className={`w-7 h-7 rounded-full border-2 transition-all ${color === c.key ? "border-gray-800 scale-125" : "border-transparent"}`}
                style={{ backgroundColor: c.dot }} />
            ))}
          </div>
          {label && (
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${c.badge}`}>{label}</span>
          )}
        </Field>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className={btnS}>Cancel</button>
          <button onClick={submit} disabled={!label.trim()} className={btnP}>Create Category</button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD COLUMN MODAL
// ─────────────────────────────────────────────────────────────────────────────
function AddColumnModal({ onClose, onAdd }: {
  onClose: () => void;
  onAdd: (col: Omit<Column, "id">) => void;
}) {
  const [label, setLabel] = useState("");
  const [type, setType]   = useState<Column["type"]>("text");

  const submit = () => {
    if (!label.trim()) return;
    onAdd({ label: label.trim(), type });
    onClose();
  };

  // Preset column names for quick pick
  const presets = ["Item No", "Name & Description", "Code", "IS Standard", "Unit", "Qty", "Rate", "Item Type", "Amount", "Remarks"];

  return (
    <Modal title="Add Column" subtitle="Add a column to this category's table" onClose={onClose}>
      <div className="space-y-0">
        <Field label="Column Name *">
          <input autoFocus value={label} onChange={e => setLabel(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
            placeholder="e.g. Item No, Name, Rate..."
            className={inp} />
        </Field>

        {/* Quick pick presets */}
        <div className="mb-3">
          <p className="text-xs text-gray-400 mb-1.5">Quick pick:</p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map(p => (
              <button key={p} onClick={() => setLabel(p)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition ${label === p ? "bg-slate-800 text-white border-slate-800" : "border-gray-200 text-gray-600 hover:border-gray-400"}`}>
                {p}
              </button>
            ))}
          </div>
        </div>

        <Field label="Data Type">
          <select value={type} onChange={e => setType(e.target.value as Column["type"])} className={sel}>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="currency">Currency (₹)</option>
          </select>
        </Field>

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className={btnS}>Cancel</button>
          <button onClick={submit} disabled={!label.trim()} className={btnP}>Add Column</button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ADD ROW MODAL (item or sub-item)
// ─────────────────────────────────────────────────────────────────────────────
function AddRowModal({ title, subtitle, columns, onClose, onAdd }: {
  title: string;
  subtitle?: string;
  columns: Column[];
  onClose: () => void;
  onAdd: (data: RowData) => void;
}) {
  const [data, setData] = useState<RowData>({});
  const set = (colId: string, val: string) => setData(p => ({ ...p, [colId]: val }));

  const submit = () => {
    onAdd(data);
    onClose();
  };

  if (columns.length === 0) {
    return (
      <Modal title={title} subtitle={subtitle} onClose={onClose}>
        <p className="text-sm text-gray-500 py-4">No columns defined yet. Add columns first before adding rows.</p>
        <button onClick={onClose} className="w-full h-10 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">Close</button>
      </Modal>
    );
  }

  return (
    <Modal title={title} subtitle={subtitle} onClose={onClose}>
      <div className="space-y-0">
        {columns.map(col => (
          <Field key={col.id} label={col.label}>
            {col.type === "number" || col.type === "currency" ? (
              <div className="relative">
                {col.type === "currency" && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">₹</span>
                )}
                <input type="number" value={data[col.id] ?? ""}
                  onChange={e => set(col.id, e.target.value)}
                  placeholder="0"
                  className={col.type === "currency" ? inp.replace("px-3", "pl-7 pr-3") : inp} />
              </div>
            ) : (
              <input value={data[col.id] ?? ""}
                onChange={e => set(col.id, e.target.value)}
                placeholder={`Enter ${col.label.toLowerCase()}...`}
                className={inp} />
            )}
          </Field>
        ))}

        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className={btnS}>Cancel</button>
          <button onClick={submit} className={btnP}>Add</button>
        </div>
      </div>
    </Modal>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORMAT CELL VALUE
// ─────────────────────────────────────────────────────────────────────────────
function CellValue({ col, value }: { col: Column; value?: string }) {
  if (!value && value !== "0") return <span className="text-gray-300">—</span>;
  if (col.type === "currency") {
    const n = parseFloat(value) || 0;
    return <span>{"₹" + n.toLocaleString("en-IN")}</span>;
  }
  if (col.type === "number") return <span>{value}</span>;
  return <span>{value}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB CONTENT
// ─────────────────────────────────────────────────────────────────────────────
function TabContent({ tab, state, setState }: {
  tab: Tab;
  state: BOQState;
  setState: (s: BOQState) => void;
}) {
  const [showAddCol, setShowAddCol]   = useState(false);
  const [showAddRow, setShowAddRow]   = useState(false);
  const [addSubFor, setAddSubFor]     = useState<string | null>(null); // rowId

  const updateTab = (updated: Tab) => {
    const s = { ...state, tabs: state.tabs.map(t => t.id === updated.id ? updated : t) };
    setState(s);
  };

  // ── columns ──
  const addColumn = (col: Omit<Column, "id">) => {
    updateTab({ ...tab, columns: [...tab.columns, { ...col, id: uid() }] });
  };

  const delColumn = (colId: string) => {
    if (!confirm("Delete this column? All data in this column will be lost.")) return;
    updateTab({ ...tab, columns: tab.columns.filter(c => c.id !== colId) });
  };

  // ── rows ──
  const addRow = (data: RowData) => {
    updateTab({ ...tab, rows: [...tab.rows, { id: uid(), data, expanded: true, subRows: [] }] });
  };

  const delRow = (rowId: string) => {
    if (!confirm("Delete this item and all its sub-items?")) return;
    updateTab({ ...tab, rows: tab.rows.filter(r => r.id !== rowId) });
  };

  const toggleRow = (rowId: string) => {
    updateTab({ ...tab, rows: tab.rows.map(r => r.id === rowId ? { ...r, expanded: !r.expanded } : r) });
  };

  // ── sub-rows ──
  const addSubRow = (rowId: string, data: RowData) => {
    updateTab({
      ...tab,
      rows: tab.rows.map(r =>
        r.id === rowId ? { ...r, subRows: [...r.subRows, { id: uid(), data }] } : r
      ),
    });
  };

  const delSubRow = (rowId: string, subId: string) => {
    updateTab({
      ...tab,
      rows: tab.rows.map(r =>
        r.id === rowId ? { ...r, subRows: r.subRows.filter(s => s.id !== subId) } : r
      ),
    });
  };

  const activeRow = addSubFor ? tab.rows.find(r => r.id === addSubFor) : null;
  const cc = getColor(tab.color);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">
            {tab.rows.length} item{tab.rows.length !== 1 ? "s" : ""} · {tab.columns.length} column{tab.columns.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowAddCol(true)}
            className="h-9 px-3 border border-gray-200 text-sm text-gray-700 rounded-xl hover:bg-gray-50 transition flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Column
          </button>
          <button onClick={() => setShowAddRow(true)}
            className="h-9 px-4 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 transition flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            + Add Item
          </button>
        </div>
      </div>

      {/* No columns yet */}
      {tab.columns.length === 0 && (
        <div className="border-2 border-dashed border-gray-200 rounded-2xl py-12 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 text-xl">🗂️</div>
          <p className="text-sm font-semibold text-gray-700 mb-1">No columns yet</p>
          <p className="text-xs text-gray-400 mb-4">Click "Add Column" to define your table columns (e.g. Item No, Name, Rate...)</p>
          <button onClick={() => setShowAddCol(true)}
            className="inline-flex items-center gap-2 h-9 px-5 border border-gray-300 text-sm text-gray-700 rounded-xl hover:bg-gray-50">
            + Add First Column
          </button>
        </div>
      )}

      {/* Table */}
      {tab.columns.length > 0 && (
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {/* expand toggle col */}
                  <th className="w-9 py-3 px-3" />
                  {tab.columns.map(col => (
                    <th key={col.id} className="text-left py-3 pr-4 whitespace-nowrap group">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-gray-600">{col.label}</span>
                        <button onClick={() => delColumn(col.id)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition text-xs leading-none"
                          title="Remove column">✕</button>
                      </div>
                    </th>
                  ))}
                  {/* action col */}
                  <th className="w-8 py-3 pr-3" />
                </tr>
              </thead>

              <tbody>
                {tab.rows.length === 0 && (
                  <tr>
                    <td colSpan={tab.columns.length + 2} className="py-10 text-center text-xs text-gray-400 italic">
                      No items yet —{" "}
                      <button onClick={() => setShowAddRow(true)} className="text-blue-500 hover:underline">add one</button>
                    </td>
                  </tr>
                )}

                {tab.rows.map((row, ri) => (
                  <>
                    {/* ── ITEM ROW ── */}
                    <tr key={`row-${row.id}`} className="bg-slate-50/70 border-b border-gray-100 font-medium">
                      <td className="px-3 py-3">
                        <button onClick={() => toggleRow(row.id)}
                          className="text-gray-500 hover:text-gray-800 font-bold text-sm w-5 h-5 flex items-center justify-center">
                          {row.expanded ? "▾" : "▸"}
                        </button>
                      </td>

                      {tab.columns.map((col, ci) => (
                        <td key={col.id} className="py-3 pr-4">
                          {ci === 0 ? (
                            // First column gets the name + sub-item controls
                            <div>
                              <p className="text-xs font-bold text-gray-900">
                                <CellValue col={col} value={row.data[col.id]} />
                              </p>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">
                                  {row.subRows.length} sub-item{row.subRows.length !== 1 ? "s" : ""}
                                </span>
                                <button onClick={() => setAddSubFor(row.id)}
                                  className="text-[10px] border border-slate-300 text-slate-600 px-2 py-0.5 rounded-full hover:bg-slate-50 transition">
                                  + Sub-item
                                </button>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-800">
                              <CellValue col={col} value={row.data[col.id]} />
                            </span>
                          )}
                        </td>
                      ))}

                      <td className="py-3 pr-3 text-right">
                        <button onClick={() => delRow(row.id)}
                          className="text-gray-300 hover:text-red-500 transition text-sm">✕</button>
                      </td>
                    </tr>

                    {/* ── SUB-ROWS ── */}
                    {row.expanded && row.subRows.map((sub, si) => (
                      <tr key={`sub-${sub.id}`} className="border-b border-gray-50 hover:bg-blue-50/20 transition">
                        <td className="px-3 py-2.5 pl-10">
                          <input type="checkbox" className="w-3.5 h-3.5 accent-slate-800" />
                        </td>
                        {tab.columns.map(col => (
                          <td key={col.id} className="py-2.5 pr-4">
                            <span className="text-xs text-gray-700">
                              <CellValue col={col} value={sub.data[col.id]} />
                            </span>
                          </td>
                        ))}
                        <td className="py-2.5 pr-3 text-right">
                          <button onClick={() => delSubRow(row.id, sub.id)}
                            className="text-gray-300 hover:text-red-500 transition text-sm">✕</button>
                        </td>
                      </tr>
                    ))}

                    {/* empty sub hint */}
                    {row.expanded && row.subRows.length === 0 && (
                      <tr key={`empty-sub-${row.id}`} className="border-b border-gray-50">
                        <td colSpan={tab.columns.length + 2} className="py-2.5 pl-12 text-xs text-gray-400 italic">
                          No sub-items —{" "}
                          <button onClick={() => setAddSubFor(row.id)} className="text-blue-500 hover:underline">add one</button>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddCol && (
        <AddColumnModal onClose={() => setShowAddCol(false)} onAdd={addColumn} />
      )}
      {showAddRow && (
        <AddRowModal
          title="Add Item"
          subtitle={`Category: ${tab.label}`}
          columns={tab.columns}
          onClose={() => setShowAddRow(false)}
          onAdd={addRow}
        />
      )}
      {addSubFor && activeRow && (
        <AddRowModal
          title="Add Sub-item"
          subtitle={`Item ${tab.rows.findIndex(r => r.id === addSubFor) + 1}`}
          columns={tab.columns}
          onClose={() => setAddSubFor(null)}
          onAdd={data => addSubRow(addSubFor, data)}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
export default function BOQ() {
  const [state, setRaw] = useState<BOQState>(() => load());
  const [activeTab, setActiveTab] = useState<string | null>(() => {
    const s = load();
    return s.tabs.length > 0 ? s.tabs[0].id : null;
  });
  const [showCreateCat, setShowCreateCat] = useState(false);

  const setState = (s: BOQState) => { setRaw(s); persist(s); };

  const createCategory = (label: string, color: string) => {
    const t: Tab = { id: uid(), label, color, columns: [], rows: [] };
    const s = { ...state, tabs: [...state.tabs, t] };
    setState(s);
    setActiveTab(t.id);
  };

  const currentTab = state.tabs.find(t => t.id === activeTab) ?? null;

  return (
    <div className="w-full bg-white min-h-screen" style={{ fontFamily: "inherit" }}>

      {/* ── HEADER ── */}
      <div className="border-b border-gray-200 px-6 pt-6 pb-0">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Bill of Quantities (BOQ)</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage material quantities, rates, and vendor information</p>
          </div>

          {/* Export BOQ + Create Category — side by side */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCreateCat(true)}
              className="h-9 px-4 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700 transition flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Category
            </button>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
                const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "BOQ.json"; a.click();
              }}
              className="h-9 px-4 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition">
              Export BOQ
            </button>
          </div>
        </div>

        {/* ── Stat cards — one per tab ── */}
        {state.tabs.length > 0 && (
          <div className="flex gap-3 mb-5 flex-wrap">
            {state.tabs.map(t => {
              const cc = getColor(t.color);
              return (
                <div key={t.id} className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex flex-col gap-0.5 min-w-[120px]">
                  <span className={`text-[10px] font-semibold ${cc.text}`}>{t.label}</span>
                  <span className="text-sm font-bold text-gray-900">{t.rows.length} items · {t.columns.length} cols</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB BAR ── */}
        <div className="flex items-end gap-0 overflow-x-auto">
          {state.tabs.map(t => {
            const isActive = t.id === activeTab;
            const cc = getColor(t.color);
            return (
              <button key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors -mb-px ${
                  isActive
                    ? `${cc.border} ${cc.text}`
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-6 py-6">

        {/* No categories at all */}
        {state.tabs.length === 0 && (
          <div className="border-2 border-dashed border-gray-200 rounded-2xl py-24 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">📋</div>
            <p className="text-base font-semibold text-gray-700 mb-2">No categories yet</p>
            <p className="text-sm text-gray-400 mb-6 max-w-md mx-auto">
              Click <strong>"Create Category"</strong> in the top-right to add your first category tab.<br />
              Then add columns (like "Item No", "Name", "Rate") and start adding items.
            </p>
            <button onClick={() => setShowCreateCat(true)}
              className="inline-flex items-center gap-2 h-10 px-6 bg-slate-800 text-white text-sm rounded-xl hover:bg-slate-700">
              + Create First Category
            </button>
          </div>
        )}

        {/* Active tab content with active tab badge */}
        {currentTab && (
          <>
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-sm font-semibold px-3 py-1.5 rounded-lg ${getColor(currentTab.color).badge}`}>
                {currentTab.label}
              </span>
              <span className="text-xs text-gray-400">
                {currentTab.rows.length} item{currentTab.rows.length !== 1 ? "s" : ""} · {currentTab.columns.length} column{currentTab.columns.length !== 1 ? "s" : ""}
              </span>
            </div>
            <TabContent key={currentTab.id} tab={currentTab} state={state} setState={setState} />
          </>
        )}
      </div>

      {showCreateCat && (
        <CreateCategoryModal onClose={() => setShowCreateCat(false)} onAdd={createCategory} />
      )}
    </div>
  );
}