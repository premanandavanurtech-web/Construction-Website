"use client";

import { Eye } from "lucide-react";

export default function VendorPerformanceCompliance() {
  return (
    <div className="space-y-6">

      {/* Vendor Performance & Compliance Tracking */}
      <div className="bg-white border text-black border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold">
          Vendor Performance & Compliance Tracking
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Monitor delivery timelines, quality inspections, and incident logs
        </p>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Vendor</th>
                <th className="px-4 py-2 text-left">Delivery Score</th>
                <th className="px-4 py-2 text-left">Quality Score</th>
                <th className="px-4 py-2 text-left">Compliance</th>
                <th className="px-4 py-2 text-left">Total Orders</th>
                <th className="px-4 py-2 text-left">On-Time</th>
                <th className="px-4 py-2 text-left">Inspection</th>
                <th className="px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-4 py-2">
                    BuildPro Materials Ltd
                    <div className="text-xs text-gray-400">V001</div>
                  </td>
                  <td className="px-4 py-2">96%</td>
                  <td className="px-4 py-2">92%</td>
                  <td className="px-4 py-2">98%</td>
                  <td className="px-4 py-2">24</td>
                  <td className="px-4 py-2">98%</td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      Pass
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Incident & Dispute Logs */}
      <div className="bg-white border text-black border-gray-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold">
          Incident & Dispute Logs
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Track quality issues, delays, and disputes
        </p>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-4 py-2 text-left">Incident ID</th>
                <th className="px-4 py-2 text-left">Vendor</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Type</th>
                <th className="px-4 py-2 text-left">Description</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Resolution</th>
              </tr>
            </thead>

            <tbody>
              {[1, 2, 3, 4, 5].map((_, i) => (
                <tr key={i} className="border-t border-gray-200">
                  <td className="px-4 py-2">INC001</td>
                  <td className="px-4 py-2">
                    Premium Steel Suppliers
                    <div className="text-xs text-gray-400">V004</div>
                  </td>
                  <td className="px-4 py-2">2025-10-05</td>
                  <td className="px-4 py-2">Quality Issue</td>
                  <td className="px-4 py-2">
                    Delivered steel rods below specified grade
                  </td>
                  <td className="px-4 py-2">
                    <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                      Resolved
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    Replacement provided within 3 days
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