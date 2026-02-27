"use client";

import { useState } from "react";

export default function VendorOnboardingPage() {
  const [activeTab, setActiveTab] = useState("Pending");

  const data = [
    {
      id: "APP001",
      name: "TechBuild Solutions",
      type: "Services",
      date: "2025-10-15",
      step: "Background Check",
      progress: 60,
      status: "Inprogress",
    },
    {
      id: "APP001",
      name: "TechBuild Solutions",
      type: "Services",
      date: "2025-10-15",
      step: "Background Check",
      progress: 60,
      status: "Inprogress",
    },
    {
      id: "APP001",
      name: "TechBuild Solutions",
      type: "Services",
      date: "2025-10-15",
      step: "Background Check",
      progress: 60,
      status: "Inprogress",
    },
  ];

  return (
    <div className="bg-white border text-black border-gray-200 rounded-xl p-6">
      
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Vendor Onboarding & Approval
        </h2>
        <p className="text-sm text-gray-500">
          Manage vendor applications and multi-step approval workflow
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { label: "Pending", count: 3 },
          { label: "Approved", count: 1 },
          { label: "Rejected", count: 1 },
        ].map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-3 py-1.5 text-xs rounded-md border ${
              activeTab === tab.label
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-gray-100 text-gray-700 border-gray-200"
            }`}
          >
            {tab.label}({tab.count})
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
              <th className="px-4 py-2 text-left">Current Step</th>
              <th className="px-4 py-2 text-left">Progress</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className="border-t border-gray-200"
              >
                <td className="px-4 py-2">{item.id}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{item.type}</td>
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.step}</td>

                {/* Progress */}
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 rounded-full">
                      <div
                        className="h-2 bg-green-500 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-xs">{item.progress}%</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-2">
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-700">
                    {item.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-2 text-center">
                  <button className="text-gray-500 hover:text-gray-700">
                    👁
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}