"use client";

import { useEffect, useState } from "react";

import CurrentStock from "@/src/component/project/stock/CurrentStock";
import CurrentInventoryLayout from "@/src/component/project/stock/CurrentInventoryTable";
import CreateCategoryModal from "@/src/component/project/stock/CreateCategoryModal";
import CreateLocationModal from "@/src/component/project/stock/CreateLocationModal";
import StockFilterModal, {
  StockFilters,
} from "@/src/component/project/stock/StockFilterModal";
import StockDetails from "@/src/component/project/stock/StockDetails";
import EditStockModal from "@/src/component/project/stock/EditStockModal";

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
  const [selectedStock, setSelectedStock] = useState<StockItem | null>(null);

  /* ---------------- LOAD STOCK FROM LOCALSTORAGE ---------------- */

  const loadStock = () => {
    if (!projectId) {
      console.warn("loadStock: No projectId provided");
      return;
    }

    const now = Date.now();
    const valid: StockItem[] = [];

    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith(`stock-${projectId}-`)) {
        const raw = localStorage.getItem(key);
        if (!raw) return;

        try {
          const parsed: StockItem = JSON.parse(raw);

          if (!parsed.expiresAt || parsed.expiresAt > now) {
            valid.push(parsed);
          } else {
            localStorage.removeItem(key);
          }
        } catch (error) {
          console.error("Error parsing stock item:", error);
        }
      }
    });

    setItems(valid);
    window.dispatchEvent(new Event("stock-updated"));
  };

  /* ---------------- LOAD CATEGORIES & LOCATIONS ---------------- */

  const loadCategories = () => {
    if (!projectId) return [];
    try {
      return JSON.parse(localStorage.getItem(`categories-${projectId}`) || "[]");
    } catch (error) {
      console.error("Error loading categories:", error);
      return [];
    }
  };

  const loadLocations = () => {
    if (!projectId) return [];
    try {
      return JSON.parse(localStorage.getItem(`locations-${projectId}`) || "[]");
    } catch (error) {
      console.error("Error loading locations:", error);
      return [];
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    if (!projectId) {
      console.error("StockClient: No projectId provided");
      return;
    }

    loadStock();
    setCategories(loadCategories());
    setLocations(loadLocations());

    const handleCategoriesUpdated = () => setCategories(loadCategories());
    const handleLocationsUpdated = () => setLocations(loadLocations());
    const handleStockUpdated = () => loadStock();

    window.addEventListener("categories-updated", handleCategoriesUpdated);
    window.addEventListener("locations-updated", handleLocationsUpdated);
    window.addEventListener("stock-updated", handleStockUpdated);

    return () => {
      window.removeEventListener("categories-updated", handleCategoriesUpdated);
      window.removeEventListener("locations-updated", handleLocationsUpdated);
      window.removeEventListener("stock-updated", handleStockUpdated);
    };
  }, [projectId]);

  /* ---------------- FILTER LOGIC ---------------- */

  const filteredItems = items.filter((item) => {
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
      return false;

    if (filters.category && item.category !== filters.category) return false;
    if (filters.location && item.location !== filters.location) return false;

    // ✅ Convert item.current to number before comparing
    if (filters.minStock && Number(item.current) > Number(filters.minStock))
      return false;

    if (filters.currentStock && Number(item.current) > Number(filters.currentStock))
      return false;

    if (filters.createdOn) {
      const itemDate = new Date(item.createdAt).toISOString().split("T")[0];
      if (itemDate !== filters.createdOn) return false;
    }

    return true;
  });

  /* ---------------- HANDLERS ---------------- */

  const handleOpenLocationModal = () => setOpenLocation(true);

  const handleLocationModalClose = () => {
    setOpenLocation(false);
    setLocations(loadLocations());
  };

  const handleLocationSubmit = () => {
    window.dispatchEvent(new Event("locations-updated"));
    setLocations(loadLocations());
  };

  /* ---------------- RENDER ---------------- */

  return (
    <>
      {/* Edit Stock */}
      <EditStockModal
        open={openEdit}
        projectId={projectId}
        item={selected}
        onClose={() => {
          setOpenEdit(false);
          loadStock();
        }}
      />

      {/* Create Category */}
      <CreateCategoryModal
        open={openCategory}
        projectId={projectId}
        onClose={() => setOpenCategory(false)}
        onSubmit={() => {
          window.dispatchEvent(new Event("categories-updated"));
          setOpenCategory(false);
        }}
      />

      {/* Create Location */}
      {projectId && (
        <CreateLocationModal
          open={openLocation}
          projectId={projectId}
          onClose={handleLocationModalClose}
          onSubmit={handleLocationSubmit}
        />
      )}

      {/* Inventory / Details */}
      {!selectedStock ? (
        <CurrentInventoryLayout
          search={search}
          onSearchChange={setSearch}
          onOpenFilter={() => setOpenFilter((prev) => !prev)}
          onOpenCategory={() => setOpenCategory(true)}
          onOpenLocation={handleOpenLocationModal}
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
              if (!projectId) return;
              localStorage.removeItem(`stock-${projectId}-${item.name}`);
              loadStock();
            }}
          />
        </CurrentInventoryLayout>
      ) : (
        <StockDetails
          item={selectedStock}
            projectId={projectId}  
          onBack={() => setSelectedStock(null)}
          onUpdate={() => {
            loadStock();
            setSelectedStock(null);
          }}
        />
      )}
    </>
  );
}