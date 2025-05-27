"use client";

import React, { useRef } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export default function HomePageHero() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="group relative h-screen overflow-hidden">
      <Swiper
        grabCursor
        modules={[Navigation]}
        loop
        slidesPerView={1}
        spaceBetween={0}
        className="h-full w-full"
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onSwiper={(swiper) => {
          setTimeout(() => {
            if (
              swiper?.params?.navigation &&
              typeof swiper.params.navigation === "object"
            ) {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }
            swiper?.navigation?.init();
            swiper?.navigation?.update();
          });
        }}
      >
        <SwiperSlide className="h-full w-full">
          <div className="h-full bg-[url('/banner.webp')] bg-cover bg-center bg-no-repeat">
            <div className="flex h-full w-full items-center justify-center bg-black/20 text-center text-4xl text-white">
              {/* Slide 1 */}
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide className="h-full w-full">
          <div className="h-full bg-[url('/banner1.webp')] bg-cover bg-center bg-no-repeat">
            <div className="flex h-full w-full items-center justify-center bg-black/20 text-center text-4xl text-white">
              {/* Slide 2 */}
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Prev button */}
      <button
        ref={prevRef}
        className="absolute top-1/2 left-6 z-20 flex size-10 -translate-x-16 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 !p-0 opacity-0 shadow-lg transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 lg:left-24 lg:size-[50px]"
      >
        <IoChevronBack size={24} />
      </button>

      {/* Next button */}
      <button
        ref={nextRef}
        className="absolute top-1/2 right-6 z-20 flex size-10 translate-x-16 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 !p-0 opacity-0 shadow-lg transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 lg:right-24 lg:size-[50px]"
      >
        <IoChevronForward size={24} />
      </button>
    </div>
  );
}
