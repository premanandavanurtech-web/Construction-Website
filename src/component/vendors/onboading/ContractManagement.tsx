"use client";

import { Search, Filter, Eye, Pencil } from "lucide-react";

export default function ContractManagement() {
  return (
    <div className="space-y-4 ">

      {/* Contract Renewal Alerts */}
      <div className="bg-white border text-black border-gray-200 rounded-xl px-6 py-4">
        <h3 className="text-sm font-semibold">Contract Renewal Alerts</h3>
        <p className="text-xs text-gray-500 mt-1">
          2 contract(s) expiring within 90 days. Please review and initiate renewal process.
        </p>
      </div>

      {/* Contract & Agreement Management */}
      <div className="bg-white border  border-gray-200 rounded-xl p-6">
        
        {/* Header */}
        <div className="flex justify-between text-black  items-start mb-4">
          <div>
            <h2 className="text-lg text-black font-semibold">
              Contract & Agreement Management
            </h2>
            <p className="text-sm text-gray-500">
              Manage vendor contracts, agreements, and renewal tracking
            </p>
          </div>

          <button className="px-4 py-2 text-sm rounded-md bg-slate-700 text-white">
            + New Contract
          </button>
        </div>

        {/* Search & Filters */}
        <div className="flex text-black gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search By Vendor ID,Name,Email"
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
              <Row
                status="Active"
                renewal="Due Soon"
              />
              <Row
                status="Active"
                renewal="No Action"
              />
              <Row
                status="Active"
                renewal="Expiring"
              />
              <Row
                status="Expired"
                renewal="Expired"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─────────── Table Row ─────────── */

function Row({ status, renewal }: { status: string; renewal: string }) {
  return (
    <tr className="border-t text-black border-gray-200">
      <td className="px-4 py-2">CT001</td>
      <td className="px-4 py-2">BuildPro Materials Ltd</td>
      <td className="px-4 py-2">Supply Agreement</td>
      <td className="px-4 py-2">2025-10-15</td>
      <td className="px-4 py-2">2026-10-15</td>
      <td className="px-4 py-2">₹20,000</td>

      {/* Status */}
      <td className="px-4 text-black py-2">
        <span
          className={`px-2 py-1 text-xs rounded ${
            status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {status}
        </span>
      </td>

      {/* Renewal */}
      <td className="px-4 py-2">
        <span
          className={`px-2 py-1  text-xs rounded ${
            renewal === "Due Soon"
              ? "bg-yellow-100 text-yellow-700"
              : renewal === "No Action"
              ? "bg-gray-100 text-gray-700"
              : renewal === "Expiring"
              ? "bg-orange-100 text-orange-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {renewal}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-2 text-center">
        <div className="flex justify-center gap-3 text-gray-500">
          <Eye className="h-4 w-4 cursor-pointer hover:text-gray-700" />
          <Pencil className="h-4 w-4 cursor-pointer hover:text-gray-700" />
        </div>
      </td>
    </tr>
  );
}