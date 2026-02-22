"use client";

import { useEffect, useState } from "react";

/* ---------- Types ---------- */

type StockHistory = {
  timestamp: number;
  quantityUsed: number;
  task: string;
  approvedBy: string;
  remarks: string;
};

type StockItem = {
  name: string;
  current: string;   // string for input
  unit: string;
  category: string;
  location: string;
  min: string;       // string for input
  vendor: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  history?: StockHistory[];
};

type Props = {
  open: boolean;
  projectId: string;
  item: StockItem | null;
  onClose: () => void;
};

const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;

/* ---------- Component ---------- */

export default function EditStockModal({
  open,
  projectId,
  item,
  onClose,
}: Props) {
  const [form, setForm] = useState<StockItem>({
    name: "",
    current: "",
    unit: "",
    category: "",
    location: "",
    min: "",
    vendor: "",
    createdAt: 0,
    updatedAt: 0,
    expiresAt: 0,
    history: [],
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  /* Load item into form (keep strings for inputs) */
  useEffect(() => {
    if (item) {
      setForm({
        ...item,
        current: String(item.current ?? ""),
        min: String(item.min ?? ""),
      });
    }
  }, [item]);

  /* Load dropdown data */
  useEffect(() => {
    setCategories(
      JSON.parse(localStorage.getItem(`categories-${projectId}`) || "[]")
    );
    setLocations(
      JSON.parse(localStorage.getItem(`locations-${projectId}`) || "[]")
    );
  }, [projectId]);

  if (!open || !item) return null;

  /* ---------- Save with merge + history ---------- */
  const save = () => {
    const now = Date.now();

    // Convert numbers safely (keep old if empty)
    const currentNum =
      form.current === "" ? Number(item.current) : Number(form.current);
    const minNum =
      form.min === "" ? Number(item.min) : Number(form.min);

    // Merge old item + new form (unchanged fields stay same)
    const merged = {
      ...item,
      ...form,
      current: currentNum,
      min: minNum,
      updatedAt: now,
      expiresAt: now + SEVEN_DAYS,
    };

    /* Detect changes for history */
    const changes: string[] = [];

    if (item.name !== merged.name)
      changes.push(`Name ${item.name} → ${merged.name}`);

    if (Number(item.current) !== currentNum)
      changes.push(`Quantity ${item.current} → ${currentNum}`);

    if (Number(item.min) !== minNum)
      changes.push(`Min Stock ${item.min} → ${minNum}`);

    if (item.unit !== merged.unit)
      changes.push(`Unit ${item.unit} → ${merged.unit}`);

    if (item.vendor !== merged.vendor)
      changes.push(`Vendor ${item.vendor || "--"} → ${merged.vendor}`);

    if (item.category !== merged.category)
      changes.push(`Category ${item.category} → ${merged.category}`);

    if (item.location !== merged.location)
      changes.push(`Location ${item.location} → ${merged.location}`);

    const historyEntry: StockHistory | null =
      changes.length > 0
        ? {
            timestamp: now,
            quantityUsed: Math.abs(Number(item.current) - currentNum),
            task: "Stock Updated",
            approvedBy: merged.vendor || "Vendor",
            remarks: changes.join(", "),
          }
        : null;

    merged.history = historyEntry
      ? [...(item.history || []), historyEntry]
      : item.history || [];

    // Remove old key if name changed
    if (item.name !== merged.name) {
      localStorage.removeItem(`stock-${projectId}-${item.name}`);
    }

    localStorage.setItem(
      `stock-${projectId}-${merged.name}`,
      JSON.stringify(merged)
    );

    onClose();
  };

  /* ---------- UI ---------- */
  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-[420px] bg-white rounded-xl shadow-xl p-6 space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Edit Stock
          </h2>

          <Field label="Item Name">
            <input
              value={form.name}
              onChange={(e) =>
                setForm((p) => ({ ...p, name: e.target.value }))
              }
              className="input"
            />
          </Field>

          <Field label="Quantity">
            <input
              type="number"
              value={form.current}
              onChange={(e) =>
                setForm((p) => ({ ...p, current: e.target.value }))
              }
              className="input no-spinner"
            />
          </Field>

          <Field label="Unit">
            <input
              value={form.unit}
              onChange={(e) =>
                setForm((p) => ({ ...p, unit: e.target.value }))
              }
              className="input"
            />
          </Field>

          <Field label="Vendor">
            <input
              value={form.vendor}
              onChange={(e) =>
                setForm((p) => ({ ...p, vendor: e.target.value }))
              }
              className="input"
            />
          </Field>

          <Field label="Category">
            <select
              value={form.category}
              onChange={(e) =>
                setForm((p) => ({ ...p, category: e.target.value }))
              }
              className="input"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Storage Location">
            <select
              value={form.location}
              onChange={(e) =>
                setForm((p) => ({ ...p, location: e.target.value }))
              }
              className="input"
            >
              <option value="">Select location</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Minimum Stock Level">
            <input
              type="number"
              value={form.min}
              onChange={(e) =>
                setForm((p) => ({ ...p, min: e.target.value }))
              }
              className="input no-spinner"
            />
          </Field>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 h-10 border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={save}
              className="flex-1 h-10 rounded-lg bg-[#344960] text-white"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Helper ---------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}