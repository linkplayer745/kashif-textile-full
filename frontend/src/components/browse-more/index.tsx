"use client";
import { cn } from "@/utils/cn";
import React, { useEffect, useState } from "react";
import ProductCard from "../ui/product-card";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/utils/axiosInstance";
import { Category, Product } from "@/types";

function BrowseMore() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/category/all", { params: { limit: 3 } });

        const fetchedCategories: Category[] = res.data.results; // adjust based on actual API shape
        setCategories(fetchedCategories);
        if (fetchedCategories.length > 0) {
          setCategory(fetchedCategories[0].id);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (category === null) return;

    const fetchProducts = async () => {
      try {
        const res = await api.get("/products", {
          params: { categoryId: category, limit: 6 },
        });

        const fetchedProducts = res.data.results || res.data; // adjust based on actual API shape

        // const mappedProducts: ProductListItem[] = fetchedProducts.map((prod: any) => ({
        //   id: prod._id,
        //   categoryId: prod.categoryId,
        //   frontImage: prod.images?.[0],
        //   backImage: prod.images?.[1] || prod.images?.[0],
        //   description: prod.description,
        //   title: prod.name,
        //   sizes: prod.variants?.sizes || [],
        //   fits: prod.variants?.fits || [],
        //   colors: prod.variants?.colors || [],
        //   price: prod.price,
        //   ...(prod.discountedPrice != null && {
        //     discountedPrice: prod.discountedPrice,
        //   }),
        // }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="main-padding">
      <div className="mx-auto w-fit">
        <p className="text-red text-center text-sm">Exclusive Products</p>
        <h2 className="main-heading pt-1">BROWSE MORE</h2>

        <div className="mt-6 flex items-center justify-center gap-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                "cursor-pointer text-sm capitalize transition-colors duration-500 sm:text-base lg:text-xl",
                cat.id === category ? "text-red" : "text-black",
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:mt-7 lg:gap-x-4 lg:gap-y-8"
        >
          {products.map((product) => (
            <motion.div
              key={product.id}
              className="h-[35vh] sm:h-[80vh]"
              initial={{ scale: 0.5, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default BrowseMore;
