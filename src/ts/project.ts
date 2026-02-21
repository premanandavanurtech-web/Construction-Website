export type Project = {
  id: string;

  // Basic
  name: string;
  type: string;
  city: string;
  address: string;
  region: string;
  gps: string;
  description: string;
  projectImage:null

  // Timeline
  startDate: string;
  endDate: string;
  milestones: { name: string; date: string }[];
  schedule: string;

  // Financial
  budget: string;
  costBreakdown: { category: string; amount: string }[];
  fundingSource: string;
  roi: string;

  // Team
  members: {
    role: string;
    name: string;
    email: string;
    phone: string;
  }[];
  siteAccess: string;

  // Docs
  permits?: string | null;
  legalDocs?: string | null;
  drawings?: string | null;

  createdAt: number;
};
