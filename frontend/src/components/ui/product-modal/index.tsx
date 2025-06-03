import { useState, useEffect } from "react";
import Image from "next/image";
import { IoMdClose } from "react-icons/io";
import { addToCart } from "@/redux/slices/cartSlice";
import Link from "next/link";
import { cn } from "@/utils/cn";
import { Product, VariantOption } from "@/types";
import { useAppDispatch } from "@/redux/hooks";
import { renderVariant } from "@/utils/renderVariant";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const dispatch = useAppDispatch();

  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen && product) {
      const initialSelectedVariants: Record<string, string> = {};
      Object.keys(product.variants).forEach((variantType) => {
        if (product.variants[variantType]?.length > 0) {
          initialSelectedVariants[variantType] =
            product.variants[variantType][0].name;
        }
      });

      setSelectedVariants(initialSelectedVariants);
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleVariantSelect = (variantType: string, optionName: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: optionName,
    }));
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity,
        selectedVariants,
        image: product.images?.[0],
      }),
    );

    onClose();
  };

  // Generic variant renderer - exactly the same as product page
  const renderVariant1 = (variantType: string, options: VariantOption[]) => {
    const selectedValue = selectedVariants[variantType] || "";
    const variantTypeDisplay =
      variantType.charAt(0).toUpperCase() + variantType.slice(1);

    // Special rendering for color variants
    if (
      variantType.toLowerCase() === "colors" ||
      variantType.toLowerCase() === "color"
    ) {
      return (
        <div className="mb-4" key={variantType}>
          <p className="font-medium">
            Select {variantTypeDisplay}:{" "}
            <span className="font-normal">{selectedValue}</span>
          </p>
          <div className="my-2 flex items-start justify-center space-x-2">
            {options.map((option, index) => (
              <button
                className="rounded-t outline"
                aria-label={`Select ${option.name} ${variantType}`}
                onClick={() => handleVariantSelect(variantType, option.name)}
                key={index}
              >
                <div
                  className="h-9 w-14 rounded-t"
                  style={{
                    backgroundColor: option.code || option.name.toLowerCase(),
                  }}
                />
                <div
                  className={cn(
                    "w-14 border-t py-2 text-[12px] font-medium",
                    selectedValue === option.name
                      ? "bg-gold text-white"
                      : "bg-white text-black",
                  )}
                >
                  {option.name}
                </div>
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Special rendering for size variants (circular buttons)
    if (
      variantType.toLowerCase() === "sizes" ||
      variantType.toLowerCase() === "size"
    ) {
      return (
        <div className="mb-6" key={variantType}>
          <div className="mb-2">
            <p className="text-center font-medium">
              Select {variantTypeDisplay}: {selectedValue}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {options.map((option, index) => (
              <button
                key={index}
                className={`flex h-12 min-w-12 items-center justify-center rounded-full border px-2 ${
                  selectedValue === option.name
                    ? "border-gray-700 bg-gray-100"
                    : "border-gray-300"
                }`}
                onClick={() => handleVariantSelect(variantType, option.name)}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // Default rendering for other variants (rectangular buttons)
    return (
      <div className="my-4" key={variantType}>
        <p className="mx-auto w-fit pb-3 font-medium">
          Select {variantTypeDisplay}:{" "}
          <span className="font-normal">{selectedValue}</span>
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {options.map((option, index) => (
            <button
              key={index}
              className={`border px-4 py-2 text-[12px] font-semibold ${
                selectedValue === option.name
                  ? "bg-platinum border-gray-700"
                  : "border-gray-300"
              } text-center`}
              onClick={() => handleVariantSelect(variantType, option.name)}
            >
              {option.name.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const discount =
    product.discountedPrice && product.price > product.discountedPrice
      ? Math.round((1 - product.discountedPrice / product.price) * 100)
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative max-h-[90vh] w-full max-w-[85vw] overflow-auto rounded-lg bg-white p-6 lg:max-w-3xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
        >
          <IoMdClose size={24} />
        </button>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="flex items-center justify-center">
            <Image
              src={product.images?.[0]}
              alt={product.name}
              width={300}
              height={400}
              className="object-contain"
            />
          </div>

          <div>
            <h2 className="mb-2 text-xl font-bold text-gray-800 lg:text-2xl">
              {product.name}
            </h2>

            <div className="mb-4 flex items-center gap-3">
              <span className="text-lg font-semibold text-gray-900 lg:text-xl">
                Rs.
                {(product.discountedPrice ?? product.price).toFixed(2)}
              </span>

              {discount > 0 && (
                <>
                  <span className="text-base text-gray-500 line-through">
                    Rs.{product.price.toFixed(2)}
                  </span>
                  <span className="rounded bg-red-100 px-2 py-1 text-sm font-medium text-red-700">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {product.description && (
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-semibold">Product Details</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}

            {/* Render all variants using the same logic as product page */}
            {Object.entries(product.variants).map(([variantType, options]) =>
              renderVariant({
                variantType,
                options,
                selectedVariants,
                handleVariantSelect,
              }),
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="mb-2 text-base font-semibold">Quantity</h3>
              <div className="flex h-10 w-32">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex w-10 items-center justify-center border border-r-0 border-gray-300 hover:bg-gray-100"
                >
                  -
                </button>
                <div className="flex w-12 items-center justify-center border-t border-b border-gray-300">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex w-10 items-center justify-center border border-l-0 border-gray-300 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                className="bg-red px-4 py-1 text-sm font-medium tracking-widest text-white transition duration-200 hover:bg-red-700 lg:text-base"
              >
                ADD TO CART
              </button>
              <Link href={`/product/${product.slug}`}>
                <button
                  onClick={onClose}
                  className="border border-gray-300 bg-white px-4 py-1 text-sm font-medium tracking-widest text-gray-700 transition duration-200 hover:bg-gray-100 lg:text-base"
                >
                  VIEW DETAILS
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
