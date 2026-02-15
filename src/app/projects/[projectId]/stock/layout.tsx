"use client";

import StockHeader from "@/src/component/project/[stock]/StockHeader";
import StockStats from "@/src/component/project/[stock]/StockStats";
import StockSubTabs from "@/src/component/project/[stock]/StockSubTabs";

export default function StockLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <StockHeader />
      <StockStats />
      <StockSubTabs />

      {/* 👇 sub-pages render here */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
