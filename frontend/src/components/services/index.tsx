import React from "react";
import { TbTruckDelivery } from "react-icons/tb";
import { RiSecurePaymentLine } from "react-icons/ri";
import { MdOutlineWorkspacePremium } from "react-icons/md";
import { cn } from "@/utils/cn";

const services = [
  {
    Icon: TbTruckDelivery,
    text: "Free Shipping",
  },
  {
    Icon: RiSecurePaymentLine,
    text: "Secure Payments",
  },
  {
    Icon: MdOutlineWorkspacePremium,
    text: "Premium Quality",
  },
];

function Services() {
  return (
    <div className="main-padding mt-5 lg:mt-0">
      <div className="border-grey/50 flex items-center border-y py-6 sm:py-9">
        {services.map((service, index) => (
          <div
            key={index}
            className={cn(
              "flex w-full flex-col items-center justify-center gap-2 px-4 py-2 sm:flex-row sm:gap-3 lg:gap-5 lg:py-4",
              index !== 0 && "border-grey/50 border-l",
            )}
          >
            <service.Icon className="text-gold size-7 sm:size-12 md:size-[60px]" />
            <span className="text-center text-base font-semibold sm:text-lg md:text-xl lg:text-2xl">
              {service.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Services;
