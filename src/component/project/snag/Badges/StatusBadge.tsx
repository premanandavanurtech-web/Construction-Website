"use client";

type Status =
  | "pending"
  | "unresolved"
  | "in-progress"
  | "resolved";

const styles: Record<Status, string> = {
  pending: " bg-yellow-100 text-yellow-700 border border-yellow-300",
  unresolved: "bg-zinc-200 text-zinc-700 border border-zinc-300",
  "in-progress": "bg-blue-100 text-blue-700 border border-blue-300",
  resolved: "bg-green-100 text-green-700 border border-green-300",
};
export default function SnagStatusBadge({
    status,
}: {
    status: Status;
}) {
    console.log("STATUS VALUE:", status);
  return (
    <span
      className={`px-3 py-0.5  rounded  text-[10px] font-medium ${styles[status]}`}
    >
      {status.replace("-", " ").toUpperCase()}
    </span>
  );
}