"use client";
import { IMAGES } from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCart } from "@/redux/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";

// Zod validation schema
const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Full name is too long"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  country: z.string().min(1, "Country is required"),
  state: z.string().optional(),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().optional(),
  address1: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address is too long"),
  address2: z.string().max(200, "Address is too long").optional(),
  shipToBilling: z.boolean(),
  orderNotes: z.string().max(500, "Order notes are too long").optional(),
  paymentMethod: z.enum(["cod", "payfast", "wallet", "card", "bank"]),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
}

interface OrderApiPayload {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state?: string;
  city: string;
  postalCode?: string;
  address1: string;
  address2?: string;
  shipToBilling: boolean;
  orderNotes?: string;
  items: Array<{
    product: string;
    quantity: number;
    selectedVariant?: {
      color?: string;
      size?: string;
      fit?: string;
    };
  }>;
}

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      country: "Pakistan",
      shipToBilling: true,
      paymentMethod: "cod",
    },
  });

  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    grandTotal: 0,
  });

  // Calculate order summary values from cart
  useEffect(() => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );

    const itemsTotal = cartItems.reduce(
      (total, item) =>
        total + (item?.discountedPrice ?? item.price) * item.quantity,
      0,
    );

    const discount = subtotal - itemsTotal;

    setOrderSummary({
      subtotal,
      discount,
      shipping: 0,
      grandTotal: itemsTotal,
    });
  }, [cartItems]);

  // API call to create order
  const createOrder = async (orderData: OrderApiPayload): Promise<any> => {
    const response = await api.post("/order", orderData);
    // fetch("/api/orders", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(orderData),
    // });

    if (!response.status || response.status >= 400) {
      toast.error("Failed to create order");
    }

    return response.data;
  };

  // Form submission handler
  const onSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Transform cart items to match API format
      const transformedItems = cartItems.map((item) => ({
        product: item.id.toString(),
        quantity: item.quantity,
        selectedVariant: {
          ...(item.selectedVariants?.color && {
            color: item.selectedVariants.color,
          }),
          ...(item.selectedVariants?.size && {
            size: item.selectedVariants.size,
          }),
          ...(item.selectedVariants?.fit && { fit: item.selectedVariants.fit }),
        },
      }));

      // Prepare order payload
      const orderPayload: OrderApiPayload = {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        state: data.state,
        city: data.city,
        postalCode: data.postalCode,
        address1: data.address1,
        address2: data.address2,
        shipToBilling: data.shipToBilling,
        orderNotes: data.orderNotes,
        items: transformedItems,
      };

      // Create the order
      const orderResponse = await createOrder(orderPayload);

      console.log("Order created successfully:", orderResponse);

      // Clear the cart after successful order
      dispatch(clearCart());

      // Here you would typically redirect to a success page
      // For example: router.push(`/order-confirmation/${orderResponse.orderId}`);
      // alert("Order placed successfully! Order ID: " + (orderResponse.orderId || orderResponse.id));
    } catch (error) {
      console.error("Error creating order:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20 min-h-screen px-3 pt-4 lg:px-7 lg:pt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Section - Shipping Details */}
          <div className="">
            {/* Returning Customer */}
            <div className="bg-light-platinum mb-6 px-6 py-2">
              <div className="flex items-center gap-4 text-sm lg:text-base">
                <IoIosCheckmarkCircle className="text-[#7bb818]" />
                <span className="text-chinese-black font-semibold">
                  Returning Customer?
                </span>
                <a href="#" className="text-red font-semibold">
                  Click here to login
                </a>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="rounded-lg bg-white py-3">
              <h2 className="text-grey-2 mb-6 text-xl font-semibold lg:text-2xl">
                Shipping Details
              </h2>

              {/* Register/Guest */}
              <div className="mb-6 flex items-center gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    value="register"
                    className="mr-2"
                  />
                  <span className="text-chinese-black">Register</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="accountType"
                    value="guest"
                    className="mr-2"
                    defaultChecked
                  />
                  <span className="text-chinese-black">Guest</span>
                </label>
              </div>

              {/* Form Fields */}
              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    {...register("phone")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("country")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="Bangladesh">Bangladesh</option>
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    State / County
                  </label>
                  <select
                    {...register("state")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select State</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.state.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Town/City <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("city")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select City</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.city.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    {...register("postalCode")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.postalCode.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("address1")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {errors.address1 && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.address1.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-chinese-black mb-1 block text-sm font-semibold">
                  Address Line 2
                </label>
                <input
                  type="text"
                  {...register("address2")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.address2 && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.address2.message}
                  </p>
                )}
              </div>

              {/* Ship to same address checkbox */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register("shipToBilling")}
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-chinese-black ml-2 text-sm">
                    Ship to same Address
                  </span>
                </label>
              </div>

              {/* Order Notes */}
              <div>
                <label className="text-chinese-black mb-1 block text-sm font-medium">
                  Order Notes
                </label>
                <textarea
                  {...register("orderNotes")}
                  placeholder="Notes about your order, eg special notes for delivery"
                  rows={4}
                  className="resize-vertical w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {errors.orderNotes && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.orderNotes.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Order Summary */}
          <div className="">
            <div className="rounded-lg bg-white">
              {/* Order Summary Header */}
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-grey-2 text-xl font-semibold lg:text-2xl">
                  Order Summary
                </h2>
                <Link
                  href="/cart"
                  className="text-chinese-black bg-light-platinum px-6 py-1 text-sm underline"
                >
                  Edit
                </Link>
              </div>

              {/* Discount Coupon */}
              <div className="flex items-center justify-between">
                <h3 className="text-chinese-black mb-3 pl-2 text-sm font-semibold">
                  Discount Coupon
                </h3>
                <button
                  type="button"
                  className="cursor-pointer text-sm font-semibold"
                >
                  Apply Gift Card
                </button>
              </div>
              <div className="bg-light-platinum p-4">
                <div className="text-dark-grey mb-6 w-full overflow-x-auto border-b px-2">
                  <div className="min-w-[500px]">
                    <div className="border-platinum-2 mb-2 grid grid-cols-8 gap-2 border-b pb-2">
                      <div className="col-span-3 font-semibold">
                        Product Name
                      </div>
                      <div className="col-span-2 font-semibold">Price</div>
                      <div className="col-span-1 font-semibold">Qty</div>
                      <div className="col-span-2 font-semibold">Total</div>
                    </div>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="border-platinum grid grid-cols-8 gap-2 border-b py-2"
                      >
                        <div className="col-span-3 flex gap-4">
                          <Image
                            width={80}
                            height={100}
                            src={item.image}
                            alt={item.name}
                            className="h-[100px] w-20 object-contain"
                          />
                          <div>
                            <div>{item.name}</div>
                            {item.selectedVariants?.color && (
                              <div>{item.selectedVariants?.color}</div>
                            )}
                            {item.selectedVariants?.size && (
                              <div>{item.selectedVariants?.size}</div>
                            )}
                            {item.selectedVariants?.fit && (
                              <div>{item.selectedVariants?.fit}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-span-2">
                          {item.discountedPrice ? (
                            <>
                              <div>Rs.{item?.discountedPrice?.toFixed(2)}</div>
                              <div className="text-sm text-gray-400 line-through">
                                Rs.{item.price.toFixed(2)}
                              </div>
                            </>
                          ) : (
                            <div>Rs.{item?.price?.toFixed(2)}</div>
                          )}
                        </div>
                        <div className="col-span-1">{item.quantity}</div>
                        <div className="col-span-2">
                          Rs.
                          {(
                            (item?.discountedPrice ?? item.price) *
                            item.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="divide-platinum text-dark-grey mb-8 gap-3 space-y-3 divide-y px-4 text-base">
                  <div className="flex justify-between py-1">
                    <span className="">Subtotal</span>
                    <span className="font-medium">
                      Rs.{orderSummary.subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="">Discount</span>
                    <span className="">
                      - Rs.{orderSummary.discount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="">Shipping</span>
                    <span className="font-medium">
                      Rs.{orderSummary.shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 text-lg font-semibold">
                    <span>Grand Total</span>
                    <span>Rs.{orderSummary.grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                  <h3 className="text-grey-2 mb-4 text-xl font-semibold lg:text-2xl">
                    Payment Method
                  </h3>

                  <div className="flex flex-col gap-3">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register("paymentMethod")}
                        value="cod"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-chinese-black ml-3">
                        Cash On Delivery (COD)
                      </span>
                    </label>

                    <label>
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="radio"
                          {...register("paymentMethod")}
                          value="payfast"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-chinese-black ml-1 text-nowrap">
                          PayFast (Debit Or Credit Card)
                        </span>
                        <Image
                          className="w-full max-w-[180px] object-contain"
                          src={IMAGES.CARD_PAYMENT}
                          alt="card payments"
                        />
                      </div>
                    </label>

                    <label>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          {...register("paymentMethod")}
                          value="wallet"
                          className="h-4 w-4 border-gray-300 bg-gray-100 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-chinese-black ml-1">Wallet</span>
                        <Image
                          src={IMAGES.WALLET_PAYMENT}
                          alt="wallet payment"
                          className="w-full max-w-[100px] object-contain"
                        />
                      </div>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register("paymentMethod")}
                        value="card"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-chinese-black ml-3">
                        Credit/Debit Card
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        {...register("paymentMethod")}
                        value="bank"
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-chinese-black ml-3">
                        Bank Transfer Payment
                      </span>
                    </label>
                  </div>
                </div>

                {/* Error Display */}
                {submitError && (
                  <div className="mb-4 rounded border border-red-400 bg-red-100 p-3 text-red-700">
                    {submitError}
                  </div>
                )}

                {/* Place Order Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="bg-red px-4 py-2 tracking-widest text-white transition duration-200 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:px-7"
                  >
                    {isSubmitting ? "PLACING ORDER..." : "PLACE ORDER"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
