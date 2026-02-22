"use client";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  fixedRole: string;
};

const MODULES = {
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

export default function AddUserPermissionsModal({
  open,
  onClose,
  onSave,
  fixedRole,
}: Props) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [access, setAccess] = useState<Record<string, boolean>>({});

  if (!open) return null;

  const toggleAccess = (key: string) => {
    setAccess((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

 const handleSave = () => {
  const now = Date.now();

  const newUser = {
    email,
    phone,
    role: fixedRole,
    password,
    access,
    createdAt: now,
  };

  const raw = localStorage.getItem("users");
  let users: any[] = [];

  if (raw) {
    try {
      const parsed = JSON.parse(raw);

      // ⏰ Expired → reset
      if (now > parsed.expiresAt) {
        users = [];
      } else {
        users = parsed.data || [];
      }
    } catch {
      users = [];
    }
  }

  users.push(newUser);

  localStorage.setItem(
    "users",
    JSON.stringify({
      data: users,
      expiresAt: now + ONE_WEEK,
    })
  );

  onSave(newUser);
  onClose();
};

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-[620px] bg-white rounded-2xl p-6 space-y-5 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Add User
            </h2>
            <p className="text-sm text-gray-500">
              Create a user with fixed role permissions
            </p>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <Input label="Email" value={email} onChange={setEmail} />
            <Input label="Phone" value={phone} onChange={setPhone} />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />

            {/* Role (READ-ONLY) */}
            <div>
              <label className="text-sm text-gray-600">Role</label>
              <input
                value={fixedRole}
                disabled
                className="mt-1 w-full h-10 border rounded-lg px-3 bg-gray-100 text-gray-800 font-medium"
              />
            </div>
          </div>

          {/* Module Access */}
          <div className="border rounded-xl p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">
              Module Access
            </p>

            <div className="grid grid-cols-3 gap-6 text-sm">
              {Object.entries(MODULES).map(([group, items]) => (
                <div key={group}>
                  <p className="font-medium text-gray-600 mb-2">
                    {group}
                  </p>

                  {items.map((item) => {
                    const key = `${group}-${item}`;
                    return (
                      <label
                        key={key}
                        className="flex items-center gap-2 mb-1 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={!!access[key]}
                          onChange={() => toggleAccess(key)}
                        />
                        {item}
                      </label>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={onClose}
              className="px-6 h-10 border rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 h-10 rounded-lg bg-[#344960] text-white"
            >
              Save User
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

/* ---------- Input ---------- */

function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full h-10 border rounded-lg px-3"
      />
    </div>
  );
}