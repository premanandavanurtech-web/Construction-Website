"use client";

import { Search, Filter, Download, Eye } from "lucide-react";

export default function ReportsAnalytics() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Reports & Analytics
          </h1>
          <p className="text-sm text-gray-500">
            Vendor spend analysis and performance dashboards
          </p>
        </div>

        <button className="px-4 py-2 text-sm rounded-md bg-slate-700 text-white">
          Export Report
        </button>
      </div>

      {/* Stat Cards */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <StatCard title="Total Vendors" value="27" />
  <StatCard title="Total Spent" value="₹782,000" />
  <StatCard title="Average Performance" value="89.2%" />
  <StatCard title="Active Issues" value="2" />
</div>

      {/* Payments Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Payments
        </h2>

        {/* Search & Filter */}
        <div className="flex gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search By Order Name,ID,Supplier"
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 placeholder-gray-400"
            />
          </div>

          <button className="px-4 py-2 text-sm border border-gray-200 rounded-md flex items-center gap-2 text-gray-700">
            <Filter className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Invoice</th>
                <th className="px-4 py-2 text-left">Vendor</th>
                <th className="px-4 py-2 text-left">Total Amount</th>
                <th className="px-4 py-2 text-left">Paid</th>
                <th className="px-4 py-2 text-left">Balance</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Due Date</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5, 6].map((_, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-4 py-2 text-gray-900">Inv-002</td>
                  <td className="px-4 py-2 text-gray-700">
                    Probuild Materials
                  </td>
                  <td className="px-4 py-2 text-gray-900">
                    ₹1000000
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    ₹987654
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    ₹987654
                  </td>

                  {/* Status */}
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  </td>

                  <td className="px-4 py-2 text-gray-700">
                    Oct16,2026
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center gap-3 text-gray-500">
                      <Download className="h-4 w-4 cursor-pointer hover:text-gray-700" />
                      <Eye className="h-4 w-4 cursor-pointer hover:text-gray-700" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
        </div>
      </div>

    </div>
  );
}

/* ───────── Stat Card ───────── */

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900 mt-1">
        {value}
      </p>
    </div>
  );
}