import { redirect } from "next/navigation";

export default function StockIndexPage({
  params,
}: {
  params: { projectId: string };
}) {
  redirect(`/projects/${params.projectId}/stock/current-inventory`);
}
