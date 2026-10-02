"use client";

import { X } from "lucide-react";
import Header from "../ui/Header";
import PoiCategoryList from "./PoiCategoryList";
// import SidebarFooter from "./SidebarFooter";
import type { AccountInfo, PoiCategory } from "@/types/types";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiLeaflet,
} from "react-icons/si";
import Link from "next/link";
type Props = {
  open: boolean;
  onClose: () => void;
  account: AccountInfo;
  selectedCategory: PoiCategory | null;
  hasUserLocation: boolean;
  poisLoading: boolean;
  poisError: string | null;
  poiCount: number;
  onSelectCategory: (category: PoiCategory) => void;
  onRequestLocation: () => void;
};

export default function Sidebar({
  open,
  onClose,
  account,
  selectedCategory,
  hasUserLocation,
  poisLoading,
  poisError,
  poiCount,
  onSelectCategory,
  onRequestLocation,
}: Props) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          aria-hidden
          className="fixed inset-0 z-[1250] bg-black/30"
        />
      )}

      <aside
        dir="ltr"
        className={`fixed inset-y-0 left-0 z-[1300] flex w-80 max-w-[85vw] flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="absolute right-3 top-3 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
        >
          <X size={18} />
        </button>

        <Header />
        <PoiCategoryList
          selected={selectedCategory}
          hasUserLocation={hasUserLocation}
          loading={poisLoading}
          error={poisError}
          resultCount={poiCount}
          onSelect={onSelectCategory}
          onRequestLocation={onRequestLocation}
        />
        <section>
          <div className="flex justify-evenly items-center">
            <h3 className="text-black font-bold">Made By </h3>
            <SiNextdotjs className="text-4xl text-black" />
            <SiTailwindcss className="text-4xl text-cyan-500" />
            <SiTypescript className="text-4xl text-blue-600" />
            <SiLeaflet className="text-4xl text-green-500" />
          </div>
          <div className="p-5 flex flex-col items-center gap-2">
            <p className="text-xs text-gray-700">Designed & Created by <Link href={"https://mr-mohammad.javadrma-2017.workers.dev/"}>Mohammad Javad Rasooli</Link></p>
            <p className="text-xs text-gray-700">© 2026 MH Crypto. All rights reserved.</p>
          </div>
        </section>
      </aside>
    </>
  );
}
