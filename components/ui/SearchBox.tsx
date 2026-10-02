
"use client";

import { useState } from "react";
import { searchAddress } from "@/lib/geocoding";
import type { SearchResult } from "@/types/types";
import { MapPin } from "lucide-react";

type Props = {
  onSelect: (result: SearchResult) => void;
};

export default function SearchBox({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSearch() {
    const q = query.trim();
    if (!q) return;

    setLoading(true);
    setMessage(null);

    try {
      const found = await searchAddress(q);
      setResults(found);

      if (found.length === 0) {
        setMessage("No results found.");
      }
    } catch {
      setResults([]);
      setMessage("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handlePick(result: SearchResult) {
    onSelect(result);
    setResults([]);
    setQuery(result.displayName);
  }

  return (
    <div
      dir="ltr"
      className="absolute left-14 right-4 top-4 z-[1100] sm:right-auto sm:w-80"
    >
      {/* Search Box */}
      <div
        className="
          flex overflow-hidden rounded-lg
          border border-gray-200
          bg-white
          shadow-[0_4px_14px_rgba(0,0,0,0.12)]
          transition-shadow
          focus-within:shadow-[0_4px_18px_rgba(0,0,0,0.16)]
        "
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search address..."
          className="
            min-w-0 flex-1
            px-3 py-2
            text-sm text-gray-900
            placeholder:text-gray-400
            outline-none
          "
        />

        <button
          type="button"
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="
            min-w-[52px]
            bg-green-600
            px-3
            text-sm font-medium text-white
            transition-colors
            hover:bg-green-700
            active:bg-green-800
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {loading ? "..." : "Go"}
        </button>
      </div>

      {/* Results */}
      {(results.length > 0 || message) && (
        <ul
          className="
            mt-2
            max-h-64
            overflow-auto
            rounded-lg
            border border-gray-200
            bg-white
            text-sm text-gray-900
            shadow-[0_4px_14px_rgba(0,0,0,0.12)]
          "
        >
          {message && (
            <li className="px-3 py-3 text-center text-sm text-gray-500">
              {message}
            </li>
          )}

          {results.map((r) => (
            <li
              key={r.id}
              className="
                flex items-center
                border-b border-gray-100
                last:border-b-0
              "
            >
              <div className="ml-3 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100">
                <MapPin
                  size={15}
                  strokeWidth={2}
                  className="text-gray-600"
                />
              </div>

              <button
                type="button"
                onClick={() => handlePick(r)}
                className="
                  min-w-0
                  flex-1
                  px-3 py-3
                  text-left
                  leading-5
                  transition-colors
                  hover:bg-gray-50
                  active:bg-gray-100
                "
              >
                <span className="block truncate">
                  {r.displayName}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
