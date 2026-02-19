"use client";

import { useEffect, useState } from "react";

import CurrentStock from "@/src/component/project/stock/CurrentStock";
import CurrentInventoryLayout from "@/src/component/project/stock/CurrentInventoryTable";
import UpdateStockModal from "@/src/component/project/stock/UpdateStockModal";
import CreateCategoryModal from "@/src/component/project/stock/CreateCategoryModal";
import CreateLocationModal from "@/src/component/project/stock/CreateLocationModal";
import StockFilterModal, {
  StockFilters,
} from "@/src/component/project/stock/StockFilterModal";

import { StockItem } from "@/src/ts/stock";

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
      window.removeEventListener(
        "categories-updated",
        handleCategoriesUpdated
      );
  }, [projectId]);

  const filteredItems = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    if (filters.category && item.category !== filters.category) return false;
    if (filters.location && item.location !== filters.location) return false;
    if (filters.minStock && item.min > Number(filters.minStock)) return false;
    if (filters.currentStock && item.current > Number(filters.currentStock))
      return false;

    if (filters.createdOn) {
      const itemDate = new Date(item.createdAt)
        .toISOString()
        .split("T")[0];
      if (itemDate !== filters.createdOn) return false;
    }

    return true;
  });

  return (
    <>
      {/* Filters */}
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

      {/* Edit */}
      <UpdateStockModal
        open={openEdit}
        item={selected}
        projectId={projectId}
        onClose={() => {
          setOpenEdit(false);
          loadStock();
        }}
      />

      {/* Category */}
      <CreateCategoryModal
        open={openCategory}
        projectId={projectId}
        onClose={() => setOpenCategory(false)}
        onSubmit={() => {
          window.dispatchEvent(new Event("categories-updated"));
          setOpenCategory(false);
        }}
      />

      {/* Location */}
      <CreateLocationModal
        open={openLocation}
        projectId={projectId}
        onClose={() => setOpenLocation(false)}
      />

      {/* Table */}
      <CurrentInventoryLayout
        search={search}
        onSearchChange={setSearch}
        onOpenFilter={() => setOpenFilter(true)}
        onOpenCategory={() => setOpenCategory(true)}
        onOpenLocation={() => setOpenLocation(true)}
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
