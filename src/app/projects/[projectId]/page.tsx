// app/projects/[projectId]/page.tsx
import { redirect } from "next/navigation";

export default async function ProjectIndexPage({
  params,
}: {
  params: Promise<{ projectId: string }>; // ✅ Promise type
}) {
  const { projectId } = await params; // ✅ await it
  redirect(`/projects/${projectId}/stock`);
}