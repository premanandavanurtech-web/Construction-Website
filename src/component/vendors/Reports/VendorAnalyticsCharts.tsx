"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ───────── DATA ───────── */

const spendData = [
  { month: "May", value: 800000 },
  { month: "June", value: 550000 },
  { month: "July", value: 320000 },
  { month: "August", value: 260000 },
];

const expenseData = [
  { name: "Material", value: 69, color: "#0000FF" },
  { name: "Equipment", value: 15, color: "#E52B1A" },
  { name: "Subcontractors", value: 11, color: "#59B36A" },
  { name: "Misc", value: 4, color: "#F2E94E" },
];

export default function VendorAnalyticsCharts() {
  return (
    <div className="space-y-6">

      {/* Vendor Spend Summary */}
      

      {/* Expense Breakdown */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Expense Breakdown
        </h2>

        <div className="flex justify-center">
          <PieChart width={300} height={300}>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={110}
              label={({ name, value }) => `${name}-${value}%`}
            >
              {expenseData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </div>
      </div>

    </div>
  );
}