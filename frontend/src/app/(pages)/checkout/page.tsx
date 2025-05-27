"use client";
import { IMAGES } from "@/constants/images";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearCart } from "@/redux/slices/cartSlice";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { IoIosCheckmarkCircle } from "react-icons/io";

interface OrderSummary {
  subtotal: number;
  discount: number;
  shipping: number;
  grandTotal: number;
}

const CheckoutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "Pakistan",
    state: "",
    city: "",
    postalCode: "",
    addressLine1: "",
    addressLine2: "",
    orderNotes: "",
    shipToSameAddress: true,
    paymentMethod: "cod",
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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePlaceOrder = () => {
    // Handle the order submission
    console.log("Order placed:", {
      customerInfo: formData,
      products: cartItems,
      orderSummary,
    });

    // Clear the cart after successfully placing the order
    dispatch(clearCart());

    // Here you would typically:
    // 1. Validate the form
    // 2. Submit the order to your API
    // 3. Redirect to a confirmation page
  };

  return (
    <div className="mt-20 min-h-screen px-3 pt-4 lg:px-7 lg:pt-8">
      <div className="">
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
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Pakistan">Pakistan</option>
                    <option value="Bangladesh">Bangladesh</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    State / County
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select State</option>
                    <option value="Punjab">Punjab</option>
                    <option value="Sindh">Sindh</option>
                    <option value="KPK">KPK</option>
                    <option value="Balochistan">Balochistan</option>
                  </select>
                </div>
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Town/City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select City</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>
              </div>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-chinese-black mb-1 block text-sm font-semibold">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="addressLine1"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="text-chinese-black mb-1 block text-sm font-semibold">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Ship to same address checkbox */}
              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="shipToSameAddress"
                    checked={formData.shipToSameAddress}
                    onChange={handleInputChange}
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
                  name="orderNotes"
                  value={formData.orderNotes}
                  onChange={handleInputChange}
                  placeholder="Notes about your order, eg special notes for delivery"
                  rows={4}
                  className="resize-vertical w-full rounded-md border border-gray-300 px-3 py-2 focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
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
                <button className="cursor-pointer text-sm font-semibold">
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
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === "cod"}
                        onChange={handleInputChange}
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
                          name="paymentMethod"
                          value="payfast"
                          checked={formData.paymentMethod === "payfast"}
                          onChange={handleInputChange}
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
                          name="paymentMethod"
                          value="wallet"
                          checked={formData.paymentMethod === "wallet"}
                          onChange={handleInputChange}
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
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-chinese-black ml-3">
                        Credit/Debit Card
                      </span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bank"
                        checked={formData.paymentMethod === "bank"}
                        onChange={handleInputChange}
                        className="h-4 w-4 border-gray-300 bg-gray-100 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-chinese-black ml-3">
                        Bank Transfer Payment
                      </span>
                    </label>
                  </div>
                </div>

                {/* Place Order Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handlePlaceOrder}
                    className="bg-red px-4 py-2 tracking-widest text-white transition duration-200 hover:bg-red-700 sm:px-7"
                  >
                    PLACE ORDER
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
