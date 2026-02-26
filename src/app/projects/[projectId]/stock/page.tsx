import StockClient from "@/src/component/project/stock/stockClient";
import { use } from "react";


export default function StockPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);
  return <StockClient projectId={projectId} />;
}