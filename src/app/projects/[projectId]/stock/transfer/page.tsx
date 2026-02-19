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
};

export default function StockTransferPage() {
  const [openTransfer, setOpenTransfer] = useState(false);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoaded, setIsLoaded] = useState(false); // 🔥 KEY FIX
const [rejectedIndexes, setRejectedIndexes] = useState<number[]>([]);
const [openDetails, setOpenDetails] = useState(false);
const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);

  /* 🔹 Load & clean expired data */
  useEffect(() => {
    const stored = localStorage.getItem("transfers");

    if (stored) {
      const parsed: Transfer[] = JSON.parse(stored);

      const validTransfers = parsed.filter(
        (item) => Date.now() - item.createdAt < ONE_WEEK
      );

      setTransfers(validTransfers);
    }

    setIsLoaded(true); // ✅ mark load complete
  }, []);

  /* 🔹 Save ONLY after initial load */
  useEffect(() => {
    if (!isLoaded) return; // 🔥 prevent overwrite

    localStorage.setItem("transfers", JSON.stringify(transfers));
  }, [transfers, isLoaded]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">
          Pending Transfers
        </h2>
<TransferDetailsModal
  open={openDetails}
  onClose={() => setOpenDetails(false)}
  data={selectedTransfer}
/>

        <button
          onClick={() => setOpenTransfer(true)}
          className="px-4 py-2 rounded-lg bg-[#344960] text-white text-sm font-medium"
        >
          + Create Transfer Request
        </button>
      </div>

      {/* Cards */}
      {transfers.length === 0 ? (
        <p className="text-sm text-gray-500">No transfer requests yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transfers.map((item, index) => (
            <div
              key={index}
              className="relative bg-white border border-gray-200 rounded-xl p-5 space-y-4"
            >
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

              <div className="flex items-center gap-3 pt-2">
                 {!rejectedIndexes.includes(index) && (
               <button
  className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium"
  onClick={() => {
    const newLog = {
      item: item.itemName,
      type: "Received",
      quantity: item.quantity,
      from: item.destinationLocation,
      to: item.destinationLocation,
      issuedBy: item.requestedBy,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      invoice: `INV-${Date.now()}`,
    };

    // 🔹 Get existing logs
    const existingLogs =
      JSON.parse(localStorage.getItem("stockLogs") || "[]");

    // 🔹 Save new log
    localStorage.setItem(
      "stockLogs",
      JSON.stringify([...existingLogs, newLog])
    );

    // 🔹 Remove accepted transfer
    setTransfers((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }}
>
  Accept
</button>
 )}
             {!rejectedIndexes.includes(index) && (
    <button
      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium"
      onClick={() => {
        setRejectedIndexes((prev) => [...prev, index]);
      }}
    >
      Reject
    </button>
  )}

  {/* REJECT IMAGE */}
 {rejectedIndexes.includes(index) && (
   <img
    src="/stamp.webp"
    alt="Rejected"
    className="absolute top-6 right-13 h-34 opacity-80 rotate-[-15deg] transition-opacity duration-300"
  />
)}



                <button 
                className="px-4 py-2  rounded-lg border border-[#344960] text-[#344960] text-sm font-medium"
                  onClick={() => {
    setSelectedTransfer(item);
    setOpenDetails(true);
  }}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
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
