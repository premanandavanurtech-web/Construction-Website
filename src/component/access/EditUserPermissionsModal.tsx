"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    role: string;
  } | null;
};

const modules = {
  Project: [
    "Reece",
    "Design",
    "BOQ",
    "Order",
    "Work Progress",
    "SNAG",
    "Finance",
    "Stock",
  ],
  "Vendor Management": [
    "Data Base",
    "Onboarding",
    "Contracts",
    "Orders",
    "Reports",
    "Performance",
  ],
  "Labour Management": [
    "Data Base",
    "Attendance",
    "Payroll",
    "Safety",
    "Deployment",
    "Reports",
  ],
};

export default function EditUserPermissionsModal({
  open,
  onClose,
  user,
}: Props) {
  const [role, setRole] = useState(user?.role || "Manager");

  if (!open || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[520px] rounded-2xl p-6 space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-black">
            Edit User Permissions
          </h2>
          <p className="text-sm text-zinc-500">
            Modify user role and module access
          </p>
        </div>

        {/* User */}
        <div>
          <label className="text-xs text-zinc-500">User</label>
          <div className="text-sm font-medium text-black">{user.name}</div>
          <div className="text-xs text-zinc-500">{user.email}</div>
        </div>

        {/* Role */}
        <div>
          <label className="text-xs text-black mb-1 block">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-10 px-3 text-black border rounded-lg text-sm bg-white"
          >
            <option value="">Select role</option>
            <option value="SuperAdmin">SuperAdmin</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Site Engineer">Site Engineer</option>
          </select>
        </div>

        {/* Module Access */}
        <div>
          <label className="text-xs text-zinc-500 mb-2 block">
            Module Access
          </label>

          <div className="grid grid-cols-3 gap-4 text-black border rounded-lg p-4 text-sm">
            {Object.entries(modules).map(([group, items]) => (
              <div key={group}>
                <h4 className="font-medium text-[13px] text-zinc-500 mb-2">
                  {group}
                </h4>
                <div className="space-y-1">
                  {items.map((item) => (
                    <label key={item} className="flex items-center gap-2">
                      <input type="checkbox" className="accent-[#344960]" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-6 h-10 text-black rounded-lg border text-sm"
          >
            Cancel
          </button>
          <button className="px-6 h-10 rounded-lg bg-[#344960] text-white text-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
