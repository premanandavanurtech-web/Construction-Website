export type StockItem = {
  name: string;
  category: string;
  current: string;
  min: string;
  unit: string; // ✅ added to match EditStockModal
  location: string;
  status: string;
  vendor: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  updated?: string;
  history?: {
    timestamp: number;
    quantityUsed: number;
    task: string;
    approvedBy: string;
    remarks: string;
  }[];
};