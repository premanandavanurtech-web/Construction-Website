"use client";

import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  role: string;
  onClose: () => void;
};

type User = {
  email: string;
  phone: string;
  password: string;
  role: string;
  access: Record<string, boolean>;
  createdAt: number;
};

export default function ViewUsersModal({ open, role, onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!open) return;

    const raw = localStorage.getItem("users");
    if (!raw) return;

    const parsed = JSON.parse(raw);

    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem("users");
      return;
    }

    setUsers(parsed.data.filter((u: User) => u.role === role));
  }, [open, role]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="w-[900px] bg-white rounded-xl p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold mb-4">
            Users – {role}
          </h2>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left">Email</th>
                  <th className="px-3 py-2 text-left">Phone</th>
                  <th className="px-3 py-2 text-left">Role</th>
                  <th className="px-3 py-2 text-left">Password</th>
                  <th className="px-3 py-2 text-left">Modules</th>
                  <th className="px-3 py-2 text-left">Created</th>
                </tr>
              </thead>

              <tbody>
                {users.length ? (
                  users.map((u, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-3 py-2">{u.email}</td>
                      <td className="px-3 py-2">{u.phone}</td>
                      <td className="px-3 py-2">{u.role}</td>
                      <td className="px-3 py-2">{u.password}</td>
                      <td className="px-3 py-2">
                        {Object.keys(u.access)
                          .filter((k) => u.access[k])
                          .join(", ")}
                      </td>
                      <td className="px-3 py-2">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={onClose}
              className="px-6 h-10 border rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}