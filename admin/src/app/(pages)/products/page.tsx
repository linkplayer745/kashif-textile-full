"use client";

import { useState, useEffect } from "react";
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
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { fetchProducts, setSelectedProduct } from "@/redux/slices/productSlice";
import { Product } from "@/lib/types";

export default function ProductsPage() {
  const { products, error, isLoading } = useAppSelector(
    (state) => state.product,
  );
  const dispatch = useAppDispatch();
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    dispatch(fetchProducts())
      .unwrap()
      .then(() => {})
      .catch((error) => {
        toast.error("Error", {
          description: error,
        });
      });
  };
  const onSelectProduct = (product: Product) => {
    dispatch(setSelectedProduct(product));
  };
  const deleteProduct = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/product/${productId}`);
      toast("Product deleted successfully");
      loadProducts();
    } catch (error) {
      toast.error("Error", {
        description: "Failed to delete product",
      });
    }
  };

  if (isLoading) {
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

      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
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
                      src={product.images![0]}
                      alt={product.name}
                      width={50}
                      height={50}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>
                    {product.discountedPrice
                      ? `$${product.discountedPrice}`
                      : "-"}
                  </TableCell>
                  <TableCell>{product.categoryId || "-"}</TableCell>
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
                        onClick={() => deleteProduct(product.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
