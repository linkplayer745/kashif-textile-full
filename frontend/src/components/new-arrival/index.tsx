"use client";
import React from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../ui/product-card";
import { PRODUCTS, VariantOption } from "@/data/products";

export interface ProductListItem {
  id: number;
  categoryId: number;
  frontImage?: string;
  description?: string;
  sizes?: VariantOption[];
  fits?: VariantOption[];
  colors?: VariantOption[];
  backImage?: string;
  title: string;
  price: number;
  discountedPrice?: number;
}

const products: ProductListItem[] = PRODUCTS.map((prod) => {
  return {
    id: prod.id,
    categoryId: prod.categoryId,
    frontImage: prod.images[0],
    sizes: prod.variants.sizes,
    fits: prod.variants.fits,
    colors: prod.variants.colors,
    description: prod.description,
    backImage: prod.images[1],
    title: prod.name,
    price: prod.price,
    ...(prod.discountedPrice != null && {
      discountedPrice: prod.discountedPrice,
    }),
  };
});
function NewArrival() {
  return (
    <div className="main-padding">
      <h2 className="main-heading">NEW ARRIVALS</h2>
      <div className="h-full pt-2 lg:pt-4">
        <Swiper
          modules={[Navigation, Autoplay]}
          slidesPerView={2}
          spaceBetween={20}
          autoplay={{
            pauseOnMouseEnter: true,
            delay: 5000,
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
              <div className="h-[45vh] max-h-[500px] sm:h-[70vh] xl:max-h-full">
                <ProductCard
                  discountedPrice={item.discountedPrice}
                  frontImage={item.frontImage}
                  backImage={item.backImage}
                  description={item.description}
                  title={item.title}
                  sizes={item.sizes}
                  fits={item.fits}
                  colors={item.colors}
                  id={item.id}
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

export default NewArrival;
