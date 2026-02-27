"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import EditUserPermissionsModal from "./EditUserPermissionsModal";
import DeleteConfirmModal from "./DeleteConfirmModal";
import ViewUserModal from "./ViewUserModal";

type User = {
  id?: string;
  name?: string;
  email: string;
  phone?: string;
  password?: string;
  role: string;
  access?: Record<string, boolean>;
  createdAt: number;
  lastLogin?: number;
};

export default function ActivePermissions() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [openView, setOpenView] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [filters, setFilters] = useState({ role: "", module: "", date: "" });
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  /* ---------------- LOAD USERS ---------------- */
  useEffect(() => {
    const loadUsers = () => {
      const raw = localStorage.getItem("users");
      if (!raw) { setUsers([]); return; }
      try {
        const parsed = JSON.parse(raw);
        if (Date.now() > parsed.expiresAt) {
          localStorage.removeItem("users");
          setUsers([]);
          return;
        }
        setUsers(parsed.data || []);
      } catch {
        localStorage.removeItem("users");
        setUsers([]);
      }
    };

    loadUsers();

    const onFocus = () => loadUsers();
    window.addEventListener("focus", onFocus);
    window.addEventListener("users-updated", loadUsers);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) loadUsers();
    });

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("users-updated", loadUsers);
    };
  }, []);

  /* ---------------- UNIQUE ROLES ---------------- */
  const uniqueRoles = useMemo(() => {
    return [...new Set(users.map((u) => u.role).filter(Boolean))];
  }, [users]);

  /* ---------------- UNIQUE MODULES ---------------- */
  const uniqueModules = useMemo(() => {
    return [
      ...new Set(
        users.flatMap((u) => {
          if (!u.access) return [];
          return Object.keys(u.access)
            .filter((k) => u.access?.[k])
            .map((k) => k.split("-")[1] || k);
        })
      ),
    ];
  }, [users]);

  /* ---------------- SEARCH + FILTER ---------------- */
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      const searchText = search.toLowerCase();

      const modules = u.access
        ? Object.keys(u.access)
            .filter((k) => u.access?.[k])
            .map((k) => k.split("-")[1] || k)
        : [];

      const userDate = new Date(u.createdAt).toISOString().split("T")[0];

      return (
        (name.includes(searchText) ||
          email.includes(searchText) ||
          role.includes(searchText)) &&
        (!filters.role || u.role === filters.role) &&
        (!filters.module || modules.includes(filters.module)) &&
        (!filters.date || userDate === filters.date)
      );
    });
  }, [users, search, filters]);

  /* ---------------- DELETE ---------------- */
  const handleConfirmDelete = () => {
    if (!userToDelete) return;

    const updatedUsers = users.filter((u) => u.email !== userToDelete.email);
    setUsers(updatedUsers);

    const raw = localStorage.getItem("users");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        localStorage.setItem("users", JSON.stringify({ ...parsed, data: updatedUsers }));
      } catch {}
    }

    setOpenDelete(false);
    setUserToDelete(null);
  };

  return (
    <div className="bg-white text-black border rounded-xl p-5">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Access Management</h2>
        <p className="text-sm text-zinc-500">Approved users with active access</p>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or role..."
            className="w-full h-10 pl-10 border rounded-lg text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters((p) => !p)}
          className="h-10 px-5 border rounded-lg text-sm"
        >
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex gap-3 flex-wrap mb-4">
          <select
            value={filters.role}
            onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
            className="border h-9 rounded px-2 text-sm"
          >
            <option value="">All Roles</option>
            {uniqueRoles.map((r) => <option key={r}>{r}</option>)}
          </select>

          <select
            value={filters.module}
            onChange={(e) => setFilters((f) => ({ ...f, module: e.target.value }))}
            className="border h-9 rounded px-2 text-sm"
          >
            <option value="">All Modules</option>
            {uniqueModules.map((m) => <option key={m}>{m}</option>)}
          </select>

          <input
            type="date"
            value={filters.date}
            onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
            className="border h-9 rounded px-2 text-sm"
          />

          <button
            onClick={() => setFilters({ role: "", module: "", date: "" })}
            className="text-sm text-zinc-500 underline"
          >
            Clear
          </button>
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-zinc-50">
            <tr className="text-left text-zinc-600">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Module Access</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={i} className="border-t">
                <td className="px-4 py-3">
                  {/* ── CHANGED: show name + email below ── */}
                  <div className="font-medium">
                    {u.name || u.email.split("@")[0]}
                  </div>
                  <div className="text-xs text-zinc-500">{u.email}</div>
                </td>

                <td className="px-4 py-3">{u.role}</td>

                <td className="px-4 py-3 text-xs">
                  {u.access
                    ? Object.keys(u.access)
                        .filter((k) => u.access?.[k])
                        .map((k) => k.split("-")[1] || k)
                        .join(", ")
                    : "—"}
                </td>

                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded text-xs bg-green-100 text-green-700 border">
                    Active
                  </span>
                </td>

                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => { setViewUser(u); setOpenView(true); }}
                      className="px-4 py-1 text-xs border rounded"
                    >
                      View
                    </button>
                    <button
                      onClick={() => { setSelectedUser(u); setOpenEdit(true); }}
                      className="px-4 py-1 text-xs border rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { setUserToDelete(u); setOpenDelete(true); }}
                      className="px-4 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-zinc-500">
                  No active users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <EditUserPermissionsModal
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={selectedUser ? { ...selectedUser, name: selectedUser.name ?? "" } : null}
      />
      <DeleteConfirmModal
        open={openDelete}
        onCancel={() => { setOpenDelete(false); setUserToDelete(null); }}
        onConfirm={handleConfirmDelete}
      />
      <ViewUserModal
        open={openView}
        user={viewUser}
        onClose={() => { setOpenView(false); setViewUser(null); }}
      />
    </div>
  );
}