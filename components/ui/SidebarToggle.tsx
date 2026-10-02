"use client";

import { Menu } from "lucide-react";

type Props = {
  onClick: () => void;
};

export default function SidebarToggle({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      className="absolute left-4 top-24 z-[1000] flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg hover:bg-green-700"
    >
      <Menu size={20} />
    </button>
  );
}