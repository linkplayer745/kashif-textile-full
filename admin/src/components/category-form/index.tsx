"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
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
import type { Category } from "@/lib/types";
import { Label } from "@/components/ui/label";
import { addCategory, updateCategory } from "@/redux/slices/categorySlice";
import { useAppDispatch } from "@/hooks/useStore";

const createCategorySchema = (isUpdate: boolean) =>
  z.object({
    name: z.string().min(1, "Category name is required"),
    slug: z
      .string()
      .min(1, "Slug is required")
      .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Invalid slug format. Only lowercase letters, numbers, and hyphens are allowed",
      ),
    description: z.string().optional(),
    image: isUpdate
      ? z.any().optional() // For updates, image is optional
      : z.any().refine((file) => file instanceof File, {
          message: "Please select an image",
        }),
  });

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CategoryForm({
  category,
  onSuccess,
  onCancel,
}: CategoryFormProps) {
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasNewImage, setHasNewImage] = useState(false);
  const dispatch = useAppDispatch();

  const isUpdate = !!category;
  const categorySchema = createCategorySchema(isUpdate);
  type CategoryFormData = z.infer<typeof categorySchema>;

  const form = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name || "",
      slug: category?.slug || "",
      description: category?.description || "",
      image: undefined,
    },
  });

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

  useEffect(() => {
    if (category?.imageUrl) {
      setImagePreviewUrl(category.imageUrl);
    }
  }, [category]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
      setHasNewImage(true);
    }
  };

  const removeImage = () => {
    form.setValue("image", undefined, { shouldValidate: true });
    setImagePreviewUrl("");
    setHasNewImage(false);

    // If we're updating and remove the image, we need to handle this case
    if (isUpdate && category?.imageUrl) {
      // You might want to set a flag here to indicate image should be removed
      // This depends on your backend API requirements
    }
  };

  const onSubmit = async (data: CategoryFormData, event?: React.FormEvent) => {
    event?.preventDefault();
    event?.stopPropagation();

    // Additional validation for new categories
    if (!isUpdate && !data.image) {
      toast.error("Please select an image");
      return;
    }

    setIsLoading(true);
    try {
      if (category) {
        await dispatch(
          updateCategory({
            categoryId: category.id,
            categoryData: {
              name: data.name,
              slug: data.slug,
              description: data.description,
            },
            image: data.image instanceof File ? data.image : undefined,
          }),
        );
      } else {
        await dispatch(
          addCategory({
            categoryData: {
              name: data.name,
              slug: data.slug,
              description: data.description,
            },
            image: data.image,
          }),
        );
      }

      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {category ? "Update Category" : "Add New Category"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                form.handleSubmit((data) => onSubmit(data, e))(e);
              }}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter category name" {...field} />
                    </FormControl>
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
                      <Input placeholder="category-slug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter category description"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Upload */}
              <FormField
                control={form.control}
                name="image"
                render={() => (
                  <FormItem>
                    <Label>Category Image {!isUpdate && "*"}</Label>
                    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6">
                      <div className="text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="mt-4">
                          <label
                            htmlFor="category-image"
                            className="cursor-pointer"
                          >
                            <span className="mt-2 block text-sm font-medium text-gray-900">
                              {isUpdate
                                ? "Click to upload new image"
                                : "Click to upload image"}
                            </span>
                            <input
                              id="category-image"
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    {imagePreviewUrl && (
                      <div className="relative mx-auto w-48">
                        <Image
                          src={imagePreviewUrl || "/placeholder.svg"}
                          alt="Category preview"
                          width={200}
                          height={200}
                          className="h-48 w-full rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {isUpdate && !hasNewImage && (
                          <div className="absolute bottom-2 left-2 rounded bg-blue-600 px-2 py-1 text-xs text-white">
                            Current
                          </div>
                        )}
                      </div>
                    )}

                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Form Actions */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : category
                      ? "Update Category"
                      : "Add Category"}
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
