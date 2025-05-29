"use client";

import { useState } from "react";
import CategoryList from "@/components/category-list";
import { Button } from "@/components/ui/button";
import { Plus, List } from "lucide-react";
import CategoryForm from "@/components/category-form";

export default function CategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFormSuccess = () => {
    setShowForm(false);
    setRefreshTrigger((prev) => prev + 1); // Trigger refresh of category list
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  const handleAddCategory = () => {
    setShowForm(true);
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Category Management</h1>
        <div className="flex gap-2">
          <Button
            variant={showForm ? "outline" : "default"}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <List className="mr-2 h-4 w-4" />
                View Categories
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </>
            )}
          </Button>
        </div>
      </div>

      {showForm ? (
        <CategoryForm
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      ) : (
        <CategoryList
          onAddCategory={handleAddCategory}
          refreshTrigger={refreshTrigger}
        />
      )}
    </div>
  );
}
