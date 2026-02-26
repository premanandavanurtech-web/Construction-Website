import StockMovementLogClient from "@/src/component/project/stock/StockMovementLogClient";

export default async function MovementLogPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  return <StockMovementLogClient projectId={projectId} />;
}