"use client";
import React, { useEffect } from "react";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from "../product-card";
import api from "@/utils/axiosInstance";
import { Product } from "@/types";
import { useAppSelector } from "@/redux/hooks";

function ProductSwipe({
  recentlyViewed,
  categoryId,
  heading,
}: {
  categoryId?: string;
  recentlyViewed?: boolean;
  heading: string;
}) {
  const [products, setProducts] = React.useState<Product[]>([]);
  const recentlyViewedProducts = useAppSelector(
    (state) => state.user.recentlyViewedProducts,
  );

  useEffect(() => {
    async function fetchProducts() {
      const res = await api.get("/products", {
        data: {
          limit: 10,
          sort: "createdAt",
          order: "desc",
        },
        params: {
          ...(categoryId && { categoryId }),
          ...(recentlyViewed && { ids: recentlyViewedProducts?.join(",") }),
        },
      });
      setProducts(res.data.results);
    }

    try {
      fetchProducts();
    } catch (error) {
      console.log(error);
    }
  }, []);
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
          {products.map((prod, index) => (
            <SwiperSlide key={index} className="h-full w-full">
              <div className="h-[50vh] max-h-[500px] sm:h-[70vh] xl:max-h-full">
                <ProductCard product={prod} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ProductSwipe;
