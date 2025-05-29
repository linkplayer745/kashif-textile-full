"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, X, Upload, Trash2 } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product, Category, VariantOption } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { productApi } from "@/lib/product-api";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { fetchCategories } from "@/redux/slices/categorySlice";

const productSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    price: z.number().min(0, "Price must be non-negative"),
    discountedPrice: z
      .number()
      .min(0, "Discounted price must be non-negative")
      .optional(),
    description: z.string().optional(),
    categoryId: z.string().optional(),
    attributes: z.record(z.string()).optional(),
    variants: z
      .record(
        z.array(
          z.object({
            name: z.string(),
            code: z.string().optional(),
          }),
        ),
      )
      .optional(),
  })
  .refine(
    (data) =>
      data.discountedPrice === undefined || data.discountedPrice < data.price,
    {
      message: "Discounted price must be less than the original price",
      path: ["discountedPrice"], // This makes the error appear on the correct field
    },
  );

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories);

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [attributes, setAttributes] = useState<Record<string, string>>({});
  const [variants, setVariants] = useState<Record<string, VariantOption[]>>({});

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      discountedPrice:
        typeof product?.discountedPrice === "number"
          ? product.discountedPrice
          : undefined,

      description: product?.description || "",
      categoryId: product?.categoryId || "",
      attributes: product?.attributes || {},
      variants: product?.variants || {},
    },
  });

  useEffect(() => {
    loadCategories();
    if (product) {
      setAttributes(product.attributes || {});
      setVariants(product.variants || {});
      if (product.images) {
        setImagePreviewUrls(product.images);
      }
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      dispatch(fetchCategories());
    } catch (error) {
      toast.error("Error", {
        description: "Failed to load categories",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setImagePreviewUrls(urls);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newUrls = imagePreviewUrls.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviewUrls(newUrls);
  };

  const addAttribute = () => {
    const key = `attribute_${Date.now()}`;
    setAttributes((prev) => ({ ...prev, [key]: "" }));
  };

  const updateAttribute = (oldKey: string, newKey: string, value: string) => {
    setAttributes((prev) => {
      const updated = { ...prev };
      if (oldKey !== newKey) {
        delete updated[oldKey];
      }
      updated[newKey] = value;
      return updated;
    });
  };

  const removeAttribute = (key: string) => {
    setAttributes((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  };

  const addVariant = () => {
    const key = `variant_${Date.now()}`;
    setVariants((prev) => ({ ...prev, [key]: [{ name: "", code: "" }] }));
  };

  const updateVariantKey = (oldKey: string, newKey: string) => {
    setVariants((prev) => {
      const updated = { ...prev };
      updated[newKey] = updated[oldKey];
      if (oldKey !== newKey) {
        delete updated[oldKey];
      }
      return updated;
    });
  };

  const addVariantOption = (variantKey: string) => {
    setVariants((prev) => ({
      ...prev,
      [variantKey]: [...(prev[variantKey] || []), { name: "", code: "" }],
    }));
  };

  const updateVariantOption = (
    variantKey: string,
    optionIndex: number,
    field: "name" | "code",
    value: string,
  ) => {
    setVariants((prev) => ({
      ...prev,
      [variantKey]: prev[variantKey].map((option, index) =>
        index === optionIndex ? { ...option, [field]: value } : option,
      ),
    }));
  };

  const removeVariantOption = (variantKey: string, optionIndex: number) => {
    setVariants((prev) => ({
      ...prev,
      [variantKey]: prev[variantKey].filter(
        (_, index) => index !== optionIndex,
      ),
    }));
  };

  const removeVariant = (variantKey: string) => {
    setVariants((prev) => {
      const updated = { ...prev };
      delete updated[variantKey];
      return updated;
    });
  };

  const onSubmit = async (data: ProductFormData) => {
    if (!product && images.length === 0) {
      toast.error("Error", {
        description: "At least one image is required",
      });
      return;
    }

    setIsLoading(true);
    try {
      const productData = {
        ...data,
        attributes: Object.keys(attributes).length > 0 ? attributes : undefined,
        variants: Object.keys(variants).length > 0 ? variants : undefined,
      };

      if (product) {
        await productApi.updateProduct(
          product.id!,
          productData,
          images.length > 0 ? images : undefined,
        );
        toast.success("Product updated successfully");
      } else {
        await productApi.addProduct(productData, images);
        toast.success("Product added successfully");
      }

      onSuccess?.();
    } catch (error: any) {
      toast("Error", {
        description: error.response?.data?.message || "Failed to save product",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {product ? "Update Product" : "Add New Product"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            const value = Number.parseFloat(e.target.value);
                            if (value < 0) return;
                            field.onChange(value || "");
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min={0}
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number.parseFloat(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter product description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <div className="space-y-4">
                <Label>Product Images {!product && "*"}</Label>
                <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="images" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Click to upload images
                        </span>
                        <input
                          id="images"
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {imagePreviewUrls.length > 0 && (
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={url || "/placeholder.svg"}
                          alt={`Preview ${index + 1}`}
                          width={200}
                          height={200}
                          className="h-32 w-full rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Attributes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Attributes</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addAttribute}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Attribute
                  </Button>
                </div>

                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Input
                      placeholder="Attribute name"
                      value={key.startsWith("attribute_") ? "" : key}
                      onChange={(e) =>
                        updateAttribute(key, e.target.value, value)
                      }
                    />
                    <Input
                      placeholder="Attribute value"
                      value={value}
                      onChange={(e) =>
                        updateAttribute(key, key, e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAttribute(key)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Variants</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
                  </Button>
                </div>

                {Object.entries(variants).map(([variantKey, options]) => (
                  <Card key={variantKey}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Variant name (e.g., Color, Size)"
                            value={
                              variantKey.startsWith("variant_")
                                ? ""
                                : variantKey
                            }
                            onChange={(e) =>
                              updateVariantKey(variantKey, e.target.value)
                            }
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addVariantOption(variantKey)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeVariant(variantKey)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="ml-4 flex items-center gap-2"
                          >
                            <Input
                              placeholder="Option name"
                              value={option.name}
                              onChange={(e) =>
                                updateVariantOption(
                                  variantKey,
                                  optionIndex,
                                  "name",
                                  e.target.value,
                                )
                              }
                            />
                            <Input
                              placeholder="Option code (optional)"
                              value={option.code || ""}
                              onChange={(e) =>
                                updateVariantOption(
                                  variantKey,
                                  optionIndex,
                                  "code",
                                  e.target.value,
                                )
                              }
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                removeVariantOption(variantKey, optionIndex)
                              }
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : product
                      ? "Update Product"
                      : "Add Product"}
                </Button>
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
