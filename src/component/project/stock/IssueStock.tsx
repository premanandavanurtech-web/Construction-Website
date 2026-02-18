"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit?: () => void;
};

export default function IssueStockModal({ open, onClose, onSubmit }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[520px] bg-white rounded-2xl shadow-xl p-6">
        {/* Title */}
        <h2 className="text-xl text-slate-800
         font-semibold mb-6">Issue Stock</h2>

        {/* Form */}
        <div className="space-y-4 text-black">
          {/* Select Item */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Select Item
            </label>
            <input
              className="w-full h-10 rounded-md bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Quantity
            </label>
            <input
              className="w-full h-10 rounded-md bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Unit */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Unit
            </label>
            <input
              className="w-full h-10 rounded-md bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Issue To */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Issue To (Site/Phase)
            </label>
            <input
              className="w-full h-10 rounded-md bg-gray-100 px-3 outline-none"
            />
          </div>

          {/* Upload */}
          <div>
            <label className="text-sm text-gray-700 block mb-1">
              Delivery Chalan/Invoice
            </label>

            <div className="border border-dashed border-gray-300 rounded-lg h-28 flex flex-col items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-50">
              <svg
                className="w-5 h-5 mb-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1"
                />
              </svg>
              <p>Upload A File or Drag And Drop</p>
              <p className="text-xs">PNG, JPG, PDF up to 50MB</p>
              <input type="file" className="hidden" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            className="px-6 py-2 rounded-lg bg-slate-700 text-white hover:bg-slate-800"
          >
            Issue Stock
          </button>
        </div>
      </div>
    </div>
  );
}
