"use client";
import React from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../product-card";

import { ProductListItem } from "@/components/new-arrival";
import { PRODUCTS } from "@/data/products";
const products: ProductListItem[] = PRODUCTS.map((prod) => {
  return {
    id: prod.id,
    categoryId: prod.categoryId,
    frontImage: prod.images[0],
    backImage: prod.images[1],
    title: prod.name,
    sizes: prod.variants.sizes,
    fits: prod.variants.fits,
    colors: prod.variants.colors,
    description: prod.description,
    price: prod.price,
    ...(prod.discountedPrice != null && {
      discountedPrice: prod.discountedPrice,
    }),
  };
});
function ProductSwipe({
  // products,
  heading,
}: {
  // products?: ProductType[];
  heading: string;
}) {
  return (
    <div>
      <h2 className="border-light-gray mb-5 border-b py-5 text-2xl font-medium">
        {heading}
      </h2>
      <div className="h-full pt-2 lg:pt-4">
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={2}
          spaceBetween={20}
          autoplay={{
            delay: 6000,
            pauseOnMouseEnter: true,
          }}
          loop
          className="h-full w-full"
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
            1256: {
              slidesPerView: 4,
              spaceBetween: 35,
            },
          }}
        >
          {products.map((item, index) => (
            <SwiperSlide key={index} className="h-full w-full">
              <div className="h-[50vh] max-h-[500px] sm:h-[70vh] xl:max-h-full">
                <ProductCard
                  id={item.id}
                  frontImage={item.frontImage}
                  backImage={item.backImage}
                  title={item.title}
                  description={item.description}
                  colors={item.colors}
                  sizes={item.sizes}
                  fits={item.fits}
                  price={item.price}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ProductSwipe;
