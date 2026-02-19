export type StockItem = {
  name: string;
  category: string;
  current: number;
  min: number;
  location: string;
  status: string;

  createdAt: number;
  updatedAt: number;
  expiresAt: number;

  updated?: string; // optional (safe)
};
