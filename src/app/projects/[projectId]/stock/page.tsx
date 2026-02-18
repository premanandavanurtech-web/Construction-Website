import StockClient from "./stockClient";


export default async function CurrentInventoryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params; // ✅ unwrap params

  return <StockClient projectId={projectId} />;
}
