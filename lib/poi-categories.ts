import type { PoiCategory } from "@/types/types";

export type PoiCategoryMeta = {
  id: PoiCategory;
  label: string;
  color: string;
};

// رنگ‌ها عمداً با مارکر اصلی (آبی لیفلت) و مارکر موقعیت کاربر (آبی #2563eb) فرق دارن
export const POI_CATEGORIES: PoiCategoryMeta[] = [
  { id: "hotel", label: "Hotels", color: "#9333ea" },
  { id: "restaurant", label: "Restaurants", color: "#f97316" },
  { id: "gas_station", label: "Gas stations", color: "#16a34a" },
  { id: "shop", label: "Shops", color: "#db2777" },
];