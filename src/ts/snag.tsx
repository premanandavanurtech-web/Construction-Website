// src/ts/snag.ts
export type SnagIssue = {
  id: string;
  title: string;
  location: string;
  description: string;
  assignedTo: string;
  deadline: string;
  reportedOn: string;
  priority: "high" | "pending" | "low";
  status: "unresolved" | "in-progress" | "resolved" | "pending";
  images: string[];
};
