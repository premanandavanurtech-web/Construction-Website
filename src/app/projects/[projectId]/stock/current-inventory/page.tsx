import StockClient from "@/src/component/project/stock/stockClient";

 export default function CurrentInventoryPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { projectId } = params;

  return <StockClient projectId={projectId} />;
}