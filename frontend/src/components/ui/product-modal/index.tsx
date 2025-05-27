import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { IoMdClose } from "react-icons/io";
import { addToCart } from "@/redux/slices/cartSlice";
import Link from "next/link";
import { VariantOption } from "@/data/products";
import { cn } from "@/utils/cn";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: {
    id: number;
    name: string;
    price: number;
    discountedPrice?: number;
    description?: string;
    image: string;
    sizes?: VariantOption[];
    colors?: VariantOption[];
    fits?: VariantOption[];
  };
}

const ProductModal = ({ isOpen, onClose, product }: ProductModalProps) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState<VariantOption | null>(null);
  const [selectedColor, setSelectedColor] = useState<VariantOption | null>(
    null,
  );
  const [selectedFit, setSelectedFit] = useState<VariantOption | null>(null);
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (isOpen) {
      setSelectedSize(product?.sizes?.[0] || null);
      setSelectedColor(product?.colors?.[0] || null);
      setSelectedFit(product?.fits?.[0] || null);
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length) {
      alert("Please select a size");
      return;
    }

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        quantity,
        selectedVariants: {
          size: selectedSize?.name,
          color: selectedColor?.name,
          fit: selectedFit?.name,
        },
        image: product.image,
      }),
    );

    onClose();
  };
  console.log("the colors are ", product?.colors);
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
              src={product.image}
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

            {/* Size */}
            {product.sizes && product?.sizes?.length > 0 && (
              <div className="mb-6">
                <h3 className="mb-2 text-base font-semibold">Select Size:</h3>
                <div className="flex flex-wrap gap-2">
                  {product?.sizes?.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`flex h-10 min-w-12 items-center justify-center rounded border px-1 ${
                        selectedSize?.name === size.name
                          ? "border-red-500 bg-red-50 text-red-500"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product?.colors && product?.colors?.length > 0 && (
              <div className="mb-4">
                <p className="font-medium">Select Color:</p>
                <div className="my-2 flex flex-wrap items-center gap-2">
                  {product.colors.map((color, index) => (
                    <button
                      className={`rounded-t outline`}
                      aria-label={`Select ${color.name} color`}
                      onClick={() => setSelectedColor(color)}
                      key={index}
                    >
                      <div
                        className="h-9 min-w-14 rounded-t"
                        style={{ backgroundColor: color.code }}
                      ></div>
                      <div
                        className={cn(
                          "min-w-14 border-t px-1 py-2 text-[12px] font-medium",
                          selectedColor?.name === color.name
                            ? "bg-gold text-white"
                            : "bg-white text-black",
                        )}
                      >
                        {color.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fit */}
            {product?.fits && product.fits?.length > 0 && (
              <div className="mb-4">
                <p className="font-medium">Select Fit:</p>
                <div className="flex flex-wrap gap-2">
                  {product.fits.map((fit) => (
                    <button
                      key={fit.name}
                      onClick={() => setSelectedFit(fit)}
                      className={`border px-4 py-2 text-sm font-medium ${
                        selectedFit?.name === fit.name
                          ? "border-gray-700 bg-gray-100"
                          : "border-gray-300"
                      }`}
                    >
                      {fit.name}
                    </button>
                  ))}
                </div>
              </div>
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
              <Link href={`/product/${product.id}`}>
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
