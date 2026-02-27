"use client";

import { Search, Filter, Eye, Pencil } from "lucide-react";
import ContractModal from "../contract/Contractmodal";
import { useState, useEffect } from "react";

const CONTRACTS_KEY = "contract_list_main";
const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export type ContractData = {
  vendor: string;
  contractId: string;
  type: string;
  value: string;
  startDate: string;
  endDate: string;
  status: string;
  renewal: string;
  bond: string;
  savedAt: number;
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
    localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ONE_WEEK_MS }));
  } catch {
    console.warn("localStorage error");
  }
}

export default function ContractManagement() {
  const [open, setOpen] = useState(false);
  const [contracts, setContracts] = useState<ContractData[]>([]);
  const [search, setSearch] = useState("");
  const [hydrated, setHydrated] = useState(false);

  /* ── Load from localStorage on mount ── */
  useEffect(() => {
    const saved = lsGet<ContractData[]>(CONTRACTS_KEY);
    if (saved) setContracts(saved);
    setHydrated(true);
  }, []);

  /* ── Save to localStorage whenever contracts change ── */
  useEffect(() => {
    if (!hydrated) return;
    lsSet(CONTRACTS_KEY, contracts);
  }, [contracts, hydrated]);

  const handleAdd = (data: Omit<ContractData, "savedAt">) => {
    const newContract: ContractData = { ...data, savedAt: Date.now() };
    setContracts((prev) => [newContract, ...prev]);
    setOpen(false);
  };

  const filtered = contracts.filter((c) =>
    c.vendor.toLowerCase().includes(search.toLowerCase()) ||
    c.contractId.toLowerCase().includes(search.toLowerCase()) ||
    c.type.toLowerCase().includes(search.toLowerCase())
  );

  /* ── Renewal alert count ── */
  const expiringCount = contracts.filter((c) =>
    c.renewal === "Due Soon" || c.renewal === "Expiring"
  ).length;

  return (
    <div className="space-y-4">

      {/* Contract Renewal Alerts */}
      <div className="bg-white border text-black border-gray-200 rounded-xl px-6 py-4">
        <h3 className="text-sm font-semibold">Contract Renewal Alerts</h3>
        <p className="text-xs text-gray-500 mt-1">
          {expiringCount > 0
            ? `${expiringCount} contract(s) expiring within 90 days. Please review and initiate renewal process.`
            : "No contracts expiring soon."}
        </p>
      </div>

      {/* Contract & Agreement Management */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">

        {/* Header */}
        <div className="flex justify-between text-black items-start mb-4">
          <div>
            <h2 className="text-lg text-black font-semibold">
              Contract &amp; Agreement Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage vendor contracts, agreements, and renewal tracking
            </p>
          </div>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 text-sm rounded-md bg-slate-700 text-white"
          >
            + New Contract
          </button>
        </div>

        {/* Modal */}
        {open && (
          <ContractModal
            onClose={() => setOpen(false)}
            onAdd={handleAdd}
          />
        )}

        {/* Search & Filters */}
        <div className="flex text-black gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Vendor, Contract ID, Type"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm"
            />
          </div>
          <button className="px-4 py-2 text-sm border border-gray-200 rounded-md flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Contract ID</th>
                <th className="px-4 py-2 text-left">Vendor Name</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Start Date</th>
                <th className="px-4 py-2 text-left">End Date</th>
                <th className="px-4 py-2 text-left">Value</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Renewal</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-gray-400 text-sm">
                    No contracts yet. Click "+ New Contract" to add one.
                  </td>
                </tr>
              ) : (
                filtered.map((c, i) => (
                  <tr key={i} className="border-t text-black border-gray-200">
                    <td className="px-4 py-2 font-mono text-xs">{c.contractId || "—"}</td>
                    <td className="px-4 py-2">{c.vendor || "—"}</td>
                    <td className="px-4 py-2">{c.type || "—"}</td>
                    <td className="px-4 py-2">{c.startDate || "—"}</td>
                    <td className="px-4 py-2">{c.endDate || "—"}</td>
                    <td className="px-4 py-2">{c.value || "—"}</td>

                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        c.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}>
                        {c.status || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        c.renewal === "Due Soon"  ? "bg-yellow-100 text-yellow-700"
                        : c.renewal === "No Action" ? "bg-gray-100 text-gray-700"
                        : c.renewal === "Expiring"  ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                      }`}>
                        {c.renewal || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-center">
                      <div className="flex justify-center gap-3 text-gray-500">
                        <Eye className="h-4 w-4 cursor-pointer hover:text-gray-700" />
                        <Pencil className="h-4 w-4 cursor-pointer hover:text-gray-700" />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}