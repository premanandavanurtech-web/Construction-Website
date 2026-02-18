"use client";

import { useState, useEffect } from "react";

export type StockFilters = {
  category: string;
  location: string;
  minStock: string;
  currentStock: string;
 createdOn: string;
};

const empty: StockFilters = {
  category: "",
  location: "",
  minStock: "",
  currentStock: "",
  createdOn: "" ,
};

type Props = {
  open: boolean;
  onClose: () => void;
  onApply: (filters: StockFilters) => void;
  categories?: string[];
  locations?: string[];
  
};

export default function StockFilterModal({
  open,
  onClose,
  onApply,
  categories = [],
  locations = [],
}: Props) {
  const [filters, setFilters] = useState<StockFilters>(empty);

  useEffect(() => {
    if (open) setFilters(empty);
  }, [open]);

  const set = (key: keyof StockFilters) => (v: string) =>
    setFilters((prev) => ({ ...prev, [key]: v }));

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 9998 }}
      />

      {/* Panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "360px",
          background: "#fff",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          boxShadow: "-4px 0 24px rgba(0,0,0,0.12)",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #e5e7eb" }}>
          <span style={{ fontWeight: 600, fontSize: 15, color: "#111" }}>Filters</span>
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: "#6b7280", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px" }}>

          <Field label="Category">
            <select
              value={filters.category}
              onChange={(e) => set("category")(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Categories</option>
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Location">
            <select
              value={filters.location}
              onChange={(e) => set("location")(e.target.value)}
              style={selectStyle}
            >
              <option value="">All Locations</option>
              {locations.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </Field>

          <Field label="Min Stock ≤">
            <input
              type="number"
              min={0}
              placeholder="e.g. 50"
              value={filters.minStock}
              onChange={(e) => set("minStock")(e.target.value)}
              style={inputStyle}
            />
          </Field>

          <Field label="Current Stock ≤">
            <input
              type="number"
              min={0}
              placeholder="e.g. 100"
              value={filters.currentStock}
              onChange={(e) => set("currentStock")(e.target.value)}
              style={inputStyle}
            />
          </Field>

       <Field label="Created On">
  <input
    type="date"
    value={filters.createdOn}
    onChange={(e) => set("createdOn")(e.target.value)}
    style={inputStyle}
  />
</Field>

        </div>

        {/* Footer */}
        <div style={{ borderTop: "1px solid #e5e7eb", padding: "16px 20px", display: "flex", gap: 12 }}>
          <button
            onClick={() => { setFilters(empty); onApply(empty); onClose(); }}
            style={{ flex: 1, height: 40, borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer", color: "#374151" }}
          >
            Reset
          </button>
          <button
            onClick={() => { onApply(filters); onClose(); }}
            style={{ flex: 1, height: 40, borderRadius: 8, border: "none", background: "#344960", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" }}
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 500, color: "#6b7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  padding: "0 12px",
  fontSize: 14,
  outline: "none",
  boxSizing: "border-box",
  color:"black"
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  background: "#fff",
  cursor: "pointer",
};