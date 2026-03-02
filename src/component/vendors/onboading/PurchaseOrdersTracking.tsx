"use client";

import { Search, Filter, Eye, Pencil, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import CreateOrderModal from "../../project/order/CreateOrderModal";

const ORDERS_KEY = "purchase_orders_list";

export type SavedOrder = {
  id: string;
  invoiceNo: string;
  vendorName: string;
  vendorEmail: string;
  address: string;
  city: string;
  phone: string;
  date: string;
  orderedDate: string;
  expectedDelivery: string;
  selectedProject: string;
  comments: string;
  total: number;
  subtotal: number;
  taxRate: string;
  items: {
    id: number;
    item: string;
    description: string;
    unit: string;
    unitCost: string;
    totalCost: string;
  }[];
  // vendor info
  vendorAddress: string;
  vendorShipping: string;
  vendorContact: string;
  // buyer
  buyerName: string;
  buyerAddress: string;
  buyerShipping: string;
  buyerContact: string;
  buyerEmail: string;
  signature: string;
  // meta
  status: "Active" | "Completed" | "Cancelled";
  paymentStatus: "Pending" | "Paid" | "Partial";
  createdAt: number;
};

function loadOrders(): SavedOrder[] {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedOrder[];
  } catch { return []; }
}

function saveOrders(orders: SavedOrder[]) {
  try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch {}
}

export { loadOrders, saveOrders };

// ─────────────────────────────────────────────────────────────
type Props = { projects?: { id: string; name: string }[] };

export default function PurchaseOrdersTracking({ projects = [] }: Props) {
  const [activeTab, setActiveTab] = useState("All Orders");
  const [open, setOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<SavedOrder | null>(null);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setOrders(loadOrders());
  }, []);

  const refreshOrders = () => setOrders(loadOrders());

  const handleDelete = (id: string) => {
    const updated = orders.filter((o) => o.id !== id);
    saveOrders(updated);
    setOrders(updated);
  };

  const filtered = orders.filter((o) => {
    const matchTab =
      activeTab === "All Orders" ||
      (activeTab === "Active" && o.status === "Active") ||
      (activeTab === "Completed" && o.status === "Completed");

    const matchSearch =
      !search ||
      o.vendorName.toLowerCase().includes(search.toLowerCase()) ||
      o.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  return (
    <div className="bg-white border text-black border-gray-200 rounded-xl p-6">

      {/* Header */}
      <div className="flex justify-between text-black items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">Purchase Orders & Tracking</h2>
          <p className="text-sm text-gray-500">
            Manage purchase orders, delivery schedules, and payment status
          </p>
        </div>
        <button
          onClick={() => { setEditOrder(null); setOpen(true); }}
          className="px-4 py-2 text-sm rounded-md bg-slate-700 text-white hover:bg-slate-800 transition"
        >
          + New Order
        </button>
      </div>

      <CreateOrderModal
        open={open}
        onClose={() => { setOpen(false); setEditOrder(null); refreshOrders(); }}
        projects={projects}
        editOrder={editOrder}
      />

      {/* Search & Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Vendor Name, PO ID, Invoice No..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-slate-400"
          />
        </div>
        <button className="px-4 py-2 text-sm border border-gray-200 rounded-md flex items-center gap-2 hover:bg-gray-50 transition">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {["All Orders", "Active", "Completed"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 text-xs rounded-md border transition ${
              activeTab === tab
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200"
            }`}
          >
            {tab}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-semibold ${
              activeTab === tab ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {tab === "All Orders" ? orders.length
                : orders.filter((o) => o.status === tab).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-xs">PO ID</th>
              <th className="px-4 py-3 text-left font-semibold text-xs">Vendor Name</th>
              <th className="px-4 py-3 text-left font-semibold text-xs">Invoice No.</th>
              <th className="px-4 py-3 text-left font-semibold text-xs">Order Date</th>
              <th className="px-4 py-3 text-left font-semibold text-xs">Delivery Date</th>
              <th className="px-4 py-3 text-left font-semibold text-xs">Amount</th>
              <th className="px-4 py-3 text-left font-semibold text-xs">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-xs">Payment</th>
              <th className="px-4 py-3 text-center font-semibold text-xs">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-gray-400 text-sm">
                  {orders.length === 0
                    ? "No orders yet. Click \"+ New Order\" to create one."
                    : "No orders match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  onEdit={() => { setEditOrder(order); setOpen(true); }}
                  onDelete={() => handleDelete(order.id)}
                  onToggleStatus={() => {
                    const updated = orders.map((o) =>
                      o.id === order.id
                        ? { ...o, status: o.status === "Active" ? "Completed" : "Active" as "Active" | "Completed" }
                        : o
                    );
                    saveOrders(updated);
                    setOrders(updated);
                  }}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Row ──────────────────────────────────────────────────────
function OrderRow({
  order,
  onEdit,
  onDelete,
  onToggleStatus,
}: {
  order: SavedOrder;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}) {
  const isOverdue =
    order.expectedDelivery &&
    new Date(order.expectedDelivery) < new Date() &&
    order.status !== "Completed";

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
      {/* PO ID */}
      <td className="px-4 py-3">
        <span className="font-mono text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded text-gray-700">
          {order.id}
        </span>
      </td>

      {/* Vendor */}
      <td className="px-4 py-3 font-medium text-gray-800">
        {order.vendorName || "—"}
      </td>

      {/* Invoice No */}
      <td className="px-4 py-3 text-gray-600">{order.invoiceNo || "—"}</td>

      {/* Order Date */}
      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
        {order.orderedDate || order.date || "—"}
      </td>

      {/* Delivery Date */}
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={isOverdue ? "text-red-600 font-semibold" : "text-gray-600"}>
          {order.expectedDelivery || "—"}
          {isOverdue && <span className="ml-1 text-[10px]">⚠ Overdue</span>}
        </span>
      </td>

      {/* Amount */}
      <td className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">
        ₹{order.total.toLocaleString("en-IN")}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        <button onClick={onToggleStatus}>
          <StatusBadge value={order.status} />
        </button>
      </td>

      {/* Payment */}
      <td className="px-4 py-3">
        <PaymentBadge value={order.paymentStatus} />
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onEdit}
            title="Edit"
            className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            title="Delete"
            className="w-7 h-7 rounded-md flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    Active:    "bg-green-100 text-green-700 border-green-200",
    Completed: "bg-gray-100 text-gray-600 border-gray-200",
    Cancelled: "bg-red-100 text-red-600 border-red-200",
  };
  return (
    <span className={`px-2.5 py-0.5 text-xs rounded-full border font-medium ${styles[value] ?? styles.Active}`}>
      {value}
    </span>
  );
}

function PaymentBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    Pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    Paid:    "bg-green-50 text-green-700 border-green-200",
    Partial: "bg-blue-50 text-blue-700 border-blue-200",
  };
  return (
    <span className={`px-2.5 py-0.5 text-xs rounded-full border font-medium ${styles[value] ?? styles.Pending}`}>
      {value}
    </span>
  );
}