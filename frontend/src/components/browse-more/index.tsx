"use client";
import { cn } from "@/utils/cn";
import React, { useState } from "react";
import ProductCard from "../ui/product-card";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/data/products";
import { ProductListItem } from "../new-arrival";

function BrowseMore() {
  const products: ProductListItem[] = PRODUCTS.map((prod) => {
    return {
      id: prod.id,
      categoryId: prod.categoryId,
      frontImage: prod.images[0],
      description: prod.description,
      backImage: prod.images.length > 1 ? prod.images[1] : prod.images[0],
      title: prod.name,
      sizes: prod.variants.sizes,
      fits: prod.variants.fits,
      colors: prod.variants.colors,
      price: prod.price,
      ...(prod.discountedPrice != null && {
        discountedPrice: prod.discountedPrice,
      }),
    };
  });

  const categories = [
    { id: 4, title: "Shirts" },
    { id: 9, title: "Accessories" },
    { id: 8, title: "Summer Collection" },
  ];

  const [category, setCategory] = useState(categories[0].id);

  const filteredProducts = products.filter(
    (product) => product.categoryId === category,
  );

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
                "cursor-pointer text-sm transition-colors duration-500 sm:text-base lg:text-xl",
                cat.id === category ? "text-red" : "text-black",
              )}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Animated product grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={category}
          className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:mt-7 lg:gap-x-4 lg:gap-y-8"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="h-[35vh] sm:h-[90vh]"
              initial={{ scale: 0.5, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <ProductCard
                id={product.id}
                sizes={product.sizes}
                frontImage={product.frontImage}
                colors={product.colors}
                fits={product.fits}
                backImage={product.backImage}
                description={product.description}
                title={product.title}
                discountedPrice={product.discountedPrice}
                price={product.price}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default BrowseMore;
