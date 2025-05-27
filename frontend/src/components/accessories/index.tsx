"use client";
import Link from "next/link";
import React from "react";

export default function ParallaxSection() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="relative flex h-[500px] items-center justify-center bg-[url('/banner.webp')] bg-contain bg-fixed bg-center bg-no-repeat">
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center bg-white/50 px-4 text-center text-black">
          <h2 className="text-xl font-semibold lg:text-2xl">Accessories</h2>
          <p className="mt-5 max-w-3xl">
            Elevate Your Style with Kashif Textile Accessories – The Ultimate
            Collection for Every Occasion! From Essential to Exclusive, We've
            Got You Covered.
          </p>
          <Link href={"/category/9"}>
            <button className="mt-5 flex cursor-pointer items-center justify-center border border-black px-10 py-2 text-lg font-semibold transition duration-500 hover:bg-black hover:text-white lg:mt-8 lg:border-2 lg:px-11 lg:text-xl">
              shop
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
