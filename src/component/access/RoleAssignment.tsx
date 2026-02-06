"use client";

import { useState } from "react";
import EditUserPermissionsModal from "./EditUserPermissionsModal";

type Role = {
  title: string;
  users: number;
  description: string;
  modules: string[];
};

const roles: Role[] = [
  {
    title: "SuperAdmin",
    users: 1,
    description:
      "Full system access with user management capabilities",
    modules: ["All Modules"],
  },
  {
    title: "Admin",
    users: 2,
    description:
      "Full system access with user management capabilities",
    modules: ["All Modules"],
  },
  {
    title: "Manager",
    users: 2,
    description:
      "Access to vendor and labour management with reporting",
    modules: ["Labour Management", "Vendor Management"],
  },
  {
    title: "Supervisor",
    users: 2,
    description:
      "Site-level operations and attendance management",
    modules: ["Labour Management", "Vendor Management"],
  },
  {
    title: "Site Engineer",
    users: 2,
    description:
      "Site-level operations and attendance management",
    modules: ["Labour Management", "Vendor Management"],
  },
];

export default function RoleAssignment() {
  const [openEdit, setOpenEdit] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
  return (
    <div className="bg-white border rounded-xl p-5 space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-black">
          Role Definitions & Default Permissions
        </h2>
        <p className="text-sm text-zinc-500">
          Configure role-based access controls
        </p>
      </div>

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

              <p className="text-sm text-zinc-500">
                {role.description}
              </p>

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
               className="px-8 h-9 rounded-lg  border text-black text-sm">
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