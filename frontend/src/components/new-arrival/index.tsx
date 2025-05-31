"use client";
import React, { useEffect } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../ui/product-card";
import { PRODUCTS, VariantOption } from "@/data/products";
import api from "@/utils/axiosInstance";
import { Product } from "@/types";

export interface ProductListItem {
  id: string;
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


function NewArrival() {
  const [products, setProducts] = React.useState<Product[]>()
  useEffect(() => {
    async function fetchProducts() {
      const res = await api.get("/products",{
        data:{
          limit: 10,
          sort: "createdAt",
          order: "desc"
        }
      });
      console.log("datais ",res.data)
      setProducts(res.data.results)
    }
 
    try {
      fetchProducts()
    } catch (error) {
      console.log(error)
    }
  }, [])
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
          {products?.map((item, index) => (
            <SwiperSlide key={index} className="h-full w-full">
              <div className="h-[45vh] max-h-[500px] sm:h-[70vh] xl:max-h-full">
                <ProductCard
                  discountedPrice={item.discountedPrice}
                  frontImage={item.images[0]}
                  backImage={item.images[1]}
                  description={item.description}
                  title={item.name}
                  sizes={item.variants.sizes}
                  fits={item.variants.fits}
                  colors={item.variants.colors}
                  id={item.id}
                  slug={item.slug}
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
