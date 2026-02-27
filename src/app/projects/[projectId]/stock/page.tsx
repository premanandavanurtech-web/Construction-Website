import StockClient from "@/src/component/project/stock/stockClient";

// ✅ FIXED
export default async function StockPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <StockClient projectId={projectId} />;
}