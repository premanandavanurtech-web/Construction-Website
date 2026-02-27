"use client";

import { useState, useEffect } from "react";
import { Eye, Trash2, Pencil, Search, SlidersHorizontal, AlertTriangle, X } from "lucide-react";
import AddVendorModal, { VendorFormData, VendorDoc } from "./AddVendorModal";
import VendorDetailModal, { Vendor } from "./Vendordetailmodal";

const VENDORS_KEY = "vendor_list_main";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

const STATUS_OPTIONS = ["Active", "In Progress", "Inactive"];
const TYPE_OPTIONS = ["Supplier", "Contractor", "Consultant", "Service Provider", "Manufacturer"];

function lsSet(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ONE_WEEK_MS }));
  } catch {
    try {
      for (const k of Object.keys(localStorage)) {
        if (!k.startsWith("vendor_")) continue;
        try {
          const raw = localStorage.getItem(k);
          if (!raw) continue;
          const parsed = JSON.parse(raw);
          if (parsed?.expiry && Date.now() > parsed.expiry) localStorage.removeItem(k);
        } catch {}
      }
      localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ONE_WEEK_MS }));
    } catch {
      console.warn("localStorage quota exceeded:", key);
    }
  }
}

function lsGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiry) { localStorage.removeItem(key); return null; }
    return parsed.value as T;
  } catch { return null; }
}

function saveVendorList(vendors: Vendor[]) {
  const slim = vendors.map(({ documents, ...rest }) => rest);
  lsSet(VENDORS_KEY, slim);
}

function saveVendorDocs(id: string, docs: VendorDoc[]) { lsSet(`vendor_docs_${id}`, docs); }
function loadVendorDocs(id: string): VendorDoc[] { return lsGet<VendorDoc[]>(`vendor_docs_${id}`) ?? []; }
function deleteVendorDocs(id: string) { localStorage.removeItem(`vendor_docs_${id}`); }

export default function VendorDatabase() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Filter state
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [filterType, setFilterType] = useState("All Types");
  const [filterCity, setFilterCity] = useState("");

  useEffect(() => {
    const saved = lsGet<Omit<Vendor, "documents">[]>(VENDORS_KEY);
    if (saved) {
      const rehydrated = saved.map((v) => ({ ...v, documents: loadVendorDocs(v.id) }));
      setVendors(rehydrated);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveVendorList(vendors);
    vendors.forEach((v) => saveVendorDocs(v.id, v.documents ?? []));
  }, [vendors, hydrated]);

  const handleAddVendor = (form: VendorFormData, documents: VendorDoc[]) => {
    const v: Vendor = {
      id: "V" + Math.floor(1000 + Math.random() * 9000),
      profilePhoto: form.profilePhoto,
      name: form.vendorName,
      email: form.email,
      type: form.vendorType,
      city: [form.city, form.state].filter(Boolean).join(", "),
      contactName: form.contactPersonName,
      phone: form.phone,
      gst: form.gstNumber,
      pan: form.panNumber,
      bank: form.bankName,
      ifsc: form.ifscCode,
      acct: form.accountNumber ? "****" + form.accountNumber.slice(-4) : "—",
      upi: form.upiId,
      documents,
      documentsCount: documents.length,
      status: "In Progress",
      savedAt: Date.now(),
    };
    setVendors((prev) => [v, ...prev]);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    deleteVendorDocs(deleteId);
    setVendors((prev) => prev.filter((v) => v.id !== deleteId));
    setDeleteId(null);
  };

  const isFiltered =
    filterStatus !== "All Status" || filterType !== "All Types" || filterCity.trim() !== "";

  const clearFilters = () => {
    setFilterStatus("All Status");
    setFilterType("All Types");
    setFilterCity("");
  };

  const filtered = vendors.filter((v) => {
    const matchSearch =
      v.name.toLowerCase().includes(search.toLowerCase()) ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All Status" || v.status === filterStatus;
    const matchType = filterType === "All Types" || v.type === filterType;
    const matchCity =
      filterCity.trim() === "" || v.city?.toLowerCase().includes(filterCity.toLowerCase());
    return matchSearch && matchStatus && matchType && matchCity;
  });

  const vendorToDelete = vendors.find((v) => v.id === deleteId);

  return (
    <div className="min-h-screen text-black">
      <div className="bg-white rounded-xl border border-gray-200 p-6 w-full">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-bold text-gray-900">Vendor Database</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage all vendor information · data expires after 1 week of inactivity
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold px-4 py-2 rounded-lg"
          >
            + Add Vendor
          </button>
        </div>

        {/* Search + Filter Button Row */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by Name, Vendor ID or Email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none"
            />
          </div>

          <button
            onClick={() => setShowFilterPanel((p) => !p)}
            className={`flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              showFilterPanel || isFiltered
                ? "border-gray-800 bg-gray-800 text-white"
                : "border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {isFiltered && (
              <span className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-gray-800 text-[10px] font-bold leading-none">
                ✓
              </span>
            )}
          </button>
        </div>

        {/* ── Inline Filter Panel ── slides open below search row */}
        <div
          className={`transition-all duration-200 ease-in-out overflow-hidden ${
            showFilterPanel ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex flex-wrap items-center gap-3">

            {/* Status */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex-1 min-w-[140px] text-sm border border-gray-200 bg-white rounded-lg px-3 py-[7px] outline-none text-gray-700 cursor-pointer"
            >
              <option value="All Status">All Status</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="flex-1 min-w-[160px] text-sm border border-gray-200 bg-white rounded-lg px-3 py-[7px] outline-none text-gray-700 cursor-pointer"
            >
              <option value="All Types">All Types</option>
              {TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* City */}
            <input
              type="text"
              placeholder="Filter by City..."
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="flex-1 min-w-[140px] text-sm border border-gray-200 bg-white rounded-lg px-3 py-[7px] outline-none text-gray-700"
            />

            {/* Clear */}
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium whitespace-nowrap"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Active filter chips */}
        {isFiltered && (
          <div className="flex flex-wrap gap-2 mt-3">
            {filterStatus !== "All Status" && (
              <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                {filterStatus}
                <button onClick={() => setFilterStatus("All Status")}>
                  <X className="w-3 h-3 ml-1 text-gray-400 hover:text-gray-700" />
                </button>
              </span>
            )}
            {filterType !== "All Types" && (
              <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                {filterType}
                <button onClick={() => setFilterType("All Types")}>
                  <X className="w-3 h-3 ml-1 text-gray-400 hover:text-gray-700" />
                </button>
              </span>
            )}
            {filterCity.trim() !== "" && (
              <span className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full">
                City: {filterCity}
                <button onClick={() => setFilterCity("")}>
                  <X className="w-3 h-3 ml-1 text-gray-400 hover:text-gray-700" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-x-auto mt-5">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {["Vendor ID", "Name", "Type", "Contact", "GST / PAN", "Bank", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-sm text-gray-400 py-10">No vendors found</td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-3 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">{v.id}</td>

                    <td className="px-3 py-3">
                      <div className="text-sm font-semibold text-gray-900">{v.name}</div>
                      <div className="text-[11px] text-gray-400">{v.email}</div>
                    </td>

                    <td className="px-3 py-3 text-sm text-gray-700">{v.type || "—"}</td>

                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-800">{v.contactName || "—"}</div>
                      <div className="text-[11px] text-gray-400">{v.phone}</div>
                    </td>

                    <td className="px-3 py-3 text-xs text-gray-700">
                      {v.gst ? <div>GST: {v.gst}</div> : null}
                      {v.pan ? <div>PAN: {v.pan}</div> : null}
                      {!v.gst && !v.pan ? "—" : null}
                    </td>

                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-800">{v.bank || "—"}</div>
                      <div className="text-[11px] text-gray-400">{v.acct !== "—" ? v.acct : ""}</div>
                    </td>

                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md border ${
                        v.status === "Active"        ? "bg-green-50 text-green-700 border-green-200"
                        : v.status === "In Progress" ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}>
                        {v.status}
                      </span>
                    </td>

                    <td className="px-3 py-3">
                      <div className="flex gap-2 items-center">
                        <button onClick={() => setSelectedVendor(v)}>
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-700 transition" />
                        </button>
                        <button onClick={() => setDeleteId(v.id)}>
                          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600 transition" />
                        </button>
                        <button>
                          <Pencil className="w-4 h-4 text-blue-400 hover:text-blue-600 transition" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Delete Vendor?</h3>
            <p className="text-sm text-gray-500 mb-1">
              You are about to delete <span className="font-semibold text-gray-800">{vendorToDelete?.name}</span>.
            </p>
            <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <AddVendorModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddVendor}
      />

      <VendorDetailModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
      />
    </div>
  );
}