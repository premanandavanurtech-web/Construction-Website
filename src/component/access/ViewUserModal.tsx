"use client";

type User = {
  id?: string;
  name?: string;
  email: string;
  phone?: string;
  role: string;
  access?: Record<string, boolean>;
  createdAt: number;
  lastLogin?: number;
};

type Props = {
  open: boolean;
  user: User | null;
  onClose: () => void;
};

export default function ViewUserModal({ open, user, onClose }: Props) {
  if (!open || !user) return null;

  const modules = user.access
    ? Object.keys(user.access)
        .filter((k) => user.access[k])
        .map((k) => k.split("-")[1] || k)
        .join(", ")
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          User Details
        </h3>

        <div className="space-y-2 text-sm">
          <Detail label="Name" value={user.name || "—"} />
          <Detail label="Email" value={user.email} />
          <Detail label="Phone" value={user.phone || "—"} />
          <Detail label="Role" value={user.role} />
          <Detail label="Modules" value={modules || "—"} />

          <Detail
            label="Status"
            value="Active"
          />

          <Detail
            label="Last Login"
            value={
              user.lastLogin
                ? new Date(user.lastLogin).toLocaleString()
                : "—"
            }
          />

          <Detail
            label="Created At"
            value={new Date(user.createdAt).toLocaleString()}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 h-9 text-sm border rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- DETAIL ROW ---------------- */

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex justify-between gap-4 border-b pb-1">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-right break-all">
        {value}
      </span>
    </div>
  );
}