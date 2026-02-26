"use client";

import { Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
const ACCESS_REQUEST_KEY = "accessRequests";
const USERS_KEY = "users";

type Request = {
  email: string;
  name?: string;
  phone?: string;
  role: string;
  modules: string[];
  date?: string;
  createdAt?: number;
  status: "pending" | "approved" | "rejected";
};

/* ================= STORAGE HELPERS ================= */

function loadRequests(): Request[] {
  const raw = localStorage.getItem(ACCESS_REQUEST_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(ACCESS_REQUEST_KEY);
      return [];
    }
    return parsed.data || [];
  } catch {
    return [];
  }
}

function saveRequests(data: Request[]) {
  localStorage.setItem(
    ACCESS_REQUEST_KEY,
    JSON.stringify({ data, expiresAt: Date.now() + ONE_WEEK })
  );
}

function loadUsers(): any[] {
  const raw = localStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return parsed.data || [];
  } catch {
    return [];
  }
}

function saveUsers(data: any[]) {
  localStorage.setItem(
    USERS_KEY,
    JSON.stringify({ data, expiresAt: Date.now() + ONE_WEEK })
  );
}

/* ================= MODULE CELL ================= */

const VISIBLE_COUNT = 2;

function ModuleCell({ modules }: { modules: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (!modules || modules.length === 0) return <span className="text-gray-400">—</span>;

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

export default function AccessRequest() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ role: "", module: "", date: "" });

  useEffect(() => {
    setRequests(loadRequests());
    const refresh = () => setRequests(loadRequests());
    window.addEventListener("access-request-refresh", refresh);
    return () => window.removeEventListener("access-request-refresh", refresh);
  }, []);

  /* ================= ACTIONS ================= */

  const approveRequest = (index: number) => {
    const updatedRequests = requests.map((r, i) =>
      i === index ? { ...r, status: "approved" } : r
    );
    const approved = updatedRequests[index];
    setRequests(updatedRequests);
    saveRequests(updatedRequests);

    const users = loadUsers();
    const exists = users.some((u) => u.email === approved.email);
    if (exists) return;

    const newUser = {
      email: approved.email,
      name: approved.name || "",
      role: approved.role,
      access: approved.modules.reduce(
        (acc: Record<string, boolean>, m: string) => {
          acc[`module-${m}`] = true;
          return acc;
        },
        {}
      ),
      createdAt: Date.now(),
    };

    saveUsers([...users, newUser]);
    window.dispatchEvent(new Event("users-updated"));
  };

  const rejectRequest = (index: number) => {
    const updated = requests.map((r, i) =>
      i === index ? { ...r, status: "rejected" } : r
    );
    setRequests(updated);
    saveRequests(updated);
  };

  /* ================= FILTER OPTIONS ================= */

  const uniqueRoles = useMemo(
    () => [...new Set(requests.map((r) => r.role).filter(Boolean))],
    [requests]
  );

  const uniqueModules = useMemo(
    () => [...new Set(requests.flatMap((r) => r.modules || []))],
    [requests]
  );

  const filteredRequests = useMemo(() => {
    const s = searchTerm.toLowerCase();
    return requests.filter((r) => {
      const name = (r.name || "").toLowerCase();
      const email = (r.email || "").toLowerCase();
      const reqDate =
        r.date ||
        (r.createdAt ? new Date(r.createdAt).toISOString().split("T")[0] : "");
      return (
        (name.includes(s) || email.includes(s)) &&
        (!filters.role || r.role === filters.role) &&
        (!filters.module || (r.modules || []).includes(filters.module)) &&
        (!filters.date || reqDate === filters.date)
      );
    });
  }, [requests, searchTerm, filters]);

  /* ================= UI ================= */

  return (
    <div className="bg-white text-black border border-gray-200 rounded-xl p-5 space-y-4">
      <div>
        <h2 className="text-base font-bold">Pending Access Requests</h2>
        <p className="text-sm text-gray-500">Approve or reject access requests</p>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email"
            className="w-full h-10 pl-9 border rounded-lg text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters((p) => !p)}
          className="h-10 px-5 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
        >
          {showFilters ? "Hide Filters" : "Filters"}
        </button>
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="flex gap-3 flex-wrap">
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
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left py-3 w-40">User</th>
            <th className="text-left py-3 w-28">Role</th>
            <th className="text-left py-3">Modules</th>
            <th className="text-left py-3 w-28">Date</th>
            <th className="text-right py-3 w-36">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredRequests.map((r, i) => {
            const realIndex = requests.indexOf(r);
            const date =
              r.date ||
              (r.createdAt
                ? new Date(r.createdAt).toISOString().split("T")[0]
                : "—");

            return (
              <tr key={i} className="border-b hover:bg-gray-50 align-top">
                {/* User */}
                <td className="py-3 pr-3">
                  <div className="font-medium">{r.name || r.email.split("@")[0]}</div>
                  <div className="text-xs text-gray-400">{r.email}</div>
                </td>

                {/* Role */}
                <td className="py-3 pr-3 text-gray-700">{r.role}</td>

                {/* Modules — badge style with expand */}
                <td className="py-3 pr-3">
                  <ModuleCell modules={r.modules || []} />
                </td>

                {/* Date */}
                <td className="py-3 pr-3 text-gray-700 whitespace-nowrap">{date}</td>

                {/* Actions */}
                <td className="py-3 text-right">
                  <div className="flex justify-end gap-2">
                    {r.status === "pending" && (
                      <>
                        <button
                          onClick={() => approveRequest(realIndex)}
                          className="px-4 py-1 text-xs border border-green-500 text-green-600 rounded hover:bg-green-50"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => rejectRequest(realIndex)}
                          className="px-4 py-1 text-xs border border-red-500 text-red-500 rounded hover:bg-red-50"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <span className="px-4 py-1 text-xs rounded bg-green-100 text-green-700 border">
                        Approved
                      </span>
                    )}
                    {r.status === "rejected" && (
                      <span className="px-4 py-1 text-xs rounded bg-red-100 text-red-600">
                        Rejected
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}

          {filteredRequests.length === 0 && (
            <tr>
              <td colSpan={5} className="py-8 text-center text-gray-400">
                No access requests
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}