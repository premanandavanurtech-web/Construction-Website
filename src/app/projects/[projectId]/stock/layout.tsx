import React from "react";
import StockHeader from "@/src/component/project/stock/StockHeader";
import StockStats from "@/src/component/project/stock/StockStats";
import StockSubTabs from "@/src/component/project/stock/StockSubTabs";

export default function StockLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = React.use(params); // ✅ REQUIRED

  return (
    <div>
      <StockHeader projectId={projectId} />
      <StockStats />
      <StockSubTabs />

      <div className="mt-6">{children}</div>
    </div>
  );
}
