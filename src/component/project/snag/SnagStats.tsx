"use client";

type Snag = {
  status: "unresolved" | "in-progress" | "resolved" | "pending";
  priority: "high" | "pending" | "low";
};

type Props = {
  issues: Snag[];
};

export default function SnagStats({ issues }: Props) {
  const total = issues.length;
  const unresolved = issues.filter((s) => s.status === "unresolved").length;
  const inProgress = issues.filter((s) => s.status === "in-progress").length;
  const resolved = issues.filter((s) => s.status === "resolved").length;
  const critical = issues.filter((s) => s.priority === "high").length;

  const stats = [
    { label: "Total Issues", value: total },
    { label: "Unresolved", value: unresolved },
    { label: "In Progress", value: inProgress },
    { label: "Resolved", value: resolved },
    { label: "Critical", value: critical },
  ];

  return (
    <div className="grid grid-cols-5 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white border border-gray-200 rounded-2xl p-4 space-y-2"
        >
          <p className="text-sm text-gray-500">{stat.label}</p>
          <p className="text-3xl font-bold text-black">
            {String(stat.value).padStart(2, "0")}
          </p>
        </div>
      ))}
    </div>
  );
}