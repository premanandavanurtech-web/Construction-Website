"use client";

import { useEffect, useState } from "react";

type StockLog = {
  item: string;
  type:  "Received";
  quantity: string;
  from: string;
  to: string;
  issuedBy: string;
  date: string;
  invoice: string;
};

export default function StockMovementLogPage() {
   const [logs, setLogs] = useState<StockLog[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("stockLogs");
    if (stored) {
      setLogs(JSON.parse(stored));
    }
  }, []);
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      
      {/* Title */}
      <h2 className="text-sm font-medium text-gray-900 mb-4">
        Stock Movement Log
      </h2>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-700 font-medium">
              <th className="px-4 py-3">Item Name</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Quantity</th>
              <th className="px-4 py-3">From</th>
              <th className="px-4 py-3">To</th>
              <th className="px-4 py-3">Issued By</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Invoice/Po</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((row, i) => (
              <tr
                key={i}
                className="border-t border-gray-200 last:border-b-0"
              >
                <td className="px-4 py-3 font-medium text-gray-900">
                  {row.item}
                </td>

                {/* Type badge */}
                <td className="px-4 py-3">
                  {row.type === "Issue" ? (
                    <span className="inline-flex items-center px-3 py-[2px] text-xs font-medium rounded-sm bg-indigo-100 text-indigo-700 border border-indigo-300">
                      Issue
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-[2px] text-xs font-medium rounded-sm bg-green-100 text-green-700 border border-green-300">
                      Received
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-gray-900">
                  {row.quantity}
                </td>

                <td className="px-4 py-3 text-gray-900">
                  {row.from}
                </td>

                <td className="px-4 py-3 text-gray-900">
                  {row.to}
                </td>

                <td className="px-4 py-3 text-gray-900">
                  {row.issuedBy}
                </td>

                <td className="px-4 py-3 text-gray-500">
                  {row.date}
                </td>

                <td className="px-4 py-3">
                  <a
                    href="#"
                    className="text-[#344960] underline underline-offset-2 text-sm"
                  >
                    {row.invoice}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}