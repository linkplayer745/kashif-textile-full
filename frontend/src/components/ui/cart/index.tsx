"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  removeFromCart,
  formatVariantsForDisplay,
} from "@/redux/slices/cartSlice";
import renderVariantInfo from "@/components/ui/renderVariantInfo";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef } from "react";
import { IoCartOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

function CartComponent() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const numberOfItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item?.discountedPrice ?? item?.price) * item.quantity,
    0,
  );

  const [isOpen, setIsOpen] = useState(false);
  const cartRef = useRef<HTMLDivElement>(null);

  return (
    <div
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="relative"
      ref={cartRef}
    >
      {/* Cart Icon */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-fit cursor-pointer items-center gap-2"
      >
        <div className="bg-gold absolute -top-3 -left-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white sm:-top-2 sm:left-4">
          {numberOfItems}
        </div>
        <IoCartOutline className="size-7" />
        <span className="hidden text-sm sm:block md:text-base">BAG</span>
      </div>

      {/* Dropdown Cart */}
      <div
        className={`absolute right-0 z-30 mt-2 w-[90vw] origin-top-right rounded-md bg-white py-1 text-black shadow-lg transition-all duration-300 ease-in-out sm:w-96 ${
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0"
        }`}
      >
        {cartItems.length === 0 ? (
          <p className="w-full p-6 text-center text-black">
            No items in the cart
          </p>
        ) : (
          <div className="p-6">
            {/* Scrollable Cart Items */}
            <div className="text-charcoal flex max-h-64 flex-col gap-3 overflow-y-auto">
              {cartItems.map((item, index) => (
                <Link
                  href={`/product/${item.id}`}
                  key={`${item.id}-${index}`} // Better key for items with variants
                  className="grid grid-cols-10 gap-3 text-sm"
                >
                  <Image
                    className="col-span-2 max-h-[90px] w-full max-w-[70px] object-contain"
                    src={item.image}
                    alt={item.name}
                    width={100}
                    height={90}
                  />
                  <div className="col-span-4">
                    <p className="font-medium">{item.name}</p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-gray-600">
                        Qty: {item.quantity}
                      </p>
                    )}

                    {/* Generic variant display - Option 1: Individual lines */}
                    {renderVariantInfo(item.selectedVariants)}
                  </div>
                  <div className="col-span-2">
                    <p className="font-semibold text-nowrap">
                      PKR{" "}
                      {(item?.discountedPrice ?? item.price) * item.quantity}
                    </p>
                    {item.quantity > 1 && (
                      <p className="text-xs text-nowrap text-gray-500">
                        {item.quantity} × PKR{" "}
                        {item?.discountedPrice ?? item.price}
                      </p>
                    )}
                  </div>
                  <RxCross2
                    strokeWidth={1}
                    className="col-span-2 mx-2 size-4 cursor-pointer justify-self-center transition-colors hover:text-red-500"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();

                      // Generic variant handling - no hardcoded properties
                      dispatch(
                        removeFromCart({
                          id: item.id,
                          selectedVariants: item.selectedVariants, // Pass the entire variants object
                        }),
                      );
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Summary */}
            <div className="text-chinese-black mt-4 flex flex-col gap-2 border-y px-4 pt-[10px] pb-2 font-medium">
              <div className="flex items-center justify-between">
                <p>Shipping</p>
                <p>Rs. 0</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Subtotal</p>
                <p>Rs. {subtotal.toFixed(2)}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-3 flex items-center justify-between gap-3 px-3">
              <Link
                className="w-full"
                href="/cart"
                onClick={() => setIsOpen(false)}
              >
                <button className="flex w-full cursor-pointer items-center justify-center bg-black py-2 text-[12px] text-white transition-colors hover:bg-gray-800">
                  VIEW CART
                </button>
              </Link>

              <Link
                className="w-full"
                href="/checkout"
                onClick={() => setIsOpen(false)}
              >
                <button className="bg-red flex w-full cursor-pointer items-center justify-center py-2 text-center text-[12px] text-white transition-colors hover:bg-red-600">
                  CHECKOUT
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartComponent;
