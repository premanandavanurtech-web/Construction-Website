export type StockItem = {
  name: string;
  category: string;
  current: string;
  min: string;
  location: string;
  status: string;
  vendor:string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;

  updated?: string; // optional (safe)
};
