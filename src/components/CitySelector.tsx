import { MapPin, ChevronDown, Search, X, Navigation } from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import type { CityOption } from "../types/weather";

interface Props {
  cities: CityOption[];
  selected: CityOption;
  onSelect: (city: CityOption) => void;
}

export function CitySelector({ cities, selected, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const filteredCities = useMemo(() => {
    if (!search.trim()) return cities;
    const q = search.toLowerCase();
    return cities.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [cities, search]);

  // Group cities by country
  const groupedCities = useMemo(() => {
    const groups: Record<string, CityOption[]> = {};
    for (const city of filteredCities) {
      if (!groups[city.country]) groups[city.country] = [];
      groups[city.country].push(city);
    }
    // Sort countries alphabetically
    const sorted = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
    return sorted;
  }, [filteredCities]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/80 border border-gray-200/50 shadow-sm hover:shadow-md transition-all text-gray-900 min-w-[200px]"
      >
        <Navigation size={16} className="text-blue-500 flex-shrink-0" />
        <div className="text-left flex-1 truncate">
          <span className="font-medium">{selected.name}</span>
          <span className="text-gray-400 text-sm ml-1.5">{selected.country}</span>
        </div>
        <ChevronDown
          size={16}
          className={`text-gray-400 transition-transform flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 w-80 rounded-2xl bg-white border border-gray-200 shadow-2xl z-50 overflow-hidden">
          {/* Search input */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city or country..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Cities list */}
          <div className="max-h-80 overflow-y-auto">
            {groupedCities.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-sm">
                No cities found for "{search}"
              </div>
            ) : (
              groupedCities.map(([country, countryCities]) => (
                <div key={country}>
                  <div className="px-4 py-1.5 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider sticky top-0">
                    {country}
                  </div>
                  {countryCities.map((city) => (
                    <button
                      key={`${city.name}-${city.lat}-${city.lon}`}
                      onClick={() => {
                        onSelect(city);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-blue-50 transition-colors ${
                        city.name === selected.name && city.country === selected.country
                          ? "bg-blue-50 text-blue-600"
                          : ""
                      }`}
                    >
                      <MapPin
                        size={14}
                        className={`flex-shrink-0 ${
                          city.name === selected.name && city.country === selected.country
                            ? "text-blue-500"
                            : "text-gray-300"
                        }`}
                      />
                      <span className="text-sm font-medium text-gray-800">{city.name}</span>
                    </button>
                  ))}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50/50">
            <p className="text-xs text-gray-400 text-center">
              {filteredCities.length} cities across {groupedCities.length} countries
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
