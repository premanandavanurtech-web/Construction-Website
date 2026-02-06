"use client";

type Priority = "high" | "critical";

const styles: Record<Priority, string> = {
  high: "bg-red-100 text-red-600 border border-red-300",
  critical: "bg-red-200 text-red-700 border border-red-400",
};

export default function SnagPriorityBadge({
  priority,
}: {
  priority: Priority;
}) {
  return (
    <span
      className={`px-6 py-0.5 rounded text-[10px] font-medium ${styles[priority]}`}
    >
      {priority.toUpperCase()}
    </span>
  );
}