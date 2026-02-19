"use client";

import { useEffect, useState } from "react";

type StockLog = {
  item: string;
  type: "Received" | "Issued";
  quantity: string;
  from: string;
  to: string;
  issuedBy: string;
  date: string;
  invoice: string;
};

export default function IssuedStockCard() {
  const [issuedLogs, setIssuedLogs] = useState<StockLog[]>([]);

  useEffect(() => {
    const logs: StockLog[] = JSON.parse(
      localStorage.getItem("stockLogs") || "[]"
    );

    const issued = logs.filter((log) => log.type === "Issued");
    setIssuedLogs(issued);
  }, []);

  if (issuedLogs.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-sm font-medium text-gray-900">
        Issued Stock
      </h2>

      {issuedLogs.map((log, index) => (
        <div
          key={index}
          className="bg-white border border-gray-300 rounded-2xl p-6 w-full max-w-xl"
        >
          <p className="text-gray-500 text-sm mb-3">
            Issued Details
          </p>

          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-900">
                {log.item}
              </h3>

              <p className="text-lg font-medium text-gray-900">
                {log.quantity}
              </p>

              <p className="text-gray-600">
                sent to:{" "}
                <span className="font-semibold text-gray-900">
                  {log.to}
                </span>
              </p>
            </div>

            <button className="px-6 py-2 rounded-xl border-2 border-slate-700 text-slate-700 hover:bg-slate-700 hover:text-white transition">
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
