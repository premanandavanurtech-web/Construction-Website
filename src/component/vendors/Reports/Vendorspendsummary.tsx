"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "May", spend: 810000 },
  { month: "June", spend: 550000 },
  { month: "July", spend: 330000 },
  { month: "August", spend: 275000 },
];

export default function VendorSpendSummary() {
  return (
    <div className="bg-white border mt-5 mb-5 border-gray-200 rounded-xl p-6 w-full">
      {/* Header */}
      <h2 className="text-base font-bold text-black">Vendor Spend Summary</h2>
      <p className="text-sm text-gray-500 mt-0.5 mb-6">
        Monthly spending trend over last 6 months
      </p>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={320}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 0 }}
          barCategoryGap="35%"
        >
          <CartesianGrid vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            axisLine={{ stroke: "#9ca3af" }}
            tickLine={false}
            tick={{ fill: "#000", fontSize: 13 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#000", fontSize: 12 }}
            tickFormatter={(v) => v.toLocaleString()}
            domain={[0, 900000]}
            ticks={[0, 200000, 400000, 600000, 800000]}
          />
          <Bar dataKey="spend" fill="#0000cc" radius={0} maxBarSize={80} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}