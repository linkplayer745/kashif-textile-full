"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import {
  deleteProduct,
  fetchProducts,
  setSelectedProduct,
} from "@/redux/slices/productSlice";
import type { Product } from "@/lib/types";
import Pagination from "@/components/pagination";
import Filters, { FilterConfig } from "@/components/filters";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import { fetchCategories } from "@/redux/slices/categorySlice";

export default function ProductsPage() {
  const categories = useAppSelector((state) => state.category.categories);
  const { products, error, isLoading, pagination } = useAppSelector(
    (state) => state.product,
  );
  const dispatch = useAppDispatch();

  // Filter states
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    search: "",
    categoryId: "",
  });

  useEffect(() => {
    loadProducts();
    dispatch(fetchCategories());
  }, []);

  // Define filter configuration
  const filterConfig: FilterConfig[] = [
    {
      key: "search",
      type: "search",
      placeholder: "Search products...",
    },
    {
      key: "categoryId",
      type: "select",
      placeholder: "Filter by category",
      options: categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    },
  ];

  const loadProducts = (params = {}) => {
    dispatch(
      fetchProducts({
        page: pagination.page,
        limit: pagination.limit,
        ...filterValues,
        ...params,
      }),
    ).unwrap();
  };

  const onSelectProduct = (product: Product) => {
    dispatch(setSelectedProduct(product));
  };

  const onDeleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const deletedProduct = await api.delete(`/admin/product/${productId}`);
      toast("Product deleted successfully");
      dispatch(deleteProduct(deletedProduct.data.id));

      // If current page becomes empty and it's not the first page, go to previous page
      if (products.length === 1 && pagination.page > 1) {
        loadProducts({ page: pagination.page - 1 });
      } else {
        loadProducts();
      }
    } catch (error: any) {
      toast(error?.message || "Failed to delete product");
    }
  };

  const handlePageChange = (page: number) => {
    loadProducts({ page });
  };

  const handleLimitChange = (limit: number) => {
    loadProducts({ page: 1, limit });
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    loadProducts({ page: 1, ...newFilters });
  };

  const handleClearFilters = () => {
    const clearedFilters = { search: "", categoryId: "" };
    setFilterValues(clearedFilters);
    loadProducts({ page: 1, ...clearedFilters });
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Filters
        filters={filterConfig}
        values={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>Product List ({pagination.totalResults} total)</CardTitle>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No products found.</p>
              <Link href="/products/add">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Product
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Discounted Price</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <Image
                          src={product.images?.[0] || "/placeholder.svg"}
                          alt={product.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>Rs.{product.price}</TableCell>
                      <TableCell>
                        {product.discountedPrice
                          ? `Rs.${product.discountedPrice}`
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {categories.find((c) => c.id === product.categoryId)
                          ?.name || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Link href={`/products/edit/${product.id}`}>
                            <Button
                              onClick={() => onSelectProduct(product)}
                              variant="outline"
                              size="sm"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDeleteProduct(product.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-6">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  totalResults={pagination.totalResults}
                  limit={pagination.limit}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
