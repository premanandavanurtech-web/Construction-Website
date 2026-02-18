"use client";

type StockItem = {
  name: string;
  category: string;
  current: number;
  min: number;
  location: string;
  status: string;
  createdAt: number; // ✅ timestamp
};

type Props = {
  projectId: string;
  stocks: StockItem[];
  onEdit: (item: StockItem) => void;
  onDelete: (item: StockItem) => void;
};

export default function CurrentStock({
  stocks,
  onEdit,
  onDelete,
}: Props) {
  return (
    <>
      {/* 📋 TABLE BODY ONLY */}
      <tbody className="divide-y">
        {stocks.length === 0 ? (
          <tr>
            <td colSpan={8} className="py-10 text-center text-gray-500">
              No stock items found
            </td>
          </tr>
        ) : (
          stocks.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-black font-medium">{item.name}</td>

              <td className="px-6 py-4 text-black">{item.category}</td>

              <td className="px-6 py-4 text-black">{item.current}</td>
              <td className="px-6 py-4 text-gray-500">{item.min}</td>

              <td className="px-6 py-4 text-black">{item.location}</td>

              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-md text-xs font-medium border ${
                    item.status === "Low Stock"
                      ? "bg-red-100 text-red-700 border-red-300"
                      : "bg-green-100 text-green-700 border-green-300"
                  }`}
                >
                  {item.status}
                </span>
              </td>

              <td className="px-6 py-4 text-gray-500">
                {formatTimeAgo(item.createdAt)}
              </td>

              <td className="px-6 py-4">
                <div className="flex text-black gap-4">
                  <button onClick={() => onEdit(item)}>👁</button>
                  <button onClick={() => onDelete(item)}>🗑</button>
                  <button onClick={() => onEdit(item)}>✏️</button>
                </div>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </>
  );
}

/* 🕒 Time formatter */
function formatTimeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) {
    const mins = Math.floor(diff / minute);
    return `${mins} min${mins > 1 ? "s" : ""}`;
  }
  if (diff < day) {
    const hrs = Math.floor(diff / hour);
    return `${hrs} hour${hrs > 1 ? "s" : ""}`;
  }

  return new Date(timestamp).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
