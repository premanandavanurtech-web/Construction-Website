"use client";

import { useState, useEffect } from "react";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const STORAGE_KEY = "user_permissions_list";
const USERS_KEY = "users";
const ACCESS_REQUEST_KEY = "accessRequests";

type Props = {
  open: boolean;
  onClose: () => void;
  fixedRole: string;
  onSave: (data: any) => void;
};

const MODULES = {
  Project: ["Reece", "Design", "BOQ", "Order", "Work Progress", "SNAG", "Finance", "Stock"],
  "Vendor Management": ["Data Base", "Onboarding", "Contracts", "Orders", "Reports", "Performance"],
  "Labour Management": ["Data Base", "Attendance", "Payroll", "Safety", "Deployment", "Reports"],
};

/* ─────────────────────────────────────────
   Helpers — { value, expiry } format
   Used for: user_permissions_list, users
───────────────────────────────────────── */
function getList(key: string): any[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    if (Date.now() > p.expiry) { localStorage.removeItem(key); return []; }
    return p.value || [];
  } catch { return []; }
}

function setList(key: string, value: any[]) {
  localStorage.setItem(key, JSON.stringify({ value, expiry: Date.now() + ONE_WEEK }));
}

/* ─────────────────────────────────────────
   Helpers — { data, expiresAt } format
   Used for: accessRequests  ← must match AccessRequest.tsx exactly
───────────────────────────────────────── */
function getAccessRequests(): any[] {
  const raw = localStorage.getItem(ACCESS_REQUEST_KEY);
  if (!raw) return [];
  try {
    const p = JSON.parse(raw);
    if (Date.now() > p.expiresAt) { localStorage.removeItem(ACCESS_REQUEST_KEY); return []; }
    return p.data || [];
  } catch { return []; }
}

function saveAccessRequests(data: any[]) {
  localStorage.setItem(
    ACCESS_REQUEST_KEY,
    JSON.stringify({ data, expiresAt: Date.now() + ONE_WEEK })
  );
}

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export default function AddUserPermissionsModal({ open, onClose, fixedRole, onSave }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [access, setAccess] = useState<Record<string, boolean>>({});

  const resetForm = () => {
    setName(""); setEmail(""); setPhone(""); setPassword(""); setAccess({});
  };

  useEffect(() => { if (!open) resetForm(); }, [open]);

  if (!open) return null;

  const toggleAccess = (key: string) =>
    setAccess((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    if (!email) return alert("Email is required");

    const now = Date.now();
    const moduleKeys = Object.keys(access).filter((k) => access[k]);

    // ── 1. user_permissions_list  (RoleAssignment user count) ──
    const permList = getList(STORAGE_KEY);
    if (permList.some((u: any) => u.email === email)) {
      return alert("User with this email already exists");
    }
    const permUser = {
      id: crypto.randomUUID(),
      name, email, phone, password,
      role: fixedRole,
      modules: moduleKeys,
      createdAt: now,
      date: new Date(now).toISOString().split("T")[0],
      status: "pending",
    };
    setList(STORAGE_KEY, [...permList, permUser]);

    // ── 2. users  (ActivePermissions table) ──
    const usersList = getList(USERS_KEY);
    const accessMap: Record<string, boolean> = {};
    moduleKeys.forEach((k) => (accessMap[k] = true));
    setList(USERS_KEY, [
      ...usersList,
      { ...permUser, access: accessMap },
    ]);

    // ── 3. accessRequests  (AccessRequest component) ──
    // Uses { data, expiresAt } format — must match AccessRequest.tsx loadRequests()
    const existing = getAccessRequests();
    const duplicate = existing.some(
      (r: any) => r.email === email && r.role === fixedRole
    );
    if (!duplicate) {
      saveAccessRequests([
        ...existing,
        {
          name,
          email,
          phone,
          role: fixedRole,
          modules: moduleKeys,
          createdAt: now,
          date: permUser.date,
          status: "pending",
        },
      ]);
    }

    // ── 4. Tell AccessRequest component to reload ──
    window.dispatchEvent(new Event("access-request-refresh"));

    onSave(permUser);
    resetForm();
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="w-[620px] bg-white rounded-2xl p-6 space-y-5 shadow-xl">
          <h2 className="text-xl font-semibold">Add User</h2>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Name" value={name} onChange={setName} />
            <Input label="Email" value={email} onChange={setEmail} />
            <Input label="Phone" value={phone} onChange={setPhone} />
            <Input label="Password" type="password" value={password} onChange={setPassword} />
            <div>
              <label className="text-sm">Role</label>
              <input
                value={fixedRole}
                disabled
                className="w-full h-10 border rounded px-3 bg-gray-100"
              />
            </div>
          </div>

          <div className="border rounded-xl p-4">
            <p className="font-medium mb-3">Module Access</p>
            <div className="grid grid-cols-3 gap-6 text-sm">
              {Object.entries(MODULES).map(([group, items]) => (
                <div key={group}>
                  <p className="font-medium mb-2">{group}</p>
                  {items.map((m) => {
                    const key = `${group}-${m}`;
                    return (
                      <label key={key} className="flex gap-2 items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!access[key]}
                          onChange={() => toggleAccess(key)}
                        />
                        {m}
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button onClick={() => { resetForm(); onClose(); }} className="border px-6 h-10 rounded">
              Cancel
            </button>
            <button onClick={handleSave} className="bg-[#344960] text-white px-6 h-10 rounded">
              Save User
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function Input({ label, value, onChange, type = "text" }: any) {
  return (
    <div>
      <label className="text-sm">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-10 border rounded px-3"
      />
    </div>
  );
}