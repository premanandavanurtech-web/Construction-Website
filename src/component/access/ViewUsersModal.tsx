"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "user_permissions_list";

type Props = {
  open: boolean;
  role: string;
  onClose: () => void;
};

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  modules: string[];
  createdAt: number;
  expiresAt: number;
  status: string;
};

/* ================= MODULE CELL ================= */
const VISIBLE_COUNT = 2;

function ModuleCell({ modules }: { modules: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!modules || modules.length === 0)
    return <span className="text-gray-400">—</span>;

  const visible = expanded ? modules : modules.slice(0, VISIBLE_COUNT);
  const remaining = modules.length - VISIBLE_COUNT;

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((m, i) => (
        <span
          key={i}
          className="inline-block px-2 py-0.5 text-[11px] bg-gray-100 text-gray-700 rounded-md whitespace-nowrap"
        >
          {m}
        </span>
      ))}
      {!expanded && remaining > 0 && (
        <button
          onClick={() => setExpanded(true)}
          className="inline-block px-2 py-0.5 text-[11px] bg-blue-50 text-blue-600 rounded-md whitespace-nowrap hover:bg-blue-100"
        >
          +{remaining} more
        </button>
      )}
      {expanded && modules.length > VISIBLE_COUNT && (
        <button
          onClick={() => setExpanded(false)}
          className="inline-block px-2 py-0.5 text-[11px] bg-gray-50 text-gray-500 rounded-md whitespace-nowrap hover:bg-gray-100"
        >
          Show less
        </button>
      )}
    </div>
  );
}

/* ================= COMPONENT ================= */

export default function ViewUsersModal({ open, role, onClose }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!open) return;

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) { setUsers([]); return; }

    const parsed = JSON.parse(raw);
    const now = Date.now();

    if (now > parsed.expiry) {
      localStorage.removeItem(STORAGE_KEY);
      setUsers([]);
      return;
    }

    const allUsers: User[] = parsed.value || [];
    setUsers(allUsers.filter((u) => u.role === role));
  }, [open, role]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-5xl bg-white rounded-xl p-6 shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold mb-4">Users – {role}</h2>

          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 w-28">Name</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 w-44">Email</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 w-28">Phone</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 w-24">Role</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 w-24">Password</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600">Modules</th>
                  <th className="px-3 py-2 text-left font-medium text-gray-600 w-24">Created</th>
               
                </tr>
              </thead>

              <tbody>
                {users.length ? (
                  users.map((u) => (
                    <tr key={u.id} className="border-t align-top">
                      <td className="px-3 py-2">{u.name}</td>
                      <td className="px-3 py-2 break-all">{u.email}</td>
                      <td className="px-3 py-2">{u.phone}</td>
                      <td className="px-3 py-2">{u.role}</td>
                      <td className="px-3 py-2">{u.password}</td>
                      <td className="px-3 py-2">
                        <ModuleCell modules={Array.isArray(u.modules) ? u.modules : []} />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end mt-4">
            <button onClick={onClose} className="px-6 h-10 border rounded-lg text-sm">
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}