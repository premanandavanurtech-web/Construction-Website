"use client";

import { useEffect, useState } from "react";

import CurrentStock from "@/src/component/project/stock/CurrentStock";
import CurrentInventoryLayout from "@/src/app/projects/[projectId]/stock/current-inventory/layout";
import UpdateStockModal from "@/src/component/project/stock/UpdateStockModal";
import CreateCategoryModal from "@/src/component/project/stock/CreateCategoryModal";
import CreateLocationModal from "@/src/component/project/stock/CreateLocationModal";

import StockFilterModal, {
  StockFilters,
} from "@/src/component/project/stock/StockFilterModal";

type StockItem = {
  name: string;
  category: string;
  current: number;
  min: number;
  location: string;
  status: string;
  updated: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
};

export default function StockClient({
  projectId,
}: {
  projectId: string;
}) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<StockItem | null>(null);
  const [openCategory, setOpenCategory] = useState(false);
const [search, setSearch] = useState("");
const [openLocation, setOpenLocation] = useState(false);


  // 🔎 Filter state
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<StockFilters>({
     category: "",
  location: "",
  minStock: "",
  currentStock: "",
  createdOn: "" ,
   
    
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // 🔍 Filter logic
const filteredItems = items.filter((item) => {
  // 🔍 Search by item name
  if (
    search &&
    !item.name.toLowerCase().includes(search.toLowerCase())
  ) {
    return false;
  }

  // Existing filters
  if (filters.category && item.category !== filters.category) return false;
  if (filters.location && item.location !== filters.location) return false;
  if (filters.minStock && item.min > Number(filters.minStock)) return false;
  if (filters.currentStock && item.current > Number(filters.currentStock)) return false;

  if (filters.createdOn) {
    const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
    if (itemDate !== filters.createdOn) return false;
  }

  return true;
});



  const loadStock = () => {
    const now = Date.now();
    const valid: StockItem[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`stock-${projectId}-`)) {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        const parsed: StockItem = JSON.parse(raw);

        if (parsed.expiresAt > now) {
          valid.push(parsed);
        } else {
          localStorage.removeItem(key);
        }
      }
    });

    setItems(valid);
  };

  useEffect(() => {
    loadStock();

    setCategories(
      JSON.parse(
        localStorage.getItem(`categories-${projectId}`) || "[]"
      )
    );

    setLocations(
      JSON.parse(
        localStorage.getItem(`locations-${projectId}`) || "[]"
      )
    );
  }, [projectId]);

  return (
    <>
      {/* FILTER MODAL */}
      <StockFilterModal
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        onApply={(f) => {
          setFilters(f);
          setOpenFilter(false);
        }}
        categories={categories}
        locations={locations}
      />

      {/* UPDATE MODAL */}
      <UpdateStockModal
        open={openEdit}
        item={selected}
        projectId={projectId}
        onClose={() => {
          setOpenEdit(false);
          loadStock();
        }}
      />
      <CreateCategoryModal
  open={openCategory}
  projectId={projectId}
  onClose={() => setOpenCategory(false)}
  onSubmit={() => {
    window.dispatchEvent(new Event("categories-updated"));
    setOpenCategory(false);
  }}
/>

<CreateLocationModal
  open={openLocation}
  projectId={projectId}
  onClose={() => setOpenLocation(false)}
/>



     <CurrentInventoryLayout
  onOpenFilter={() => setOpenFilter(true)}
  onOpenCategory={() => setOpenCategory(true)}
  onOpenLocation={() => setOpenLocation(true)}
  search={search}
  onSearchChange={setSearch}
>
  <CurrentStock
    projectId={projectId}
    stocks={filteredItems}
    onEdit={(item) => {
      setSelected(item);
      setOpenEdit(true);
    }}
    onDelete={(item) => {
      localStorage.removeItem(`stock-${projectId}-${item.name}`);
      loadStock();
    }}
  />
</CurrentInventoryLayout>

    </>
  );
}
