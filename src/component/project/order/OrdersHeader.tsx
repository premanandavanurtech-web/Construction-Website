import { useState } from "react";
import CreateOrderModal from "./CreateOrderModal";

export default function OrdersHeader() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Procurement & Purchase Orders
        </h1>
        <p className="text-sm text-gray-500">
          Track orders, suppliers, and delivery status
        </p>
      </div>

      <button 
      onClick={() => setOpen(true)}
      className="bg-[#2F3E4E] text-white px-4 py-2 rounded-md text-sm">
        + Create New Order
      </button>
      <CreateOrderModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}