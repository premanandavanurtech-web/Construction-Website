"use client";



import OrderRequestTable from "@/src/component/project/order/OrderRequestTable"
import OrdersTable from "@/src/component/project/order/OrderTable"
import OrdersHeader from "@/src/component/project/order/OrdersHeader";
import StatusCards from "@/src/component/project/order/StatusCards";
import { useState } from "react";


export default function OrderPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "request">("orders");

  return (
    <div className="p-6 space-y-6">
      <OrdersHeader />
      <StatusCards />

      {/* Tabs */}
      {/* Tabs */}
<div className="border-b">
  <div className="grid grid-cols-2">
    <button
      onClick={() => setActiveTab("orders")}
      className={`py-3 text-sm font-medium text-center ${
        activeTab === "orders"
          ? "border-b-2 border-[#2F3E4E] text-black"
          : "text-gray-500"
      }`}
    >
      Orders
    </button>

    <button
     onClick={() => {
  setActiveTab("request");
  window.dispatchEvent(new Event("access-request-refresh"));
}}
      className={`py-3 text-sm font-medium text-center ${
        activeTab === "request"
          ? "border-b-2 border-[#2F3E4E] text-black"
          : "text-gray-500"
      }`}
    >
      Order Request
    </button>
  </div>
</div>

      {/* Content */}
      {activeTab === "orders" && <OrdersTable />}
      {activeTab === "request" && <OrderRequestTable
       />}
    </div>
  );
}
