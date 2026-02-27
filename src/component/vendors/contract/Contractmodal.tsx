"use client";

import { useState, useEffect } from "react";

export type ContractForm = {
  vendor: string;
  contractId: string;
  type: string;
  value: string;
  startDate: string;
  endDate: string;
  status: string;
  renewal: string;
  bond: string;
};

type ApprovedVendor = {
  id: string;
  name: string;
  type: string;
  status: string;
};

type Props = {
  onClose: () => void;
  onAdd: (data: ContractForm) => void;
};

function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.value as T;
  } catch {
    return null;
  }
}

export default function ContractModal({ onClose, onAdd }: Props) {
  const [form, setForm] = useState<ContractForm>({
    vendor: "",
    contractId: "",
    type: "",
    value: "",
    startDate: "",
    endDate: "",
    status: "",
    renewal: "",
    bond: "",
  });

  const [approvedVendors, setApprovedVendors] = useState<ApprovedVendor[]>([]);

  useEffect(() => {
    const all = lsGet<ApprovedVendor[]>("vendor_list_main") ?? [];
    setApprovedVendors(all.filter((v) => v.status === "Active"));
  }, []);

  /* ✅ When vendor is selected, auto-fill type from that vendor's data */
  const handleVendorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    const matched = approvedVendors.find((v) => v.name === selectedName);
    setForm((p) => ({
      ...p,
      vendor: selectedName,
      type: matched?.type ?? p.type, // ✅ auto-fill type
    }));
  };

  const set = (key: keyof ContractForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleAdd = () => {
    onAdd(form);
    onClose();
  };

  const inputClass = "w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-slate-300";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[500px] p-7">

        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Contract &amp; Agreement Management
        </h2>

        <div className="grid grid-cols-2 gap-x-5 gap-y-4">

          {/* Vendor dropdown */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Vendor</label>
            <select value={form.vendor} onChange={handleVendorChange} className={inputClass}>
              <option value="">Select approved vendor</option>
              {approvedVendors.length === 0 && (
                <option disabled>No approved vendors yet</option>
              )}
              {approvedVendors.map((v) => (
                <option key={v.id} value={v.name}>
                  {v.name} ({v.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Contract ID</label>
            <input value={form.contractId} onChange={set("contractId")} placeholder="e.g. CT001" className={inputClass} />
          </div>

          {/* ✅ Type — auto-filled but still editable */}
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Type</label>
            <input
              value={form.type}
              onChange={set("type")}
              placeholder="Auto-filled from vendor"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Value</label>
            <input value={form.value} onChange={set("value")} placeholder="e.g. ₹4500000" className={inputClass} />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Start Date</label>
            <input type="date" value={form.startDate} onChange={set("startDate")} className={inputClass} />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">End Date</label>
            <input type="date" value={form.endDate} onChange={set("endDate")} className={inputClass} />
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Status</label>
            <select value={form.status} onChange={set("status")} className={inputClass}>
              <option value="">Select status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 mb-1 block">Renewal</label>
            <select value={form.renewal} onChange={set("renewal")} className={inputClass}>
              <option value="">Select renewal</option>
              <option value="No Action">No Action</option>
              <option value="Due Soon">Due Soon</option>
              <option value="Expiring">Expiring</option>
              <option value="Expired">Expired</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-600 mb-1 block">Bond</label>
            <textarea
              value={form.bond}
              onChange={set("bond")}
              placeholder="Enter bond details..."
              rows={4}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-slate-300 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-8 py-2 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleAdd} className="px-8 py-2 rounded-lg bg-[#2d3f55] text-white text-sm hover:bg-[#243347]">
            Add Contract
          </button>
        </div>
      </div>
    </div>
  );
}