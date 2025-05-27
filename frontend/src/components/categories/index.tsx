import { CATEGORIES } from "@/data/products";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function Categories() {
  return (
    <div className="grid min-h-screen grid-cols-2 gap-[10px] p-5 lg:grid-cols-3 lg:gap-4 lg:px-[60px]">
      {CATEGORIES.slice(0, 6).map((category) => (
        <Link
          className="group relative cursor-pointer overflow-hidden"
          key={category.id}
          href={`/category/${category.id}`}
        >
          <div className="relative h-full overflow-hidden">
            <Image
              src={category.image}
              alt={category.alt}
              className="h-[30vh] max-h-[600px] w-full object-cover transition-transform duration-700 group-hover:scale-105 hover:scale-110 sm:h-[60vh] lg:h-[85vh] xl:max-h-full"
            />
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-end bg-black/20 px-[6%] py-8 lg:px-[10%]">
            <h2 className="w-full border border-white px-2 py-0.5 text-center text-lg font-bold text-white sm:px-6 sm:py-1 sm:text-xl lg:py-2 lg:text-[30px]">
              {category.title}
            </h2>
            <button className="mt-2 text-sm text-white transition-colors hover:text-gray-200 lg:mt-4 lg:text-base">
              Shop Now
            </button>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default Categories;
