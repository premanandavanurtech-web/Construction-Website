"use client";

import { useEffect, useState } from "react";

import CurrentStock from "@/src/component/project/stock/CurrentStock";
import CurrentInventoryLayout from "@/src/component/project/stock/CurrentInventoryTable";
import UpdateStockModal from "@/src/component/project/stock/UpdateStockModal";
import CreateCategoryModal from "@/src/component/project/stock/CreateCategoryModal";
import CreateLocationModal from "@/src/component/project/stock/CreateLocationModal";
import StockFilterModal, { StockFilters } from "@/src/component/project/stock/StockFilterModal";
import StockDetails from "@/src/component/project/stock/StockDetails";

import { StockItem } from "@/src/ts/stock";
import EditStockModal from "@/src/component/project/stock/EditStockModal";

export default function StockClient({ projectId }: { projectId: string }) {
  const [items, setItems] = useState<StockItem[]>([]);
  const [search, setSearch] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [selected, setSelected] = useState<StockItem | null>(null);

  const [openFilter, setOpenFilter] = useState(false);
  const [openCategory, setOpenCategory] = useState(false);
  const [openLocation, setOpenLocation] = useState(false);

  const [filters, setFilters] = useState<StockFilters>({
    category: "",
    location: "",
    minStock: "",
    currentStock: "",
    createdOn: "",
  });

  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null); // ✅

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
      JSON.parse(localStorage.getItem(`categories-${projectId}`) || "[]")
    );

    setLocations(
      JSON.parse(localStorage.getItem(`locations-${projectId}`) || "[]")
    );

    const handleCategoriesUpdated = () => {
      setCategories(
        JSON.parse(localStorage.getItem(`categories-${projectId}`) || "[]")
      );
    };

    window.addEventListener("categories-updated", handleCategoriesUpdated);
    return () =>
      window.removeEventListener("categories-updated", handleCategoriesUpdated);
  }, [projectId]);

  const filteredItems = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.location && item.location !== filters.location) return false;
if (
    filters.minStock &&
    item.current > Number(filters.minStock)
  )
    return false;
    if (filters.currentStock && item.current > Number(filters.currentStock))
      return false;
    if (filters.createdOn) {
      const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
      if (itemDate !== filters.createdOn) return false;
    }
    return true;
  });

  return (
    <>

   <EditStockModal
  open={openEdit}
  projectId={projectId}
  item={selected}
  onClose={() => {
    setOpenEdit(false);
    loadStock(); // 🔄 refresh after save
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

      {/* ✅ Single layout block only */}
      {/* Table */}
      {!selectedStock ? (
        <CurrentInventoryLayout
          search={search}
          onSearchChange={setSearch}
    onOpenFilter={() => setOpenFilter(prev => !prev)}
          onOpenCategory={() => setOpenCategory(true)}
          onOpenLocation={() => setOpenLocation(true)}
          filtersSlot={
    openFilter && (
      <StockFilterModal
        filters={filters}
        onChange={setFilters}
        categories={categories}
        locations={locations}
      />
    )
  }
>
        
          
          <CurrentStock
            projectId={projectId}
            stocks={filteredItems}
            onView={(item) => setSelectedStock(item)}
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
      ) : (
        // ✅ Full width — outside the table layout entirely
        <StockDetails
          item={selectedStock}
          onBack={() => setSelectedStock(null)}
        />
      )}
    </>
  );
}