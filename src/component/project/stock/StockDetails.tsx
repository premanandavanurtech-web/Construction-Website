"use client";

import { StockItem } from "@/src/ts/stock";

type Props = {
  item: StockItem;
  onBack: () => void;
};

export default function StockDetails({ item, onBack }: Props) {
     if (!item) return null;
  return (
    <div className="bg-white border rounded-xl p-6">
      {/* Back */}
      <button
        onClick={onBack}
        className="text-sm text-blue-600 mb-4"
      >
        ← View Details
      </button>

      <h2 className="text-xl font-semibold text-black mb-4">
        {item.name} ({item.unit || "50kg"})
      </h2>

      {/* Info */}
      <div className="grid text-black grid-cols-4 gap-6 text-sm mb-6">
        <div>
          <p className="text-gray-500">Storage Location</p>
          <p className="font-medium">{item.location}</p>
        </div>

        <div>
          <p className="text-gray-500">Quantity</p>
          <p className="font-medium">{item.current} Bags</p>
        </div>

        <div>
          <p className="text-gray-500">Minimum Stock</p>
          <p className="font-medium">{item.min} Bags</p>
        </div>

        <div>
          <p className="text-gray-500">Vendor</p>
          <p className="font-medium">{item.vendor || "--"}</p>
        </div>
      </div>

      {/* Usage History */}
      <h3 className="font-medium text-black mb-3">
        Usage Detail
      </h3>

      <div className="border text-black rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-3 py-2 text-left">Material</th>
              <th className="px-3 py-2 text-left">Quantity Used</th>
              <th className="px-3 py-2 text-left">Task</th>
              <th className="px-3 py-2 text-left">Location</th>
              <th className="px-3 py-2 text-left">Approved By</th>
              <th className="px-3 py-2 text-left">Remarks</th>
            </tr>
          </thead>

          <tbody>
            {item.history?.length ? (
              item.history.map((h, i) => (
                <tr key={i} className="border-t">
                  <td className="px-3 py-2">
                    {new Date(h.timestamp).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">{item.name}</td>
                  <td className="px-3 py-2">{h.quantityUsed} Bags</td>
                  <td className="px-3 py-2">{h.task}</td>
                  <td className="px-3 py-2">{item.location}</td>
                  <td className="px-3 py-2">{h.approvedBy}</td>
                  <td className="px-3 py-2">{h.remarks}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No usage history found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}