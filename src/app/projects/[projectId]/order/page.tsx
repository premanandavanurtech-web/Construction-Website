"use client";

// import OrderRequestTable from "@/src/component/project/[stock]/order/OrderRequestTable";
// import OrdersHeader from "@/src/component/project/[stock]/order/OrdersHeader";
// import OrdersTable from "@/src/component/project/[stock]/order/OrdersTable";
// import StatusCards from "@/src/component/project/[stock]/order/StatusCards";

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
      <div className="flex gap-10 border-b">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-2 font-medium ${
            activeTab === "orders"
              ? "border-b-2 border-[#2F3E4E]"
              : "text-gray-500"
          }`}
        >
          Orders
        </button>

        <button
          onClick={() => setActiveTab("request")}
          className={`pb-2 font-medium ${
            activeTab === "request"
              ? "border-b-2 border-[#2F3E4E]"
              : "text-gray-500"
          }`}
        >
          Order Request
        </button>
      </div>

      {/* Content */}
      {activeTab === "orders" && <OrdersTable />}
      {activeTab === "request" && <OrderRequestTable
       />}
    </div>
  );
}
