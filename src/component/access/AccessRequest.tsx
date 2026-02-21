"use client";

import { Search } from "lucide-react";
import { useState } from "react";

type Request = {
  name: string;
  email: string;
  role: string;
  module: string;
  date: string;
  status: "pending" | "approved" | "rejected";
};

const initialRequests: Request[] = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "Supervisor",
    module: "Attendance Tracking",
    date: "2025-10-28",
    status: "pending",
  },
  {
    name: "Amit Sharma",
    email: "amit.sharma@example.com",
    role: "Manager",
    module: "Vendor Management",
    date: "2025-10-28",
    status: "pending",
  },
  {
    name: "Suresh Patil",
    email: "suresh.patil@example.com",
    role: "Site Engineer",
    module: "Labour Management",
    date: "2025-10-28",
    status: "pending",
  },
];

export default function AccessRequest() {
  const [requests, setRequests] = useState<Request[]>(initialRequests);

  const approveRequest = (index: number) => {
    setRequests((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: "approved" } : item
      )
    );
  };

  const rejectRequest = (index: number) => {
    setRequests((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, status: "rejected" } : item
      )
    );
  };

  return (
    <div className="bg-white border rounded-2xl p-5 space-y-4">

      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Pending Access Requests
        </h2>
        <p className="text-sm text-gray-500">
          Review and approve user access requests
        </p>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            placeholder="Search Users by Name, Mail..."
            className="w-full h-10 pl-10 pr-4 border border-gray-300 text-black rounded-lg text-sm focus:outline-none"
          />
        </div>

        <button className="h-10 px-5 border border-[#344960] rounded-lg text-sm font-medium text-[#344960]">
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-700 text-sm font-medium">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Current Role</th>
              <th className="px-4 py-3 text-left">Requested Module</th>
              <th className="px-4 py-3 text-left">Requested Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {requests.map((item, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 last:border-none"
              >
                {/* User */}
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.email}
                  </div>
                </td>

                <td className="px-4 py-3 text-black">{item.role}</td>
                <td className="px-4 py-3 text-black">{item.module}</td>
                <td className="px-4 py-3 text-black">{item.date}</td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">

                    {/* Approve Button */}
                    {item.status !== "rejected" && (
                      <button
                        onClick={() => approveRequest(i)}
                        className={`px-3 py-1 text-xs rounded border ${
                          item.status === "approved"
                            ? "bg-green-600 text-white border-green-600"
                            : "bg-green-100 text-green-700 border-green-300"
                        }`}
                      >
                        Approve
                      </button>
                    )}

                    {/* Reject Button */}
                    {item.status !== "approved" && (
                      <button
                        onClick={() => rejectRequest(i)}
                        className={`px-5 py-1 text-xs rounded border ${
                          item.status === "rejected"
                            ? "bg-red-600 text-white border-red-600"
                            : "bg-red-100 text-red-600 border-red-300"
                        }`}
                      >
                        Reject
                      </button>
                    )}

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