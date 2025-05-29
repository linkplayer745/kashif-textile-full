"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Category } from "@/lib/types";
import { categoryApi } from "@/lib/category-api";
import { toast } from "sonner";

interface CategoryListProps {
  onAddCategory?: () => void;
  refreshTrigger?: number;
}

export default function CategoryList({
  onAddCategory,
  refreshTrigger,
}: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, [refreshTrigger]);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await categoryApi.getCategories();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (categoryId: string, categoryName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${categoryName}"? This action cannot be undone.`,
      )
    ) {
      return;
    }

    setDeletingId(categoryId);
    try {
      await categoryApi.deleteCategory(categoryId);
      toast.success("Category deleted successfully");
      loadCategories(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete category");
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Loading categories...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Categories ({categories.length})</CardTitle>
          {onAddCategory && (
            <Button onClick={onAddCategory} size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {categories.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            <p>No categories found.</p>
            {onAddCategory && (
              <Button onClick={onAddCategory} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Category
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="relative">
                  <Image
                    src={category.imageUrl || "/placeholder.svg"}
                    alt={category.name}
                    width={300}
                    height={200}
                    className="h-40 w-full rounded-md object-cover"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{category.name}</h3>
                  {category.slug && (
                    <p className="text-sm text-gray-500">
                      Slug: {category.slug}
                    </p>
                  )}
                  {category.description && (
                    <p className="line-clamp-2 text-sm text-gray-600">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteCategory(category.id, category.name)}
                    disabled={deletingId === category.id}
                  >
                    {deletingId === category.id ? (
                      "Deleting..."
                    ) : (
                      <>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
