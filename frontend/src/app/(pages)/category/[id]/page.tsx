"use client";
import { ProductListItem } from "@/components/new-arrival";
import ProductCard from "@/components/ui/product-card";
import { CATEGORIES, PRODUCTS } from "@/data/products";
import { useParams } from "next/navigation";
import React from "react";

function ProductCategoryPage() {
  const params = useParams();

  const category = CATEGORIES.find(
    (category) => category.id == Number(params.id),
  );

  const products: ProductListItem[] = PRODUCTS.filter(
    (product) => product.categoryId == Number(params.id),
  ).map((prod) => {
    return {
      id: prod.id,
      categoryId: prod.categoryId,
      frontImage: prod.images[0],
      description: prod.description,
      backImage: prod.images[1],
      sizes: prod.variants.sizes,
      title: prod.name,
      colors: prod.variants.colors,
      fits: prod.variants.fits,
      price: prod.price,
      ...(prod.discountedPrice != null && {
        discountedPrice: prod.discountedPrice,
      }),
    };
  });

  if (!category) {
    return (
      <div className="main-padding mt-20">
        <h2 className="text-dark-grey text-center text-xl lg:text-2xl">
          Category Not Found
        </h2>
      </div>
    );
  }

  if (products.length == 0) {
    return (
      <div className="main-padding mt-20">
        <h2 className="text-dark-grey text-center text-xl lg:text-2xl">
          No products found in this category
        </h2>
      </div>
    );
  }
  return (
    <div className="main-padding mt-20">
      <h2 className="main-heading">{category?.title}</h2>
      <div className="mt-5 grid grid-cols-2 gap-5 md:grid-cols-3 lg:mt-7 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-8">
        {products.map((product, index) => (
          <div key={index} className="h-[30vh] sm:h-[80vh]">
            <ProductCard
              id={product.id}
              frontImage={product.frontImage}
              backImage={product.backImage}
              title={product.title}
              sizes={product.sizes}
              fits={product.fits}
              colors={product.colors}
              description={product.description}
              discountedPrice={product.discountedPrice}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCategoryPage;
