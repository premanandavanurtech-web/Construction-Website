"use client";

import { useEffect, useState } from "react";
import EditUserPermissionsModal from "./EditUserPermissionsModal";
import AddRoleModal from "../dashboard/AddRoleModal";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
type Role = {
  title: string;
  users: number;
  description: string;
  modules: string[];
};

export default function RoleAssignment() {
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const [roles, setRoles] = useState<Role[]>(() => {
  if (typeof window === "undefined") return [];

  const raw = localStorage.getItem("roles");
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    // ⏰ Expired
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem("roles");
      return [];
    }

    return parsed.data || [];
  } catch {
    return [];
  }
});
  const [openAddRole, setOpenAddRole] = useState(false);
useEffect(() => {
  localStorage.setItem(
    "roles",
    JSON.stringify({
      data: roles,
      expiresAt: Date.now() + ONE_WEEK,
    })
  );
}, [roles]);
  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex justify-between">
        <h2 className="text-lg font-semibold text-black">
          Role Definitions & Default Permissions
          <p className="text-sm text-zinc-500">
            Configure role-based access controls
          </p>
        </h2>
        <button
          onClick={() => setOpenAddRole(true)}
          className="px-5 h-9 rounded-lg bg-[#344960] text-white text-sm"
        >
          Add Role
        </button>
      </div>
      <AddRoleModal
        open={openAddRole}
        onClose={() => setOpenAddRole(false)}
       onSave={(role) => {
  setRoles((prev) => [
    ...prev,
    {
      title: role.title,
      description: role.description,
      modules: role.modules,
      users: 0,
    },
  ]);
}}
      />
      {/* Roles */}
      <div className="space-y-4">
        {roles.map((role, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            {/* Left */}
            <div className="space-y-2">
              <div className="font-semibold text-lg text-black">
                {role.title}{" "}
                <span className="text-sm font-normal text-zinc-500">
                  ({role.users} Users)
                </span>
              </div>

              <p className="text-sm text-zinc-500">{role.description}</p>

              <div>
                <p className="text-xs font-medium text-black  mb-1">
                  Default Module access
                </p>
                <div className="flex flex-wrap gap-2">
                  {role.modules.map((module, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs border rounded-md text-zinc-700"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Buttons */}
            <div className="flex flex-col gap-2">
              <button className="px-5 h-9 rounded-lg bg-[#344960] text-white text-sm">
                View
              </button>
              <button
                onClick={() => {
                  setSelectedUser(role);
                  setOpenEdit(true);
                }}
                className="px-8 h-9 rounded-lg  border text-black text-sm"
              >
                Add User
              </button>
            </div>
            <EditUserPermissionsModal
              open={openEdit}
              onClose={() => setOpenEdit(false)}
              user={selectedUser}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
