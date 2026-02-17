import { redirect } from "next/navigation";

export default async function ProjectIndexPage({
  params,
}: {
  params: { projectId: string };
}) {
  redirect(`/projects/${params.projectId}/stock`);
}
