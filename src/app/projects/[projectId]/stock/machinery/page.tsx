"use client";

import { Search, Eye, Trash2, Pencil } from "lucide-react";

const machinery = [
  {
    name: "Crane",
    category: "Machinery",
    stock: "1",
    minStock: "N/A",
    location: "Project_A",
    status: "Instock",
    updated: "2 hours ago",
  },
  {
    name: "Crane",
    category: "Machinery",
    stock: "1",
    minStock: "N/A",
    location: "Project_A",
    status: "Instock",
    updated: "2 hours ago",
  },
  {
    name: "Crane",
    category: "Machinery",
    stock: "1",
    minStock: "N/A",
    location: "Project_A",
    status: "Instock",
    updated: "2 hours ago",
  },
  {
    name: "Crane",
    category: "Machinery",
    stock: "1",
    minStock: "N/A",
    location: "Project_A",
    status: "Instock",
    updated: "2 hours ago",
  },
  {
    name: "Crane",
    category: "Machinery",
    stock: "1",
    minStock: "N/A",
    location: "Project_A",
    status: "Instock",
    updated: "2 hours ago",
  },
  {
    name: "Crane",
    category: "Machinery",
    stock: "1",
    minStock: "N/A",
    location: "Project_A",
    status: "Instock",
    updated: "2 hours ago",
  },
];

export default function MachineryPage() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
      
      {/* Search + Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search Stocks......"
            className="w-full h-10 pl-10 pr-4 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        <button className="h-10 px-5 border border-[#344960] rounded-lg text-sm font-medium text-[#344960] hover:bg-gray-50">
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-700 font-medium">
              <th className="px-4 py-3 text-left">Item Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Current Stock</th>
              <th className="px-4 py-3 text-left">Min.Stock</th>
              <th className="px-4 py-3 text-left">Location</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Last Updated</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {machinery.map((item, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 last:border-none"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {item.name}
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {item.category}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {item.stock}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {item.minStock}
                </td>
                <td className="px-4 py-3 text-gray-900">
                  {item.location}
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-3 py-[2px] rounded-sm text-xs font-medium bg-green-100 text-green-700 border border-green-300">
                    Instock
                  </span>
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {item.updated}
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-3 text-gray-700">
                    <Eye size={16} className="cursor-pointer" />
                    <Trash2 size={16} className="cursor-pointer" />
                    <Pencil size={16} className="cursor-pointer" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}