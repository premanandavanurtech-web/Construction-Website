"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import EditUserPermissionsModal from "./EditUserPermissionsModal";

const users = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "Supervisor",
    modules: "Attendance, Safety Compliance +1 more",
    status: "Active",
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "Supervisor",
    modules: "Attendance, Safety Compliance +1 more",
    status: "Active",
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "Supervisor",
    modules: "Attendance, Safety Compliance +1 more",
    status: "Active",
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "Supervisor",
    modules: "Attendance, Safety Compliance +1 more",
    status: "Active",
  },
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    role: "Supervisor",
    modules: "Attendance, Safety Compliance +1 more",
    status: "Active",
  },
];

export default function ActivePermissions() {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  return (
    <div className="bg-white border rounded-xl p-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-black">Access Management</h2>
        <p className="text-sm text-zinc-500">
          View and manage current access levels
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black"
          />
          <input
            placeholder="Search Users by Name, Mail......"
            className="w-full h-10 pl-9 pr-4 text-black text-zinc-7
            00 border rounded-lg text-sm"
          />
        </div>

        <button className="h-10 px-5 text-black border rounded-lg text-sm">
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr className="text-left text-lg text-zinc-600">
              <th className="px-9 py-3 ">User</th>
              <th className="px-8 py-3">Role</th>
              <th className="px-20 py-3">Module Access</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-13 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user, i) => (
              <tr key={i} className="border-t last:border-b-0">
                {/* User */}
                <td className="px-4 py-3">
                  <div className="font-medium text-black">{user.name}</div>
                  <div className="text-xs text-zinc-500">{user.email}</div>
                </td>

                {/* Role */}
                <td className="px-4 py-3 text-black">{user.role}</td>

                {/* Modules */}
                <td className="px-4 py-3 text-black">{user.modules}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <span className="px-5 py-1 rounded-md text-xs bg-green-100 text-green-700 border border-green-300">
                    {user.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setOpenEdit(true);
                    }}
                    className="px-5 py-1 bg-[#f1f1f1] text-black  text-xs border border-zinc-700  rounded"
                  >
                    Edit
                  </button>
                  <button className="px-3 py-1 text-xs border bg-red-100  border-red-300 text-red-500 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       <EditUserPermissionsModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser}
      />
    </div>
  );
}
