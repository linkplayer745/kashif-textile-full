"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { removeFromWishlist } from "@/redux/slices/wishlistSlice";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import api from "@/utils/axiosInstance";
import { Product } from "@/types";

function WishlistPage() {
  const dispatch = useAppDispatch();
  const wishlistIds = useAppSelector((state) => state.wishlist.productId);
  console.log("wishlistIds", wishlistIds);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products", {
          params: {
            limit: 50,
            ids: wishlistIds.join(","),
          },
        });
        setProducts(response.data.results);
      } catch (error: any) {
        console.log(error.message);
      }
    };

    fetchProducts();
  }, [wishlistIds, api]);

  return (
    <div className="main-padding mx-auto mt-20 max-w-7xl">
      <h1 className="main-heading mb-6">Your Wishlist</h1>

      {wishlistIds.length === 0 ? (
        <div className="flex h-full flex-col items-center gap-4">
          <p className="text-dark-grey text-center font-light">
            You have no items in your wishlist.
          </p>
          <Link className="block" href={"/"}>
            <button className="block w-full cursor-pointer border bg-black px-8 py-3 text-sm font-medium text-white transition-all duration-500 hover:bg-white hover:text-black hover:drop-shadow-xl hover:drop-shadow-black xl:text-base">
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {products.map((product) => (
            <Link
              href={`/product/${product.slug}`}
              key={product.slug}
              className="group relative block rounded-lg shadow-lg transition-all duration-500 hover:shadow-xl"
            >
              <div className="relative w-full overflow-hidden rounded pb-[125%]">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-2 p-2 text-sm">
                <h3 className="line-clamp-1 font-medium">{product.name}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  {product.discountedPrice ? (
                    <>
                      <span className="font-semibold text-red-600">
                        Rs. {product.discountedPrice}
                      </span>
                      <span className="text-gray-400 line-through">
                        Rs. {product.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-semibold text-gray-800">
                      Rs. {product.price}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  dispatch(removeFromWishlist(product.id));
                }}
                className="absolute top-2 right-2 rounded-full bg-white p-1 text-gray-600 hover:text-red-600"
              >
                <RxCross2 className="size-4" />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
