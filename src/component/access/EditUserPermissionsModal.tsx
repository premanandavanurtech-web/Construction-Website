"use client";

import { useEffect, useState } from "react";

type Role = {
  title: string;
  description?: string;
  modules?: string[];
};

type User = {
  name?: string;
  email: string;
  role: string;
  access?: Record<string, boolean>;
};

type Props = {
  open: boolean;
  onClose: () => void;
  user: User | null;
};

const MODULES: Record<string, string[]> = {
  Project: ["Reece", "Design", "BOQ", "Order", "Work Progress", "SNAG", "Finance", "Stock"],
  "Vendor Management": ["Data Base", "Onboarding", "Contracts", "Orders", "Reports", "Performance"],
  "Labour Management": ["Data Base", "Attendance", "Payroll", "Safety", "Deployment", "Reports"],
};

export default function EditUserPermissionsModal({ open, onClose, user }: Props) {
  const [role, setRole] = useState("");
  const [access, setAccess] = useState<Record<string, boolean>>({});
  const [roles, setRoles] = useState<Role[]>([]);

  /* -------- Load roles from RoleAssignment -------- */
  useEffect(() => {
    const raw = localStorage.getItem("roles");
    if (!raw) { setRoles([]); return; }

    try {
      const parsed = JSON.parse(raw);

      // RoleAssignment saves as { data: Role[], expiresAt: number }
      // Each role has: { title, description, modules }
      let list: any[] = [];

      if (Array.isArray(parsed)) {
        list = parsed;
      } else if (Array.isArray(parsed.data)) {
        list = parsed.data;
      } else if (Array.isArray(parsed.roles)) {
        list = parsed.roles;
      }

      // Normalize — RoleAssignment uses `title`, some older formats use `name`
      const normalized: Role[] = list.map((r) => ({
        title: r.title || r.name || r.role || "",
        description: r.description || "",
        modules: r.modules || [],
      })).filter((r) => r.title); // remove any empty entries

      setRoles(normalized);
    } catch {
      setRoles([]);
    }
  }, [open]); // reload every time modal opens so it reflects latest roles

  /* -------- Prefill user data -------- */
  useEffect(() => {
    if (!user) return;
    setRole(user.role);
    setAccess(user.access || {});
  }, [user]);

  if (!open || !user) return null;

  const toggleAccess = (module: string) => {
    setAccess((prev) => ({
      ...prev,
      [`module-${module}`]: !prev[`module-${module}`],
    }));
  };

  const handleSave = () => {
    const raw = localStorage.getItem("users");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      const updatedUsers = (parsed.value || parsed.data || []).map((u: any) =>
        u.email === user.email ? { ...u, role, access } : u
      );

      localStorage.setItem("users", JSON.stringify({ ...parsed, data: updatedUsers, value: updatedUsers }));
      window.dispatchEvent(new Event("users-updated"));
      onClose();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-[520px] rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold">Edit User Permissions</h2>
          <p className="text-sm text-zinc-500">Modify role and module access</p>
        </div>

        <div>
          <div className="text-sm font-medium">{user.name || "—"}</div>
          <div className="text-xs text-zinc-500">{user.email}</div>
        </div>

        {/* Role Dropdown */}
        <div>
          <label className="text-xs text-black mb-1 block">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-10 px-3 border rounded-lg text-sm"
          >
            <option value="">Select role</option>
            {roles.length === 0 && (
              <option disabled value="">No roles created yet</option>
            )}
            {roles.map((r) => (
              <option key={r.title} value={r.title}>
                {r.title}
              </option>
            ))}
          </select>
        </div>

        {/* Module Access */}
        <div>
          <label className="text-xs text-zinc-500 mb-2 block">Module Access</label>
          <div className="grid grid-cols-3 gap-4 border rounded-lg p-4 text-sm">
            {Object.entries(MODULES).map(([group, items]) => (
              <div key={group}>
                <h4 className="font-medium text-xs text-zinc-500 mb-2">{group}</h4>
                {items.map((item) => {
                  const key = `module-${item}`;
                  return (
                    <label key={item} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={!!access[key]}
                        onChange={() => toggleAccess(item)}
                        className="accent-[#344960]"
                      />
                      <span>{item}</span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-6 h-10 border rounded-lg text-sm">
            Cancel
          </button>
          <button onClick={handleSave} className="px-6 h-10 rounded-lg bg-[#344960] text-white text-sm">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}