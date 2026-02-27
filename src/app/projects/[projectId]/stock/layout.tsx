import React from "react";
import StockHeader from "@/src/component/project/stock/StockHeader";
import StockStats from "@/src/component/project/stock/StockStats";
import StockSubTabs from "@/src/component/project/stock/StockSubTabs";

export default async function StockLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params; // ✅ unwrap projectId from URL

  return (
    <div>
      <StockHeader projectId={projectId} /> {/* ✅ now passed */}
      <StockStats projectId={projectId} />
      <StockSubTabs />

      <div className="mt-6">{children}</div>
    </div>
  );
}