"use client"; // ← ADD THIS if it's not already here

import { use } from "react";
import MachineryClient from "@/src/component/project/stock/Machinery/MachineryClient";

// ✅ Next.js 15 — params is a Promise, must be unwrapped with `use()`
export default function MachineryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = use(params);

  return <MachineryClient projectId={projectId} />;
}