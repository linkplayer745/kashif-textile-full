"use client";
import { IMAGES } from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCart, formatVariantsForDisplay } from "@/redux/slices/cartSlice";
import { fetchUserProfile } from "@/redux/slices/userSlice";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/utils/axiosInstance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import renderVariantInfo from "@/utils/renderVariantInfo";

// Country and state mappings
const COUNTRIES = [
  { value: "Pakistan", label: "Pakistan" },
  { value: "Bangladesh", label: "Bangladesh" },
];

const STATES = {
  Pakistan: [
    { value: "Punjab", label: "Punjab" },
    { value: "Sindh", label: "Sindh" },
    { value: "KPK", label: "KPK" },
    { value: "Balochistan", label: "Balochistan" },
  ],
  Bangladesh: [
    { value: "Dhaka", label: "Dhaka" },
    { value: "Chittagong", label: "Chittagong" },
    { value: "Sylhet", label: "Sylhet" },
  ],
};

const CITIES = {
  Pakistan: [
    { value: "Karachi", label: "Karachi" },
    { value: "Lahore", label: "Lahore" },
    { value: "Islamabad", label: "Islamabad" },
    { value: "Faisalabad", label: "Faisalabad" },
    { value: "Rawalpindi", label: "Rawalpindi" },
  ],
  Bangladesh: [
    { value: "Dhaka", label: "Dhaka" },
    { value: "Chittagong", label: "Chittagong" },
    { value: "Sylhet", label: "Sylhet" },
  ],
};

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
  state: z.string().min(1, "State is required"),
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
    selectedVariant?: Record<string, string>;
  }>;
}

// Helper function to find the closest match for auto-fill
const findClosestMatch = (
  userValue: string,
  options: Array<{ value: string; label: string }>,
) => {
  if (!userValue) return "";

  // Exact match
  const exactMatch = options.find(
    (option) => option.value.toLowerCase() === userValue.toLowerCase(),
  );
  if (exactMatch) return exactMatch.value;

  // Partial match
  const partialMatch = options.find(
    (option) =>
      option.value.toLowerCase().includes(userValue.toLowerCase()) ||
      userValue.toLowerCase().includes(option.value.toLowerCase()),
  );
  if (partialMatch) return partialMatch.value;

  return "";
};

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { currentUser } = useAppSelector((state) => state.user);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("Pakistan");
  const router = useRouter();

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

  const watchedCountry = watch("country");

  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    discount: 0,
    shipping: 0,
    grandTotal: 0,
  });

  // Fetch user profile if not already loaded
  useEffect(() => {
    if (localStorage.getItem("token") && !currentUser) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, currentUser]);

  useEffect(() => {
    if (currentUser) {
      const autoFillData: Partial<CheckoutFormData> = {};

      // Basic info
      if (currentUser.name) {
        autoFillData.fullName = currentUser.name;
      }
      if (currentUser.email) {
        autoFillData.email = currentUser.email;
      }

      // Address details with smart matching
      if (currentUser.details) {
        const { details } = currentUser;

        if (details.phone) {
          autoFillData.phone = details.phone;
        }

        if (details.address) {
          autoFillData.address1 = details.address;
        }

        if (details.postalCode) {
          autoFillData.postalCode = details.postalCode;
        }

        // Smart matching for dropdowns
        if (details.country) {
          const matchedCountry = findClosestMatch(details.country, COUNTRIES);
          if (matchedCountry) {
            autoFillData.country = matchedCountry;
            setSelectedCountry(matchedCountry);
          }
        }

        if (details.state && autoFillData.country) {
          const stateOptions =
            STATES[autoFillData.country as keyof typeof STATES] || [];
          const matchedState = findClosestMatch(details.state, stateOptions);
          if (matchedState) {
            autoFillData.state = matchedState;
          }
        }

        if (details.city && autoFillData.country) {
          const cityOptions =
            CITIES[autoFillData.country as keyof typeof CITIES] || [];
          const matchedCity = findClosestMatch(details.city, cityOptions);
          if (matchedCity) {
            autoFillData.city = matchedCity;
          }
        }
      }

      // Set form values
      Object.entries(autoFillData).forEach(([key, value]) => {
        if (value) {
          setValue(key as keyof CheckoutFormData, value);
        }
      });
    }
  }, [currentUser, setValue]);

  // Update selected country when form country changes
  useEffect(() => {
    setSelectedCountry(watchedCountry);
    // Reset state and city when country changes
    setValue("state", "");
    setValue("city", "");
  }, [watchedCountry, setValue]);

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

  // Form submission handler
  const onSubmit = async (data: CheckoutFormData) => {
    if (cartItems.length === 0) {
      setSubmitError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Transform cart items to match API format with generic variant handling
      const transformedItems = cartItems.map((item) => ({
        product: item.id.toString(),
        quantity: item.quantity,
        // Pass the entire selectedVariants object generically
        selectedVariant: item.selectedVariants || {},
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
      const response = await api.post("/order", orderPayload);

      if (!response.status || response.status >= 400) {
        toast.error("Failed to create order");
      } else {
        dispatch(clearCart());
        if (currentUser) {
          router.push("/dashboard/orders");
        } else {
          router.push("/");
        }
        toast("Order placed successfully!", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to place order. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get available states for selected country
  const availableStates = STATES[selectedCountry as keyof typeof STATES] || [];
  const availableCities = CITIES[selectedCountry as keyof typeof CITIES] || [];

  return (
    <div className="mt-20 min-h-screen px-3 pt-4 lg:px-7 lg:pt-8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Section - Shipping Details */}
          <div className="">
            {/* Returning Customer */}
            {!currentUser && (
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
            )}

            {/* Auto-fill Notice */}
            {currentUser && (
              <div className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-3">
                <div className="flex items-center">
                  <IoIosCheckmarkCircle className="mr-2 text-blue-600" />
                  <span className="text-sm text-blue-800">
                    Form auto-filled with your profile information
                  </span>
                </div>
              </div>
            )}

            {/* Shipping Details */}
            <div className="rounded-lg bg-white py-3">
              <h2 className="text-grey-2 mb-6 text-xl font-semibold lg:text-2xl">
                Shipping Details
              </h2>

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
                    onChange={(e) => {
                      setSelectedCountry(e.target.value);
                      setValue("country", e.target.value);
                    }}
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country.value} value={country.value}>
                        {country.label}
                      </option>
                    ))}
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
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("state")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select State</option>
                    {availableStates.map((state) => (
                      <option key={state.value} value={state.value}>
                        {state.label}
                      </option>
                    ))}
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
                    {availableCities.map((city) => (
                      <option key={city.value} value={city.value}>
                        {city.label}
                      </option>
                    ))}
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
                    {cartItems.map((item, index) => (
                      <div
                        key={index}
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
                            {/* Generic variant display - using the same approach as cart component */}
                            {renderVariantInfo(item.selectedVariants)}

                            {/* Alternative: Single line display (uncomment to use instead) */}
                            {/* {renderVariantsSingleLine(item.selectedVariants)} */}
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
