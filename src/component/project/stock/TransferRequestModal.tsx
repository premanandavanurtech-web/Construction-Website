"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: any) => void;
};

export default function TransferRequestModal({
  open,
  onClose,
  onSubmit,
}: Props) {
  const [form, setForm] = useState({
    itemName: "",
    quantity: "",
    unit: "",
    sourceLocation: "",
    destinationLocation: "",
    requestedBy: "",
    comments: "",
  });

  if (!open) return null;

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSubmit?.(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[420px] bg-white rounded-2xl p-6 shadow-xl">

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-5">
          Transfer Request
        </h2>

        {/* Form */}
        <div className="space-y-3 text-sm text-gray-900">
          <Input
            label="Item Name"
            value={form.itemName}
            onChange={(v) => handleChange("itemName", v)}
          />
          <Input
            label="Quantity"
            value={form.quantity}
            onChange={(v) => handleChange("quantity", v)}
          />
          <Input
            label="Unit"
            value={form.unit}
            onChange={(v) => handleChange("unit", v)}
          />
          <Input
            label="Source Location"
            value={form.sourceLocation}
            onChange={(v) => handleChange("sourceLocation", v)}
          />
          <Input
            label="Destination Location"
            value={form.destinationLocation}
            onChange={(v) => handleChange("destinationLocation", v)}
          />
          <Input
            label="Requested By"
            value={form.requestedBy}
            onChange={(v) => handleChange("requestedBy", v)}
          />
          <Input
            label="Comments"
            value={form.comments}
            onChange={(v) => handleChange("comments", v)}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-between mt-6">
          <button
            onClick={onClose}
            className="px-6 h-10 rounded-lg border text-sm text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 h-10 rounded-lg bg-[#344960] text-white text-sm"
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Input ---------- */

function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-600 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 rounded-lg bg-gray-100 px-3 outline-none"
      />
    </div>
  );
}
