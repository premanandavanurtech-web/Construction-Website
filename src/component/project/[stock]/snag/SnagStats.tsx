"use client";

type Stat = {
  label: string;
  value: number | string;
};

const stats: Stat[] = [
  { label: "Total Issues", value: '05' },
  { label: "Unresolved", value: '03' },
  { label: "In Progress", value: '01' },
  { label: "Resolved", value: '01' },
  { label: "Critical", value: '01'},
];

export default function SnagStats() {
  return (
    <div className="grid grid-cols-5 gap-4 mb-6">
      {stats.map((s) => (
        <div
          key={s.label}
          className="border rounded-lg p-4 bg-white"
        >
          <p className="text-xs text-zinc-500">{s.label}</p>
          <p className="text-2xl font-semibold text-black mt-1">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  );
}