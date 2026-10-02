"use client";

import type { GeolocationStatus } from "@/types/types";

type Props = {
  status: GeolocationStatus;
  errorMessage: string | null;
  onClick: () => void;
};

export default function LocateButton({ status, errorMessage, onClick }: Props) {
  const isLoading = status === "loading";

  return (
    <div
      dir="ltr"
      className="absolute right-4 top-20  z-[1000] flex flex-col items-end gap-2 sm:top-4"
    >
      <button
        type="button"
        onClick={onClick}
        disabled={isLoading}
        aria-label="My location"
        className="flex h-10 w-10 items-center justify-center gap-2 rounded-full bg-green-500  text-sm font-medium text-white shadow-lg transition hover:bg-white hover:text-green-500 disabled:cursor-not-allowed disabled:opacity-60 sm:h-auto sm:w-auto sm:rounded-lg sm:px-4 sm:py-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
          <circle cx="12" cy="12" r="8" />
        </svg>
        
      </button>

      {errorMessage && (
        <p className="max-w-56 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 shadow">
          {errorMessage}
        </p>
      )}
    </div>
  );
}