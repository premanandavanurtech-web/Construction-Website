"use client";

import { useEffect, useState, useCallback } from "react";
import { Search, Eye, Trash2, Pencil } from "lucide-react";

type StockItem = {
  name: string;
  category: string;
  current: number;
  min: number;
  location: string;
  status: string;
  updated: string;
  expiresAt: number;
};

export default function MachineryClient({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [search, setSearch] = useState("");
  const [debugKeys, setDebugKeys] = useState<string[]>([]);

  const loadStock = useCallback(() => {
    const now = Date.now();
    const loaded: StockItem[] = [];
    const foundKeys: string[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("stock-")) {
        foundKeys.push(key);
      }

      if (key.startsWith(`stock-${projectId}-`)) {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        try {
          const parsed: StockItem = JSON.parse(raw);
          if (parsed.expiresAt > now) {
            loaded.push(parsed);
          } else {
            localStorage.removeItem(key);
          }
        } catch {
          console.error("Failed to parse:", key);
        }
      }
    });

    console.log("All stock keys:", foundKeys);
    console.log("projectId:", projectId);
    console.log("Loaded items:", loaded);

    setDebugKeys(foundKeys);
    setItems(loaded);
  }, [projectId]);

  useEffect(() => {
    loadStock();

    const handleCustom = () => loadStock();
    window.addEventListener("stock-updated", handleCustom);
    window.addEventListener("categories-updated", handleCustom);

    const handleStorage = (e: StorageEvent) => {
      if (e.key?.startsWith(`stock-${projectId}-`)) loadStock();
    };
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("stock-updated", handleCustom);
      window.removeEventListener("categories-updated", handleCustom);
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadStock]);

  const machinery = items.filter(
    (item) =>
      item.category.trim().toLowerCase() === "machinery" &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">

  

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search Machinery..."
          className="w-full h-10 pl-10 pr-4 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="px-4 py-3 text-left font-medium text-gray-500">Item Name</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Category</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Stock</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Min</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Location</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Updated</th>
              <th className="px-4 py-3 text-center font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {machinery.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-gray-400">
                  {items.length === 0 ? "No items loaded — check debug panel above" : "No machinery items found"}
                </td>
              </tr>
            ) : (
              machinery.map((item, i) => (
                <tr key={i} className="border-b last:border-none hover:bg-gray-50">
                  <td className="px-4  text-black py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3 text-black">{item.category}</td>
                  <td className="px-4  text-black py-3">{item.current}</td>
                  <td className="px-4  text-black py-3 ">{item.min}</td>
                  <td className="px-4  text-black py-3">{item.location}</td>
                  <td className="px-4  text-black py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.current <= item.min ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{item.updated}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center  gap-3 text-black">
                      <button className="hover:text-blue-500"><Eye size={16} /></button>
                      <button className="hover:text-red-500" onClick={() => { localStorage.removeItem(`stock-${projectId}-${item.name}`); loadStock(); }}><Trash2 size={16} /></button>
                      <button className="hover:text-yellow-500"><Pencil size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}