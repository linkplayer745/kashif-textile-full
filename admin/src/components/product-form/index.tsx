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
import type { Product, VariantOption } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { productApi } from "@/lib/product-api";
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { fetchCategories } from "@/redux/slices/categorySlice";
import CategoryManagementDialog from "../category-management-dialog";

const productSchema = z
  .object({
    name: z.string().min(1, "Product name is required"),
    price: z.number().min(0, "Price must be non-negative"),
    discountedPrice: z
      .union([
        z.number().min(1, "Discount must be > 0"),
        z.undefined(),
        z.enum([""]),
      ])
      .optional(),

    description: z.string().optional(),
    categoryId: z.string().min(1, "Category is required"),
    slug: z
      .string()
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Invalid slug format special characters are not allowed",
      ),
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
  .superRefine((data, ctx) => {
    if (
      typeof data.discountedPrice === "number" &&
      data.discountedPrice >= data.price
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Discounted price must be less than the original price",
        path: ["discountedPrice"],
      });
    }
  });

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface AttributeItem {
  id: string;
  key: string;
  value: string;
}

interface VariantItem {
  id: string;
  key: string;
  options: VariantOption[];
}

export default function ProductForm({
  product,
  onSuccess,
  onCancel,
}: ProductFormProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories);

  // Separate state for existing images and new files
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newImagePreviewUrls, setNewImagePreviewUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [attributes, setAttributes] = useState<AttributeItem[]>([]);
  const [variants, setVariants] = useState<VariantItem[]>([]);

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      price: product?.price || 0,
      discountedPrice: product?.discountedPrice || "",

      slug: product?.slug || "",
      description: product?.description || "",
      categoryId: product?.categoryId || "",
      attributes: product?.attributes || {},
      variants: product?.variants || {},
    },
  });

  useEffect(() => {
    loadCategories();
    if (product) {
      // Convert product attributes to AttributeItem array
      if (product.attributes) {
        const attributeItems: AttributeItem[] = Object.entries(
          product.attributes,
        ).map(([key, value], index) => ({
          id: `attr_${index}_${Date.now()}`,
          key,
          value,
        }));
        setAttributes(attributeItems);
      }

      // Convert product variants to VariantItem array
      if (product.variants) {
        const variantItems: VariantItem[] = Object.entries(
          product.variants,
        ).map(([key, options], index) => ({
          id: `variant_${index}_${Date.now()}`,
          key,
          options,
        }));
        setVariants(variantItems);
      }

      // Set existing images
      if (product.images) {
        setExistingImages(product.images);
      }
    }
  }, [product]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "name") {
        const autoSlug = value.name
          ?.toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");

        const currentSlug = form.getValues("slug");
        const prevAutoSlug = currentSlug
          ?.toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");

        if (!currentSlug || currentSlug === prevAutoSlug) {
          if (autoSlug !== undefined) {
            form.setValue("slug", autoSlug);
          }
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Cleanup object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      newImagePreviewUrls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [newImagePreviewUrls]);

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

    // Add new files to existing ones
    const updatedNewImages = [...newImages, ...files];
    setNewImages(updatedNewImages);

    // Create preview URLs for new files only
    const newUrls = files.map((file) => URL.createObjectURL(file));
    const allNewUrls = [...newImagePreviewUrls, ...newUrls];
    setNewImagePreviewUrls(allNewUrls);

    // Reset the input value to allow selecting the same files again
    e.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    const updatedExisting = existingImages.filter((_, i) => i !== index);
    setExistingImages(updatedExisting);
  };

  const removeNewImage = (index: number) => {
    const urlToRevoke = newImagePreviewUrls[index];
    if (urlToRevoke && urlToRevoke.startsWith("blob:")) {
      URL.revokeObjectURL(urlToRevoke);
    }

    const updatedNewImages = newImages.filter((_, i) => i !== index);
    const updatedNewUrls = newImagePreviewUrls.filter((_, i) => i !== index);
    setNewImages(updatedNewImages);
    setNewImagePreviewUrls(updatedNewUrls);
  };

  const addAttribute = () => {
    const newAttribute: AttributeItem = {
      id: `attr_${Date.now()}`,
      key: "",
      value: "",
    };
    setAttributes((prev) => [...prev, newAttribute]);
  };

  const updateAttributeKey = (id: string, newKey: string) => {
    setAttributes((prev) =>
      prev.map((attr) => (attr.id === id ? { ...attr, key: newKey } : attr)),
    );
  };

  const updateAttributeValue = (id: string, newValue: string) => {
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.id === id ? { ...attr, value: newValue } : attr,
      ),
    );
  };

  const removeAttribute = (id: string) => {
    setAttributes((prev) => prev.filter((attr) => attr.id !== id));
  };

  const addVariant = () => {
    const newVariant: VariantItem = {
      id: `variant_${Date.now()}`,
      key: "",
      options: [{ name: "", code: "" }],
    };
    setVariants((prev) => [...prev, newVariant]);
  };

  const updateVariantKey = (id: string, newKey: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === id ? { ...variant, key: newKey } : variant,
      ),
    );
  };

  const addVariantOption = (variantId: string) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              options: [...variant.options, { name: "", code: "" }],
            }
          : variant,
      ),
    );
  };

  const updateVariantOption = (
    variantId: string,
    optionIndex: number,
    field: "name" | "code",
    value: string,
  ) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              options: variant.options.map((option, index) =>
                index === optionIndex ? { ...option, [field]: value } : option,
              ),
            }
          : variant,
      ),
    );
  };

  const removeVariantOption = (variantId: string, optionIndex: number) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              options: variant.options.filter(
                (_, index) => index !== optionIndex,
              ),
            }
          : variant,
      ),
    );
  };

  const removeVariant = (id: string) => {
    setVariants((prev) => prev.filter((variant) => variant.id !== id));
  };

  const onSubmit = async (data: ProductFormData) => {
    // Check if we have at least one image (existing or new)
    const totalImages = existingImages.length + newImages.length;
    if (!product && totalImages === 0) {
      toast.error("Error", {
        description: "At least one image is required",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Convert attributes array back to object
      const attributesObj = attributes.reduce(
        (acc, attr) => {
          if (attr.key.trim()) {
            acc[attr.key] = attr.value;
          }
          return acc;
        },
        {} as Record<string, string>,
      );

      // Convert variants array back to object
      const variantsObj = variants.reduce(
        (acc, variant) => {
          if (variant.key.trim()) {
            acc[variant.key] = variant.options;
          }
          return acc;
        },
        {} as Record<string, VariantOption[]>,
      );

      const productData = {
        ...data,
        attributes:
          Object.keys(attributesObj).length > 0 ? attributesObj : undefined,
        variants: Object.keys(variantsObj).length > 0 ? variantsObj : undefined,

        discountedPrice:
          data.discountedPrice === "" ? undefined : data.discountedPrice,
      };

      if (product) {
        // For updates, include existing images in the product data
        const updateData = {
          ...productData,
          existingImages: existingImages, // Send existing images to keep
          discountedPrice:
            data.discountedPrice === "" ? null : data.discountedPrice,
        };
        await productApi.updateProduct(
          product.id!,
          updateData,
          newImages.length > 0 ? newImages : undefined,
        );
        toast.success("Product updated successfully");
      } else {
        await productApi.addProduct(productData, newImages);
        toast.success("Product added successfully");
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to save product",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get total image count for display
  const totalImages = existingImages.length + newImages.length;

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
                      <div className="flex items-center justify-between">
                        <FormLabel>Category</FormLabel>
                        <CategoryManagementDialog />
                      </div>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
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
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter product slug" {...field} />
                      </FormControl>
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
                          placeholder=""
                          value={field.value ?? ""}
                          onChange={(e) => {
                            const raw = e.target.value;
                            if (raw === "") {
                              field.onChange("");
                            } else {
                              const value = parseFloat(raw);
                              if (!isNaN(value) && value >= 0) {
                                field.onChange(value);
                              }
                            }
                          }}
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

                {totalImages > 0 && (
                  <div className="space-y-4">
                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                      <div>
                        <Label className="mb-2 block pt-1 pb-2 text-sm text-gray-600">
                          Existing Images
                        </Label>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          {existingImages.map((url, index) => (
                            <div key={`existing-${index}`} className="relative">
                              <Image
                                src={url || "/placeholder.svg"}
                                alt={`Existing ${index + 1}`}
                                width={200}
                                height={200}
                                className="h-32 w-full rounded-lg object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => removeExistingImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* New Images */}
                    {newImagePreviewUrls.length > 0 && (
                      <div>
                        <Label className="mb-2 block pt-1 pb-2 text-sm text-gray-600">
                          New Images
                        </Label>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                          {newImagePreviewUrls.map((url, index) => (
                            <div key={`new-${index}`} className="relative">
                              <Image
                                src={url || "/placeholder.svg"}
                                alt={`New ${index + 1}`}
                                width={200}
                                height={200}
                                className="h-32 w-full rounded-lg object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => removeNewImage(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
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

                {attributes.map((attribute) => (
                  <div key={attribute.id} className="flex items-center gap-2">
                    <Input
                      placeholder="Attribute name"
                      value={attribute.key}
                      onChange={(e) =>
                        updateAttributeKey(attribute.id, e.target.value)
                      }
                    />
                    <Input
                      placeholder="Attribute value"
                      value={attribute.value}
                      onChange={(e) =>
                        updateAttributeValue(attribute.id, e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAttribute(attribute.id)}
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

                {variants.map((variant) => (
                  <Card key={variant.id}>
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Variant name (e.g., Color, Size)"
                            value={variant.key}
                            onChange={(e) =>
                              updateVariantKey(variant.id, e.target.value)
                            }
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => addVariantOption(variant.id)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeVariant(variant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {variant.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className="ml-4 flex items-center gap-2"
                          >
                            <Input
                              placeholder="Option name"
                              value={option.name}
                              onChange={(e) =>
                                updateVariantOption(
                                  variant.id,
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
                                  variant.id,
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
                                removeVariantOption(variant.id, optionIndex)
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
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="min-w-[120px]"
                >
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
