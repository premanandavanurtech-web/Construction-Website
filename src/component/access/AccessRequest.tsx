"use client";

import { Search } from "lucide-react";
import { useState, useMemo } from "react";

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

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    role: "",
    module: "",
    date: "",
  });

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

  // ✅ SEARCH + FILTER LOGIC
  const filteredRequests = useMemo(() => {
    return requests.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        !filters.role || item.role === filters.role;

      const matchesModule =
        !filters.module || item.module === filters.module;

      const matchesDate =
        !filters.date || item.date === filters.date;

      return matchesSearch && matchesRole && matchesModule && matchesDate;
    });
  }, [requests, searchTerm, filters]);

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

      {/* Search + Filter Button */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Users by Name, Mail..."
            className="w-full h-10 pl-10 pr-4 border border-gray-300 text-black rounded-lg text-sm"
          />
        </div>

        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className="h-10 px-5 border border-[#344960] rounded-lg text-sm font-medium text-[#344960]"
        >
          Filters
        </button>
      </div>

      {/* ✅ FILTER BOX (shows on click) */}
      {showFilters && (
        <div className="border rounded-lg p-4 bg-gray-50 grid grid-cols-3 gap-4">
          <select
            className="h-10 border rounded px-3 text-sm"
            value={filters.role}
            onChange={(e) =>
              setFilters({ ...filters, role: e.target.value })
            }
          >
            <option value="">All Roles</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Manager">Manager</option>
            <option value="Site Engineer">Site Engineer</option>
          </select>

          <select
            className="h-10 border rounded px-3 text-sm"
            value={filters.module}
            onChange={(e) =>
              setFilters({ ...filters, module: e.target.value })
            }
          >
            <option value="">All Modules</option>
            <option value="Attendance Tracking">Attendance Tracking</option>
            <option value="Vendor Management">Vendor Management</option>
            <option value="Labour Management">Labour Management</option>
          </select>

          <input
            type="date"
            className="h-10 border rounded px-3 text-sm"
            value={filters.date}
            onChange={(e) =>
              setFilters({ ...filters, date: e.target.value })
            }
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-700 font-medium">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Current Role</th>
              <th className="px-4 py-3 text-left">Requested Module</th>
              <th className="px-4 py-3 text-left">Requested Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.map((item, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="px-4 py-3">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-xs text-gray-500">
                    {item.email}
                  </div>
                </td>
                <td className="px-4 py-3">{item.role}</td>
                <td className="px-4 py-3">{item.module}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3 text-center space-x-2">
                  {item.status !== "rejected" && (
                    <button
                      onClick={() => approveRequest(i)}
                      className="px-3 py-1 text-xs rounded bg-green-100 text-green-700 border"
                    >
                      Approve
                    </button>
                  )}
                  {item.status !== "approved" && (
                    <button
                      onClick={() => rejectRequest(i)}
                      className="px-3 py-1 text-xs rounded bg-red-100 text-red-600 border"
                    >
                      Reject
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {filteredRequests.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No matching records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}