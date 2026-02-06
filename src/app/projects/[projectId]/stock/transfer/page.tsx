"use client";

const transfers = [
  {
    material: "Concrete Mix(M25)",
    quantity: "10 Tons",
    site: "Site B",
  },
  {
    material: "Concrete Mix(M25)",
    quantity: "10 Tons",
    site: "Site B",
  },
  {
    material: "Concrete Mix(M25)",
    quantity: "10 Tons",
    site: "Site B",
  },
];

export default function StockTransferPage() {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-900">
          Pending Transfers
        </h2>

        <button className="px-4 py-2 rounded-lg bg-[#344960] text-white text-sm font-medium">
          + Create Transfer Request
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transfers.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-xl p-5 space-y-4"
          >
            {/* Details */}
            <div>
              <p className="text-xs text-gray-500 mb-1">
                Transfer Details
              </p>
              <p className="text-sm font-medium text-gray-900">
                {item.material}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {item.quantity}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Requested By:{" "}
                <span className="font-medium text-gray-900">
                  {item.site}
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium">
                Accept
              </button>
              <button className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium">
                Reject
              </button>
              <button className="px-4 py-2 rounded-lg border border-[#344960] text-[#344960] text-sm font-medium">
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}