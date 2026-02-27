"use client";

import { Search, Filter, Eye } from "lucide-react";
import { useState } from "react";
import CreateOrderModal from "../../project/order/CreateOrderModal";

export default function PurchaseOrdersTracking() {
  const [activeTab, setActiveTab] = useState("Active");
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white border text-black border-gray-200 rounded-xl p-6">

      {/* Header */}
      <div className="flex justify-between text-black items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">Purchase Orders & Tracking</h2>
          <p className="text-sm text-gray-500">
            Manage purchase orders, delivery schedules, and payment status
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-4 py-2 text-sm rounded-md bg-slate-700 text-white"
        >
          + New Order
        </button>
      </div>

      {/* ✅ Fixed: pass both open and onClose */}
      <CreateOrderModal open={open} onClose={() => setOpen(false)} />

      {/* Search & Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search By Vendor Name, PO ID..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm"
          />
        </div>
        <button className="px-4 py-2 text-sm border border-gray-200 rounded-md flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["All Orders", "Active", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs rounded-md border ${
              activeTab === tab
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">PO ID</th>
              <th className="px-4 py-2 text-left">Vendor</th>
              <th className="px-4 py-2 text-left">PR Number</th>
              <th className="px-4 py-2 text-left">Order Date</th>
              <th className="px-4 py-2 text-left">Delivery Date</th>
              <th className="px-4 py-2 text-left">Amount</th>
              <th className="px-4 py-2 text-left">Progress</th>
              <th className="px-4 py-2 text-left">Payment</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            <Row progress="Inprogress" payment="Pending" />
            <Row progress="Processing" payment="Pending" />
            <Row progress="Inprogress" payment="Pending" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ progress, payment }: { progress: string; payment: string }) {
  return (
    <tr className="border-t border-gray-200">
      <td className="px-4 py-2">PO001</td>
      <td className="px-4 py-2">TechBuild Solutions</td>
      <td className="px-4 py-2">PR-2024-156</td>
      <td className="px-4 py-2">2025-10-15</td>
      <td className="px-4 py-2">2025-10-15</td>
      <td className="px-4 py-2">₹45,000</td>

      <td className="px-4 py-2">
        <span className={`px-2 py-1 text-xs rounded ${
          progress === "Inprogress" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"
        }`}>
          {progress}
        </span>
      </td>

      <td className="px-4 py-2">
        <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
          {payment}
        </span>
      </td>

      <td className="px-4 py-2 text-center">
        <Eye className="h-4 w-4 text-gray-500 cursor-pointer hover:text-gray-700" />
      </td>
    </tr>
  );
}