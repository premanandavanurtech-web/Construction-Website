import { Eye, Pencil, Trash2 } from "lucide-react";

const orders = Array.from({ length: 8 }).map(() => ({
  id: "PO-2025-001",
  date: "Oct 1, 2026",
  supplier: "BuildMart Ltd",
  delivery: "Oct 5, 2026",
  amount: "₹229,500",
  status: "In Progress",
  items: [
    "Cement OPC 53 (150 bags)",
    "Steel Rods 12mm (2500 kg)",
  ],
}));

export default function OrdersTable() {
  return (
    <div className="border text-black rounded-lg bg-white">
      {/* Search */}
      <div className="flex items-center justify-between p-4 border-b">
        <input
          placeholder="Search By Order Name,ID,Supplier"
          className="border px-3 py-2 rounded-md text-sm w-[350px]"
        />
        <button className="border px-4 py-2 rounded-md text-sm">
          Filters
        </button>
      </div>

      {/* Table */}
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="text-left p-3">Order ID</th>
            <th className="text-left p-3">Order Date</th>
            <th className="text-left p-3">Supplier</th>
            <th className="text-left p-3">Expected/Delivery Date</th>
            <th className="text-left p-3">Amount</th>
            <th className="text-left p-3">Status</th>
            <th className="text-left p-3">Items</th>
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o, i) => (
            <tr key={i} className="border-t">
              <td className="p-3">{o.id}</td>
              <td className="p-3">{o.date}</td>
              <td className="p-3">{o.supplier}</td>
              <td className="p-3">{o.delivery}</td>
              <td className="p-3 font-medium">{o.amount}</td>
              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    i === 0
                      ? "bg-green-100 text-green-700"
                      : "bg-indigo-100 text-indigo-700"
                  }`}
                >
                  {i === 0 ? "Received" : o.status}
                </span>
              </td>
              <td className="p-3 text-xs text-gray-600">
                {o.items.map((item, idx) => (
                  <div key={idx}>{idx + 1}. {item}</div>
                ))}
              </td>
              <td className="p-3">
                <div className="flex gap-3">
                  <Eye size={16} />
                  <Trash2 size={16} />
                  <Pencil size={16} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}