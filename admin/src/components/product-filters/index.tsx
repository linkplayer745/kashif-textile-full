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
import { useAppSelector } from "@/hooks/useStore";

interface ProductFiltersProps {
  onSearch: (search: string) => void;
  onCategoryFilter: (categoryId: string) => void;
  onClearFilters: () => void;
  currentSearch: string;
  currentCategoryId: string;
}

export default function ProductFilters({
  onSearch,
  onCategoryFilter,
  onClearFilters,
  currentSearch,
  currentCategoryId,
}: ProductFiltersProps) {
  const [searchInput, setSearchInput] = useState(currentSearch);
  const categories = useAppSelector((state) => state.category.categories);

  useEffect(() => {
    setSearchInput(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    onSearch("");
  };

  const hasActiveFilters = currentSearch || currentCategoryId;

  return (
    <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-4 sm:flex-row">
      <form onSubmit={handleSearchSubmit} className="flex flex-1 gap-2">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pr-10 pl-10"
          />
          {searchInput && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute top-1/2 right-1 h-6 w-6 -translate-y-1/2 transform p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="flex gap-2">
        <Select value={currentCategoryId} onValueChange={onCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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
