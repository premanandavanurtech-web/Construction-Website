"use client";

import { useState, useEffect } from "react";
import { Eye, Trash2, Pencil, Search, SlidersHorizontal } from "lucide-react";
import AddVendorModal, { VendorFormData, VendorDoc } from "./AddVendorModal";
import VendorDetailModal, { Vendor } from "./Vendordetailmodal";

/* ─────────────────────────────────────────
   LocalStorage helpers — 1-week expiry
───────────────────────────────────────── */

const VENDORS_KEY = "vendor_list";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

function lsSet(key: string, value: any) {
  try {
    localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ONE_WEEK_MS }));
  } catch {
    try {
      // Evict expired keys then retry
      for (const k of Object.keys(localStorage)) {
        try {
          const p = JSON.parse(localStorage.getItem(k) ?? "");
          if (p?.expiry && Date.now() > p.expiry) localStorage.removeItem(k);
        } catch { /* skip */ }
      }
      localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ONE_WEEK_MS }));
    } catch (e) {
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

/** Save vendor list WITHOUT documents (kept separately to avoid quota issues) */
function saveVendorList(vendors: Vendor[]) {
  const slim = vendors.map(({ documents, ...rest }) => rest);
  lsSet(VENDORS_KEY, slim);
}

/** Save documents for one vendor under their own key */
function saveVendorDocs(id: string, docs: VendorDoc[]) {
  lsSet(`vendor_docs_${id}`, docs);
}

/** Load documents for one vendor */
function loadVendorDocs(id: string): VendorDoc[] {
  return lsGet<VendorDoc[]>(`vendor_docs_${id}`) ?? [];
}

/** Delete documents for one vendor */
function deleteVendorDocs(id: string) {
  localStorage.removeItem(`vendor_docs_${id}`);
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */

export default function VendorDatabase() {
  const [vendors, setVendors]         = useState<Vendor[]>([]);
  const [search, setSearch]           = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    // Load slim vendor list, then rehydrate each vendor's documents
    const saved = lsGet<Omit<Vendor, "documents">[]>(VENDORS_KEY);
    if (saved) {
      const rehydrated = saved.map((v) => ({
        ...v,
        documents: loadVendorDocs(v.id),
      }));
      setVendors(rehydrated);
    }
  }, []);

  useEffect(() => {
    // Save vendor list (without documents) + each vendor's docs separately
    saveVendorList(vendors);
    vendors.forEach((v) => saveVendorDocs(v.id, v.documents ?? []));
  }, [vendors]);

  const handleAddVendor = (form: VendorFormData, documents: VendorDoc[]) => {
    const v: Vendor = {
      id:             "V" + Math.floor(1000 + Math.random() * 9000),
      profilePhoto:   form.profilePhoto,
      name:           form.vendorName,
      email:          form.email,
      type:           form.vendorType,
      industry:       form.industryType,
      city:           [form.city, form.state].filter(Boolean).join(", "),
      contactName:    form.contactPersonName,
      phone:          form.phone,
      gst:            form.gstNumber,
      pan:            form.panNumber,
      bank:           form.bankName,
      ifsc:           form.ifscCode,
      acct:           form.accountNumber ? "****" + form.accountNumber.slice(-4) : "—",
      upi:            form.upiId,
      documents:      documents,
      documentsCount: documents.length,
      status:         "Active",
      savedAt:        Date.now(),
    };
    setVendors((p) => [v, ...p]);
  };

  const handleDelete = (id: string) => {
    deleteVendorDocs(id);
    setVendors((p) => p.filter((v) => v.id !== id));
  };

  const filtered = vendors.filter(
    (v) =>
      v.name.toLowerCase().includes(search.toLowerCase())  ||
      v.id.toLowerCase().includes(search.toLowerCase())    ||
      v.email.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* Search + Filter */}
        <div className="flex gap-2 mb-5">
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
          <button className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {["Vendor ID", "Name", "Type", "Contact", "GST / PAN", "Bank", "Status", "Actions"].map((h) => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-sm text-gray-400 py-10">
                    No vendors added yet
                  </td>
                </tr>
              ) : (
                filtered.map((v) => (
                  <tr key={v.id} className="border-b hover:bg-gray-50 transition">

                    {/* Vendor ID */}
                    <td className="px-3 py-3 text-xs font-semibold text-gray-700 whitespace-nowrap">
                      {v.id}
                    </td>

                    {/* Name */}
                    <td className="px-3 py-3">
                      <div className="text-sm font-semibold text-gray-900">{v.name}</div>
                      <div className="text-[11px] text-gray-400">{v.email}</div>
                    </td>

                    {/* Type */}
                    <td className="px-3 py-3 text-sm text-gray-700">
                      {v.type || "—"}
                    </td>

                    {/* Contact */}
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-800">{v.contactName || "—"}</div>
                      <div className="text-[11px] text-gray-400">{v.phone}</div>
                    </td>

                    {/* GST / PAN */}
                    <td className="px-3 py-3 text-xs text-gray-700">
                      {v.gst ? <div>GST: {v.gst}</div> : null}
                      {v.pan ? <div>PAN: {v.pan}</div> : null}
                      {!v.gst && !v.pan ? "—" : null}
                    </td>

                    {/* Bank */}
                    <td className="px-3 py-3">
                      <div className="text-sm text-gray-800">{v.bank || "—"}</div>
                      <div className="text-[11px] text-gray-400">{v.acct !== "—" ? v.acct : ""}</div>
                    </td>

                    {/* Status */}
                    <td className="px-3 py-3">
                      <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-md ${
                        v.status === "Active"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-gray-100 text-gray-500 border border-gray-200"
                      }`}>
                        {v.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-3 py-3">
                      <div className="flex gap-2 items-center">
                        <button onClick={() => setSelectedVendor(v)} title="View details">
                          <Eye className="w-4 h-4 text-gray-400 hover:text-gray-700 transition" />
                        </button>
                        <button onClick={() => handleDelete(v.id)} title="Delete">
                          <Trash2 className="w-4 h-4 text-red-400 hover:text-red-600 transition" />
                        </button>
                        <button title="Edit">
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

      {/* Add Vendor Modal */}
      <AddVendorModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddVendor}
      />

      {/* Detail Modal */}
      <VendorDetailModal
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
      />
    </div>
  );
}