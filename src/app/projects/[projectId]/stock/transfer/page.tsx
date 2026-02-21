"use client";

import TransferRequestModal from "@/src/component/project/stock/TransferRequestModal";
import TransferDetailsModal from "@/src/component/project/stock/transfor/TransferDetailsModal";
import { useEffect, useState } from "react";

/* 1 week in milliseconds */
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

type Transfer = {
  itemName: string;
  quantity: string;
  requestedBy: string;
  sourceLocation: string;
  destinationLocation: string;
  createdAt: number;
  decision?: "accepted" | "rejected";
};

type FilterType = "all" | "accepted" | "rejected";

export default function StockTransferPage() {
  const [openTransfer, setOpenTransfer] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const [filter, setFilter] = useState<FilterType>("all");

  const [openDetails, setOpenDetails] = useState(false);
  const [selectedTransfer, setSelectedTransfer] =
    useState<Transfer | null>(null);

  /* 🔹 Load & clean expired transfers */
  useEffect(() => {
    const stored = localStorage.getItem("transfers");

    if (stored) {
      const parsed: Transfer[] = JSON.parse(stored);

      const valid = parsed.filter(
        (t) => Date.now() - t.createdAt < ONE_WEEK
      );

      setTransfers(valid);
    }

    setIsLoaded(true);
  }, []);

  /* 🔹 Persist transfers */
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem("transfers", JSON.stringify(transfers));
  }, [transfers, isLoaded]);

  /* 🔹 Apply filter */
  const filteredTransfers = transfers.filter((t) => {
    if (filter === "all") return true;
    return t.decision === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">
          Stock Transfers
        </h2>

        <button
          onClick={() => setOpenTransfer(true)}
          className="px-4 py-2 rounded-lg bg-[#344960] text-white text-sm font-medium"
        >
          + Create Transfer Request
        </button>
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border
            ${filter === "all"
              ? "bg-[#344960] text-white border-[#344960]"
              : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          All
        </button>

        <button
          onClick={() => setFilter("accepted")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border
            ${filter === "accepted"
              ? "bg-green-600 text-white border-green-600"
              : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          Accepted
        </button>

        <button
          onClick={() => setFilter("rejected")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border
            ${filter === "rejected"
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-700 border-gray-300"
            }`}
        >
          Rejected
        </button>
      </div>

      <TransferDetailsModal
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        data={selectedTransfer}
      />

      {/* Cards */}
      {filteredTransfers.length === 0 ? (
        <p className="text-sm text-gray-500">
          No transfers found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTransfers.map((item, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-200 rounded-xl p-5 space-y-4"
            >
              {/* Info */}
              <div>
                <p className="text-xs text-gray-500 mb-1">
                  Transfer Details
                </p>
                <p className="text-sm font-medium text-gray-900">
                  {item.itemName}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {item.quantity}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Requested By:{" "}
                  <span className="font-medium text-gray-900">
                    {item.requestedBy}
                  </span>
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                {!item.decision && (
                  <>
                    {/* ACCEPT */}
                    <button
                      className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium"
                      onClick={() => {
                        const newLog = {
                          item: item.itemName,
                          type: "Received",
                          quantity: item.quantity,
                          from: item.sourceLocation,
                          to: item.destinationLocation,
                          issuedBy: item.requestedBy,
                          date: new Date().toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }),
                          invoice: `INV-${Date.now()}`,
                        };

                        const logs = JSON.parse(
                          localStorage.getItem("stockLogs") || "[]"
                        );

                        localStorage.setItem(
                          "stockLogs",
                          JSON.stringify([...logs, newLog])
                        );

                        setTransfers((prev) =>
                          prev.map((t, i) =>
                            t === item
                              ? { ...t, decision: "accepted" }
                              : t
                          )
                        );
                      }}
                    >
                      Accept
                    </button>

                    {/* REJECT */}
                    <button
                      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium"
                      onClick={() =>
                        setTransfers((prev) =>
                          prev.map((t) =>
                            t === item
                              ? { ...t, decision: "rejected" }
                              : t
                          )
                        )
                      }
                    >
                      Reject
                    </button>
                  </>
                )}

                {/* DETAILS */}
                <button
                  className="px-4 py-2 rounded-lg border border-[#344960] text-[#344960] text-sm font-medium"
                  onClick={() => {
                    setSelectedTransfer(item);
                    setOpenDetails(true);
                  }}
                >
                  Details
                </button>
              </div>

              {/* STAMPS */}
              {item.decision === "accepted" && (
                <img
                  src="/stamp3.png"
                  alt="Accepted"
                  className="absolute top-6 right-6 h-28 opacity-80 rotate-[-10deg]"
                />
              )}

              {item.decision === "rejected" && (
                <img
                  src="/stamp.webp"
                  alt="Rejected"
                  className="absolute top-6 right-6 h-28 opacity-80 rotate-[-15deg]"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create Transfer Modal */}
      <TransferRequestModal
        open={openTransfer}
        onClose={() => setOpenTransfer(false)}
        onSubmit={(data) => {
          const newTransfer: Transfer = {
            ...data,
            createdAt: Date.now(),
          };

          setTransfers((prev) => [...prev, newTransfer]);
          setOpenTransfer(false);
        }}
      />
    </div>
  );
}
