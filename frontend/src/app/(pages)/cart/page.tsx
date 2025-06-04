"use client";
import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import renderVariantInfo from "@/utils/renderVariantInfo";

const CartPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item?.discountedPrice ?? item.price) * item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <div className="mt-20 px-4 py-4">
        <h2 className="bg-light-platinum mb-8 p-5 text-center text-base font-medium lg:text-2xl">
          YOUR CART IS EMPTY
        </h2>

        <div className="flex items-center justify-center">
          <Link href={"/"}>
            <button className="border bg-black px-8 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black xl:text-base">
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 px-4 py-4">
      <div className="bg-light-platinum mb-6 px-3.5 py-2">
        <div className="text-dark-grey text-sm">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          | SHOPPING CART
        </div>
      </div>

      <h2 className="bg-light-platinum mb-8 p-5 text-center text-base font-medium lg:text-2xl">
        MY SHOPPING BAG
      </h2>

      <div className="text-chinese-black overflow-x-auto">
        <table className="w-full border-collapse text-base lg:text-lg">
          <thead>
            <tr className="border-platinum-2 border-b text-center">
              <th className="px-2 pb-4 font-medium text-nowrap sm:px-4">
                IMAGE
              </th>
              <th className="px-2 pb-4 font-medium text-nowrap sm:px-4">
                ITEM NAME
              </th>
              <th className="px-2 pb-4 font-medium text-nowrap sm:px-4">
                PRICE
              </th>
              <th className="px-2 pb-4 font-medium text-nowrap sm:px-4">
                QUANTITY
              </th>
              <th className="px-2 pb-4 font-medium text-nowrap sm:px-4">
                ACTION
              </th>
              <th className="px-2 pb-4 font-medium text-nowrap sm:px-4">
                TOTAL
              </th>
            </tr>
          </thead>
          <tbody>
            {cartItems?.map((item, index) => (
              <tr
                key={`${item.id}-${index}`} // Better key for items with variants
                className="border-platinum-2 items-center border-b text-center"
              >
                <td className="px-2 py-6 sm:px-4">
                  <Image
                    width={100}
                    height={100}
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="h-24 w-20 justify-self-center object-cover"
                  />
                </td>
                <td className="px-2 py-6 text-left sm:px-4">
                  <div className="flex flex-col">
                    <div className="font-medium">{item.name}</div>

                    {renderVariantInfo(item.selectedVariants)}
                  </div>
                </td>
                <td className="px-2 py-6 sm:px-4">
                  {item.discountedPrice ? (
                    <>
                      <div className="font-medium">
                        Rs.{item?.discountedPrice}
                      </div>
                      <div className="text-sm text-gray-400 line-through">
                        Rs.{item.price}
                      </div>
                    </>
                  ) : (
                    <div className="font-medium">Rs.{item?.price}</div>
                  )}
                </td>
                <td className="px-2 py-6 sm:px-4">
                  <div className="border-platinum-2 mx-auto flex max-w-[180px] items-center justify-center border">
                    <button
                      className="w-full px-3 py-1 text-lg font-bold"
                      onClick={() =>
                        dispatch(
                          decreaseQuantity({
                            id: item.id,
                            selectedVariants: item.selectedVariants,
                          }),
                        )
                      }
                    >
                      -
                    </button>
                    <p className="border-platinum-2 border-x px-5 py-1 lg:px-8">
                      {item.quantity}
                    </p>
                    <button
                      className="w-full px-3 py-1 text-lg font-bold"
                      onClick={() =>
                        dispatch(
                          increaseQuantity({
                            id: item.id,
                            selectedVariants: item.selectedVariants,
                          }),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-2 py-6 text-center sm:px-4">
                  <button
                    className="text-2xl"
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          id: item.id,
                          selectedVariants: item.selectedVariants, // Pass the entire variants object
                        }),
                      )
                    }
                  >
                    ×
                  </button>
                </td>
                <td className="text-red px-2 py-6 font-semibold sm:px-4">
                  Rs.
                  {(item?.discountedPrice ?? item.price) * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="main-padding mt-8 flex flex-col md:flex-row md:items-end md:justify-between">
        <div className="mb-4 hidden sm:block md:mb-0">
          <Link href={"/"}>
            <button className="border bg-black px-8 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-white hover:text-black xl:text-base">
              CONTINUE SHOPPING
            </button>
          </Link>
        </div>
        <div className="flex flex-col items-center sm:items-end">
          <div className="mb-2 flex w-full max-w-3xs items-center justify-between text-right">
            <span className="inline-block text-right text-[15px]">
              Subtotal :
            </span>{" "}
            <span className="font-medium">RS.{subtotal}</span>
          </div>
          <div className="mb-2 flex w-full max-w-3xs items-center justify-between text-right">
            <span className="inline-block text-right text-[15px]">
              Shipping :
            </span>{" "}
            <span className="font-medium">RS.0</span>
          </div>
          <div className="mb-6 flex w-full max-w-3xs items-center justify-between text-right">
            <span className="inline-block text-right text-[15px]">Total :</span>{" "}
            <span className="font-medium">RS.{subtotal}</span>
          </div>

          <div className="flex w-full flex-col gap-2 sm:flex-row lg:gap-4">
            <Link href={"/"}>
              <button className="block w-full bg-black px-8 py-3 text-sm font-medium text-white hover:bg-gray-800 sm:hidden xl:text-base">
                CONTINUE SHOPPING
              </button>
            </Link>
            <button className="bg-gold w-full px-8 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-amber-700 xl:text-base">
              UPDATE CART
            </button>
            <Link href={"/checkout"}>
              <button className="bg-red w-full px-8 py-3 text-sm font-medium text-white transition-colors duration-300 hover:bg-red-700 md:w-auto xl:text-base">
                CHECKOUT
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
