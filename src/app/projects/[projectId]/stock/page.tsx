import StockClient from "./stockClient";

export default async function StockIndexPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params; // ✅ THIS IS THE KEY

  return <StockClient projectId={projectId} />;
}