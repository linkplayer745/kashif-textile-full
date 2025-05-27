import { IMAGES } from "@/constants/images";
import { VariantOption } from "@/data/products";
import { useAppDispatch } from "@/redux/hooks";
import { openModal } from "@/redux/slices/modalSlice";
import { addToWishlist } from "@/redux/slices/wishlistSlice";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import React from "react";
import { FaShoppingCart, FaHeart } from "react-icons/fa";

export type ProductType = {
  id: number;
  frontImage?: string | StaticImageData;
  backImage?: string | StaticImageData;
  description?: string;
  title: string;
  price: number;
  discountedPrice?: number;
  sizes?: VariantOption[];
  fits?: VariantOption[];
  colors?: VariantOption[];
};

function ProductCard({
  id,
  frontImage,
  backImage,
  title,
  description,
  price,
  discountedPrice,
  sizes,
  fits,
  colors,
}: ProductType) {
  const dispatch = useAppDispatch();
  console.log("the enw coooler are ", colors);
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(
      openModal({
        id,
        name: title,
        price,
        description,
        discountedPrice: discountedPrice,
        sizes,
        fits,
        colors,
        image:
          typeof frontImage === "string"
            ? frontImage
            : frontImage?.src || IMAGES.NO_IMAGE.src,
      }),
    );
  };
  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToWishlist(id));
  };
  return (
    <Link
      href={`/product/${id}`}
      className="group relative block h-full w-full overflow-hidden"
    >
      {/* Front and back images */}
      <div className="relative h-[70%] w-full">
        <Image
          height={300}
          width={250}
          src={frontImage || backImage || IMAGES.NO_IMAGE}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-in-out"
        />
        <Image
          height={300}
          width={250}
          src={backImage || frontImage || ""}
          alt={`${title} alternate`}
          className="absolute inset-0 h-full w-full -translate-x-full transform object-cover opacity-0 transition-all delay-100 duration-700 ease-in-out group-hover:translate-x-0 group-hover:opacity-100"
        />

        {/* Icons container */}
        <div className="absolute inset-y-0 right-0 flex translate-x-10 transform flex-col items-center justify-end space-y-3 p-4 text-black opacity-0 transition-all duration-500 ease-in-out group-hover:translate-x-0 group-hover:opacity-100 lg:space-y-6">
          <button
            className="hover:text-red cursor-pointer"
            onClick={handleAddToCart}
          >
            <FaShoppingCart />
          </button>

          <button
            onClick={handleAddToWishlist}
            className="hover:text-red cursor-pointer"
          >
            <FaHeart />
          </button>
        </div>
      </div>

      {/* Caption */}
      <div className="w-full py-4">
        <h3 className="text-md truncate font-light">{title}</h3>
        <p className="text-lg leading-tight font-semibold">
          {typeof discountedPrice === "number"
            ? `Rs.${discountedPrice.toLocaleString()}`
            : discountedPrice}
          {discountedPrice && <br />}
          {discountedPrice ? (
            <del className="mr-2 text-sm font-light">
              {typeof price === "number"
                ? `Rs.${price.toLocaleString()}`
                : price}
            </del>
          ) : (
            `Rs.${price.toLocaleString()}`
          )}
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
