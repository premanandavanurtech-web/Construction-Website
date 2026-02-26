"use client";

const requests = Array.from({ length: 10 }).map(() => ({
  order: "Cement 50kg (250 Bags)",
  requestedBy: "Rajesh(supervisor)",
  date: "3rd November 2025",
  amount: "₹229,500",
}));

export default function OrderRequestTable() {
  return (
    <div className="border text-black rounded-lg bg-white p-3">
      {/* Search & Filter */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search By Order Name,ID,Supplier"
            className="w-full border rounded-md pl-9 pr-3 py-2 text-sm"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">
            🔍
          </span>
        </div>

        <button className="border px-5 py-2 rounded-md text-sm text-[#2F3E4E]">
          Filters
        </button>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white border-b">
            <tr className="text-gray-700">
              <th className="text-left px-4 py-2 font-medium">Order</th>
              <th className="text-left px-4 py-2 font-medium">
                Requested By
              </th>
              <th className="text-left px-4 py-2 font-medium">
                Requested Date
              </th>
              <th className="text-left px-4 py-2 font-medium">Amount</th>
              <th className="text-right px-4 py-2 font-medium">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {requests.map((item, i) => (
              <tr key={i} className="border-b last:border-b-0">
                <td className="px-4 py-2">{item.order}</td>
                <td className="px-4 py-2">{item.requestedBy}</td>
                <td className="px-4 py-2">{item.date}</td>
                <td className="px-4 py-2">{item.amount}</td>

                {/* Actions */}
                <td className="px-4 py-2">
                  <div className="flex justify-end gap-2">
                    <button className="px-2.5 py-0.5 text-xs rounded border bg-gray-200 text-gray-700">
                      View
                    </button>
                    <button className="px-2.5 py-0.5 text-xs rounded border bg-green-100 text-green-700">
                      Approve
                    </button>
                    <button className="px-2.5 py-0.5 text-xs rounded border bg-red-100 text-red-600">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}