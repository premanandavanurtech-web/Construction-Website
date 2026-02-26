"use client";

import { useState } from "react";
import AddStock from "./AddStock";
import IssueStockModal from "./IssueStock";

export default function StockHeader({ projectId }: { projectId: string }) {
  const [openAdd, setOpenAdd] = useState(false);
  const [open, setOpen] = useState(false);

  // 👇 Add this log to confirm projectId is arriving
  console.log("StockHeader projectId:", projectId);

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl text-[#38485e] font-semibold">Stock Management</h1>
          <p className="text-sm mt-2 text-gray-500">Track and control inventory</p>
        </div>
        <div>
          <button
            onClick={() => setOpen(true)}
            className="text-slate-700 bg-white mr-6 border-slate-800 border-2 px-6 py-2 rounded-lg"
          >
            Issue Stock
          </button>
          <button
            onClick={() => setOpenAdd(true)}
            className="bg-slate-700 text-white px-6 py-2 rounded-lg"
          >
            + Add Stock
          </button>
        </div>
      </div>

      <AddStock
        open={openAdd}
        projectId={projectId} // ✅ confirm this is not undefined
        onClose={() => setOpenAdd(false)}
      />
      <IssueStockModal
  open={open}
  onClose={() => setOpen(false)}
  onSubmit={() => console.log("Issued")}
  projectId={projectId} // ✅ add this
/>
    </>
  );
}