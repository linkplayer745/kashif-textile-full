"use client";
import { useEffect, useState } from "react";
import InnerImageZoom from "react-inner-image-zoom";
import "inner-image-zoom/lib/styles.min.css";
import { TbRulerMeasure } from "react-icons/tb";
import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward, IoMdMail } from "react-icons/io";
import Link from "next/link";
import Accordion from "@/components/ui/accordion";
import { FaCartShopping } from "react-icons/fa6";
import { IoPersonOutline } from "react-icons/io5";
import ProductSwipe from "@/components/ui/products-swipe";
import { useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { addToCart } from "@/redux/slices/cartSlice";
import { FiLoader } from "react-icons/fi";
import api from "@/utils/axiosInstance";
import { addRecentlyViewedProduct } from "@/redux/slices/userSlice";
import { Product } from "@/types";
import { renderVariant } from "@/utils/renderVariant";

export default function ProductPage() {
  const params = useParams();
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.category.categories);

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariants, setSelectedVariants] = useState<
    Record<string, string>
  >({});
  const [activeAccordian, setActiveAccordian] = useState<number | null>(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const slug = params.slug as string;

    const fetchProducts = async () => {
      try {
        const foundProduct = await api.get(`/products/get/${slug}`);
        if (foundProduct) {
          const productData = foundProduct.data;

          const initialSelectedVariants: Record<string, string> = {};
          Object.keys(productData.variants).forEach((variantType) => {
            if (productData.variants[variantType]?.length > 0) {
              initialSelectedVariants[variantType] =
                productData.variants[variantType][0].name;
            }
          });

          setProduct(productData);
          setSelectedVariants(initialSelectedVariants);
          dispatch(addRecentlyViewedProduct(productData.id));
        }
      } catch (error) {
        console.log("Error fetching products:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchProducts();
  }, [params.slug]);

  const handleVariantSelect = (variantType: string, optionName: string) => {
    if (!product) return;

    setSelectedVariants((prev) => ({
      ...prev,
      [variantType]: optionName,
    }));

    const updatedVariants = { ...product.variants };
    updatedVariants[variantType] = updatedVariants[variantType].map(
      (option) => ({
        ...option,
        selected: option.name === optionName,
      }),
    );

    setProduct({
      ...product,
      variants: updatedVariants,
    });
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = async () => {
    await dispatch(
      addToCart({
        id: product!.id,
        name: product!.name,
        price: product!.price,
        discountedPrice: product!.discountedPrice,
        quantity: quantity,
        selectedVariants: selectedVariants,
        image: product!.images[0],
      }),
    );
    setQuantity(1);
  };

  if (!isLoaded && !product) {
    return (
      <div className="main-padding mx-auto mt-20 flex flex-col items-center justify-center gap-3 text-center">
        Loading product details
        <FiLoader className="size-10" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="main-padding mx-auto mt-20 text-center text-4xl">
        Product not found
      </div>
    );
  }

  return (
    <div className="main-padding mx-auto mt-16 lg:mt-20">
      {/* Breadcrumb */}
      <div className="text-dark-grey mb-3 text-sm">
        <Link href="/" className="cursor-pointer">
          Home
        </Link>
        <span className="mx-2">|</span>
        <Link href={`/category/${product.slug}`} className="cursor-pointer">
          {
            categories.find((category) => category.id === product.categoryId)
              ?.name
          }
        </Link>
        <span className="mx-2">|</span>
        <span>{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Images Section */}
        <div className="mx-auto w-full">
          <div className="mb-4">
            {product.images && product.images.length > 0 && (
              <InnerImageZoom
                src={product.images[selectedImage]}
                zoomSrc={product.images[selectedImage]}
                zoomType="hover"
                zoomPreload={true}
                hideHint
                className="h-auto w-full"
              />
            )}
          </div>

          {/* Thumbnails */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images &&
              product.images.map((image, index) => (
                <button
                  key={index}
                  className={`min-w-16 border-2 ${selectedImage === index ? "border-blue-500" : "border-gray-200"}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-20 w-16 object-cover"
                  />
                </button>
              ))}
          </div>
        </div>

        {/* Product Details Tab */}
        <div className="text-chinese-black">
          <h2 className="mb-[15px] font-semibold lg:text-xl">{product.name}</h2>
          <p className="mb-4 font-semibold">SKU: {product.id}</p>

          <div className="mb-4 flex items-center gap-5 lg:gap-[30px]">
            <Link href={"#"}>
              <FaFacebookF className="size-[20px]" />
            </Link>
            <Link href={"#"}>
              <FaTwitter className="size-[20px]" />
            </Link>
            <Link href={"#"}>
              <FaPinterest className="size-[20px]" />
            </Link>
            <Link href={"#"}>
              <IoMdMail className="size-[20px]" />
            </Link>
          </div>

          <div className="divide-y divide-black/10">
            <Accordion
              active={activeAccordian === 0}
              onToggle={() =>
                setActiveAccordian(0 === activeAccordian ? null : 0)
              }
              key={0}
              title={"PRODUCT DETAIL"}
              id={"product-detail"}
              aria-expanded={activeAccordian === 0 ? "true" : "false"}
              aria-label={"Product Detail"}
            >
              <div className="py-4">
                <p className="mb-4 text-sm">{product.description}</p>

                <div className="space-y-2 text-sm lg:space-y-4">
                  {product.attributes &&
                    Object.keys(product.attributes).map((key) => (
                      <div key={key} className="flex">
                        <div className="grid grid-cols-[120px_1fr] gap-x-2">
                          <span className="font-semibold capitalize">
                            {key.replace(/([A-Z])/g, " $1")} :
                          </span>
                          <span>
                            {
                              product.attributes[
                                key as keyof typeof product.attributes
                              ]
                            }
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </Accordion>

            <Accordion
              active={activeAccordian === 1}
              onToggle={() =>
                setActiveAccordian(1 === activeAccordian ? null : 1)
              }
              key={2}
              title={"SHIPPING & RETURNS"}
              id={"shipping-returns"}
              aria-expanded={activeAccordian === 1 ? "true" : "false"}
              aria-label={"Shipping and Returns"}
            >
              <div className="py-4">
                <p className="mb-4 text-sm font-semibold">DELIVERES</p>

                <p className="text-sm">
                  Your purchase will be delivered within 3-5 working days for
                  domestic orders and 10-15 working days for international
                  orders. Please note that orders placed on weekends or public
                  holidays will be processed on the next working day.
                </p>

                <p className="my-4 text-sm font-semibold">RETURNS</p>

                <p className="text-sm">
                  Articles can be exchanged within 14 days of purchase. Items on
                  sale cannot be returned or exchanged.
                </p>
                <p className="mt-4 text-sm">
                  <Link
                    href={"/returns-exchange"}
                    className="font-medium text-blue-700"
                  >
                    Click Here{" "}
                  </Link>
                  for further information regarding exchanges and returns
                </p>
              </div>
            </Accordion>
          </div>
        </div>

        {/* Add to cart Section */}
        <div className="border-light-gray flex w-full flex-col items-center border px-5 pt-10 pb-[30px]">
          {/* Price */}
          <div className="border-light-gray mb-4 w-full border-b border-dashed pb-5 text-center text-2xl font-semibold text-gray-900">
            Rs.{(product?.discountedPrice ?? product.price).toFixed(2)}
            {product?.discountedPrice && (
              <span className="ml-2 text-lg text-red-500 line-through">
                Rs.{product.price.toFixed(2)}
              </span>
            )}
          </div>

          <div className="mb-4 flex items-center justify-between">
            <div className="font-medium">
              <span className="flex items-center gap-2">
                <TbRulerMeasure className="size-[20px]" />
                Size Chart
              </span>
            </div>
          </div>

          {product.variants &&
            Object.keys(product.variants).map(
              (variantType) =>
                product.variants[variantType]?.length > 0 &&
                renderVariant({
                  variantType,
                  options: product.variants[variantType],
                  handleVariantSelect,
                  selectedVariants,
                  buttonsAlign: "center",
                  headingAlign: "center",
                }),
            )}

          <div className="mt-4 mb-6">
            <p className="mb-2 text-center font-medium">Quantity</p>
            <div className="flex">
              <button
                className="border border-gray-300 px-4 py-3"
                onClick={decrementQuantity}
              >
                <IoIosArrowBack className="size-4" />
              </button>
              <div className="flex w-16 items-center justify-center border-y border-gray-300">
                {quantity}
              </div>
              <button
                className="border border-gray-300 px-4 py-3"
                onClick={incrementQuantity}
              >
                <IoIosArrowForward className="size-4" />
              </button>
            </div>
            {quantity > 1 && (
              <p className="mt-2 text-center text-lg">
                {quantity}x = Rs.
                {quantity * (product?.discountedPrice ?? product.price)}
              </p>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className="w-full px-4 lg:px-[50px]">
            <button
              onClick={handleAddToCart}
              className="bg-gold hover:bg-gold/90 flex w-full items-center justify-center gap-3 py-3 font-medium text-white transition"
            >
              <FaCartShopping className="size-[20px]" />
              ADD TO CART
            </button>
          </div>

          <div className="mt-6 flex w-full flex-col items-center bg-black/3 py-3">
            <div className="flex items-center gap-2">
              <IoPersonOutline className="size-5" />
              <p className="font-semibold">Need Help?</p>
            </div>
            <div className="mt-2 px-2 text-center text-sm lg:px-8">
              <span className="w-fit">
                <Link
                  className="w-fit font-semibold text-nowrap"
                  href="tel: +92 300 1234968"
                >
                  +92 300 1234968
                </Link>
              </span>
              <span> Mon-Sat: (10:00 AM to 06:00 PM)</span>
            </div>
          </div>
        </div>
      </div>

      <ProductSwipe
        heading="Similar Products"
        categoryId={product.categoryId}
      />

      <ProductSwipe heading="Recent Viewed Products" recentlyViewed />
    </div>
  );
}
