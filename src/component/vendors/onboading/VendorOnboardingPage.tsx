"use client";

import { Eye, X } from "lucide-react";
import { useState, useEffect } from "react";

type VendorRow = {
  id: string;
  name: string;
  type: string;
  savedAt: number;
  status: string;
  email?: string;
  phone?: string;
  city?: string;
  contactName?: string;
  gst?: string;
  pan?: string;
  bank?: string;
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

function lsSet(key: string, value: unknown) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    localStorage.setItem(key, JSON.stringify({ ...parsed, value }));
  } catch {}
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

/* ── Vendor Detail Modal ── */
function VendorDetailModal({
  vendor,
  onClose,
  onStatusChange,
}: {
  vendor: VendorRow;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  const rows = [
    { label: "Vendor ID",      value: vendor.id },
    { label: "Email",          value: vendor.email },
    { label: "Phone",          value: vendor.phone },
    { label: "Contact Person", value: vendor.contactName },
    { label: "City",           value: vendor.city },
    { label: "Vendor Type",    value: vendor.type },
    { label: "GST Number",     value: vendor.gst },
    { label: "PAN Number",     value: vendor.pan },
    { label: "Bank",           value: vendor.bank },
    { label: "Submitted On",   value: formatDate(vendor.savedAt) },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="text-base font-semibold text-gray-900">{vendor.name}</h2>
            <p className="text-xs text-gray-400 mt-0.5">{vendor.id}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {rows.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-xs text-gray-400">{label}</span>
              <span className="text-sm font-medium text-gray-800">{value || "—"}</span>
            </div>
          ))}

          {/* Current status */}
          <div className="flex justify-between items-center py-2">
            <span className="text-xs text-gray-400">Current Status</span>
            <span className={`px-2 py-1 text-xs rounded font-medium ${
              vendor.status === "Active"        ? "bg-green-100 text-green-700"
              : vendor.status === "In Progress" ? "bg-blue-100 text-blue-700"
              : vendor.status === "On Hold"     ? "bg-yellow-100 text-yellow-700"
              : "bg-red-100 text-red-700"
            }`}>
              {vendor.status}
            </span>
          </div>
        </div>

        {/* Footer — Hold / Approve / Reject */}
        <div className="px-5 py-4 border-t bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">Update Status</p>
          <div className="flex gap-2">
            <button
              onClick={() => { onStatusChange(vendor.id, "On Hold"); onClose(); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                vendor.status === "On Hold"
                  ? "bg-yellow-500 text-white border-yellow-500"
                  : "border-yellow-300 text-yellow-700 hover:bg-yellow-50"
              }`}
            >
              Hold
            </button>
            <button
              onClick={() => { onStatusChange(vendor.id, "Active"); onClose(); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                vendor.status === "Active"
                  ? "bg-green-600 text-white border-green-600"
                  : "border-green-300 text-green-700 hover:bg-green-50"
              }`}
            >
              Approve
            </button>
            <button
              onClick={() => { onStatusChange(vendor.id, "Inactive"); onClose(); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition ${
                vendor.status === "Inactive"
                  ? "bg-red-500 text-white border-red-500"
                  : "border-red-300 text-red-500 hover:bg-red-50"
              }`}
            >
              Reject
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function VendorOnboardingPage() {
  const [activeTab, setActiveTab] = useState("Pending");
  const [vendors, setVendors] = useState<VendorRow[]>([]);
  const [selected, setSelected] = useState<VendorRow | null>(null);

  useEffect(() => {
    const load = () => {
      const saved = lsGet<VendorRow[]>("vendor_list_main");
      setVendors(saved ?? []);
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const updateStatus = (id: string, newStatus: string) => {
    setVendors((prev) => {
      const updated = prev.map((v) => v.id === id ? { ...v, status: newStatus } : v);
      lsSet("vendor_list_main", updated);
      return updated;
    });
  };

  const filtered = vendors.filter((v) => {
    if (activeTab === "Pending")  return v.status === "In Progress";
    if (activeTab === "Hold")     return v.status === "On Hold";
    if (activeTab === "Approved") return v.status === "Active";
    if (activeTab === "Rejected") return v.status === "Inactive";
    return true;
  });

  const counts = {
    Pending:  vendors.filter((v) => v.status === "In Progress").length,
    Hold:     vendors.filter((v) => v.status === "On Hold").length,
    Approved: vendors.filter((v) => v.status === "Active").length,
    Rejected: vendors.filter((v) => v.status === "Inactive").length,
  };

  return (
    <div className="bg-white border text-black border-gray-200 rounded-xl p-6">

      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Vendor Onboarding & Approval</h2>
        <p className="text-sm text-gray-500">
          Manage vendor applications and multi-step approval workflow
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {(["Pending", "Hold", "Approved", "Rejected"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs rounded-md border ${
              activeTab === tab
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {tab} ({counts[tab]})
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Application ID</th>
              <th className="px-4 py-2 text-left">Vendor Name</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Submitted Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-400 text-sm">
                  No vendors in this category
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2 font-mono text-xs text-gray-600">{item.id}</td>
                  <td className="px-4 py-2 font-medium">{item.name}</td>
                  <td className="px-4 py-2 text-gray-600">{item.type || "—"}</td>
                  <td className="px-4 py-2 text-gray-600">{formatDate(item.savedAt)}</td>

                  {/* Status */}
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 text-xs rounded font-medium ${
                      item.status === "Active"        ? "bg-green-100 text-green-700"
                      : item.status === "In Progress" ? "bg-blue-100 text-blue-700"
                      : item.status === "On Hold"     ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                    }`}>
                      {item.status}
                    </span>
                  </td>

                  {/* Eye → opens detail modal */}
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => setSelected(item)}
                      className="text-gray-400 hover:text-gray-700 transition"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <VendorDetailModal
          vendor={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}