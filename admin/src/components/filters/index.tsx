"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  type: "search" | "select";
  placeholder?: string;
  options?: FilterOption[];
}

interface FiltersProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onFilterChange: (key: string, value: string) => void;
  onClearFilters: () => void;
}

export default function Filters({
  filters,
  values,
  onFilterChange,
  onClearFilters,
}: FiltersProps) {
  const [searchInputs, setSearchInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    const searchFilters = filters.filter((f) => f.type === "search");
    const initialInputs: Record<string, string> = {};

    searchFilters.forEach((filter) => {
      initialInputs[filter.key] = values[filter.key] || "";
    });

    setSearchInputs(initialInputs);
  }, [filters, values]);

  const handleSearchSubmit = (e: React.FormEvent, filterKey: string) => {
    e.preventDefault();
    onFilterChange(filterKey, searchInputs[filterKey] || "");
  };

  const handleSearchInputChange = (filterKey: string, value: string) => {
    setSearchInputs((prev) => ({ ...prev, [filterKey]: value }));
  };

  const handleClearSearch = (filterKey: string) => {
    setSearchInputs((prev) => ({ ...prev, [filterKey]: "" }));
    onFilterChange(filterKey, "");
  };

  const handleSelectChange = (filterKey: string, value: string) => {
    onFilterChange(filterKey, value === "all" ? "" : value);
  };

  const hasActiveFilters = Object.values(values).some(
    (value) => value && value !== "",
  );

  const searchFilters = filters.filter((f) => f.type === "search");
  const selectFilters = filters.filter((f) => f.type === "select");

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row">
      {/* Search filters */}
      {searchFilters.map((filter) => (
        <form
          key={filter.key}
          onSubmit={(e) => handleSearchSubmit(e, filter.key)}
          className="flex flex-1 gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <Input
              placeholder={filter.placeholder || "Search..."}
              value={searchInputs[filter.key] || ""}
              onChange={(e) =>
                handleSearchInputChange(filter.key, e.target.value)
              }
              className="pr-10 pl-10"
            />
            {searchInputs[filter.key] && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleClearSearch(filter.key)}
                className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 transform p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Button type="submit">Search</Button>
        </form>
      ))}

      {/* Select filters and clear button */}
      <div className="flex gap-2">
        {selectFilters.map((filter) => (
          <Select
            key={filter.key}
            value={values[filter.key] || ""}
            onValueChange={(value) => handleSelectChange(filter.key, value)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={filter.placeholder || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {filter.options?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
