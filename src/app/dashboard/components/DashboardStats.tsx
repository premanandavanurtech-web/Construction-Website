import React from "react";

type StatItem = {
  label: string;
  value: string | number;
};

const stats: StatItem[] = [
  {
    label: "Total Projects",
    value: 12,
  },
  {
    label: "Active Tasks",
    value: 186,
  },
  {
    label: "Budget Variance",
    value: "-3.2%",
  },
  {
    label: "Team Member",
    value: 35,
  },
];

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-xl p-4"
        >
          <p className="text-sm text-gray-500">
            {item.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-gray-900">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;