export type StockHistory = {
  timestamp: number;
  material: string;
  quantityUsed: string;
  task: string;
  location: string;
  approvedBy: string;
  remarks: string;
};

export type StockItem = {
  id: string;
  name: string;
  category: string;
  current: string;
  min: string;
  location: string;
  vendor?: string;
  status: string;
  createdAt: number;

  // ✅ NEW
  history?: StockHistory[];
};