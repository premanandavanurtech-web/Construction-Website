"use client";

import { useEffect, useState } from "react";
import AddRoleModal from "../dashboard/AddRoleModal";
import AddUserPermissionsModal from "./AddUserPermissionsModal";
import ViewUsersModal from "./ViewUsersModal";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

/* ---------- Types ---------- */
type Role = {
  title: string;
  description: string;
  modules: string[];
  users: number;
};

export default function RoleAssignment() {
  /* ---------- Load Roles ---------- */
  const [roles, setRoles] = useState<Role[]>(() => {
    if (typeof window === "undefined") return [];

    const raw = localStorage.getItem("roles");
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw);
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
  const [openView, setOpenView] = useState(false);
  /* ---------- Add User Modal ---------- */
  const [openAddUser, setOpenAddUser] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");

  /* ---------- Persist Roles ---------- */
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
    <div className="bg-white border text-black rounded-xl p-5 space-y-4">
      {/* Header */}
      <div className="flex justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Role Definitions & Default Permissions
          </h2>
          <p className="text-sm text-zinc-500">
            Configure role-based access controls
          </p>
        </div>

        <button
          onClick={() => setOpenAddRole(true)}
          className="px-5 h-9 rounded-lg bg-[#344960] text-white text-sm"
        >
          Add Role
        </button>
      </div>

      {/* Add Role Modal */}
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

      {/* Roles List */}
      <div className="space-y-4">
        {roles.map((role, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 flex justify-between items-start"
          >
            {/* Left */}
            <div className="space-y-2">
              <div className="font-semibold text-lg">
                {role.title}{" "}
                <span className="text-sm font-normal text-zinc-500">
                  ({role.users} Users)
                </span>
              </div>

              <p className="text-sm text-zinc-500">
                {role.description}
              </p>

              <div>
                <p className="text-xs font-medium mb-1">
                  Default Module access
                </p>
                <div className="flex flex-wrap gap-2">
                  {role.modules.map((module, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs border rounded-md"
                    >
                      {module}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right */}
            <div className="flex flex-col gap-2">
              <button
  onClick={() => {
    setSelectedRole(role.title);
    setOpenView(true);
  }}
  className="px-5 h-9 rounded-lg bg-[#344960] text-white text-sm"
>
  View
</button>
              <button
                onClick={() => {
                  setSelectedRole(role.title);
                  setOpenAddUser(true);
                }}
                className="px-8 h-9 rounded-lg border text-sm"
              >
                Add User
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      <AddUserPermissionsModal
        open={openAddUser}
        fixedRole={selectedRole}
        onClose={() => setOpenAddUser(false)}
        onSave={(data) => {
          // ✅ INCREMENT USER COUNT
          setRoles((prev) =>
            prev.map((role) =>
              role.title === data.role
                ? { ...role, users: role.users + 1 }
                : role
            )
          );
        }}
      />
      <ViewUsersModal
  open={openView}
  role={selectedRole}
  onClose={() => setOpenView(false)}
/>
    </div>
  );
}