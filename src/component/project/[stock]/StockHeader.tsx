export default function StockHeader() {
  return (
    <div className="flex items-center justify-between">
      {/* Left side */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Stock Management
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          track, organize, and control their inventory in real-time
        </p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button className="px-6 py-2 rounded-lg border border-gray-900 text-gray-900 font-medium hover:bg-gray-100 transition">
          Issue Stock
        </button>

        <button className="px-6 py-2 rounded-lg bg-slate-700 text-white font-medium hover:bg-slate-800 transition">
          + Add Stock
        </button>
      </div>
    </div>
  );
}