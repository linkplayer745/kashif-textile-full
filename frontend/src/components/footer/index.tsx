import {
  FaInstagram,
  FaFacebookF,
  FaYoutube,
  FaTiktok,
  FaRegCopyright,
} from "react-icons/fa";
import Image from "next/image";
import { IMAGES } from "@/constants/images";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="text-chinese-black bg-white pt-5 sm:pt-10 lg:pt-24">
      <div className="main-padding grid grid-cols-1 gap-10 py-10 lg:grid-cols-5">
        {/* Company Info */}
        <div className="col-span-1 space-y-4 lg:col-span-2 lg:space-y-6">
          <Image
            src="/logo.webp"
            alt="Kashif Textile Logo"
            className="w-[15%] object-contain"
            width={130}
            height={50}
          />
          <p className="text-sm leading-relaxed font-light lg:text-base">
            Kashif Textile, a sub-brand of the renowned Banwalo, is a trusted
            men’s online clothing store in Pakistan since 2019. Run by a
            passionate team, we focus on quality, affordability, and customer
            satisfaction. With years of industry experience, we offer
            distinctive designs, excellent service, and a seamless shopping
            experience tailored for modern men.
          </p>
          <div className="flex items-center gap-4 text-xl">
            <FaInstagram />
            <FaFacebookF />
            <FaYoutube />
            <FaTiktok />
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Footer Menu</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: "About us", link: "/about-us" },
              { label: "Privacy Policy", link: "/privacy-policy" },
              { label: "Returns & Exchange Policy", link: "/returns-exchange" },
              { label: "Terms of service", link: "/terms-of-service" },
              { label: "Contact", link: "/contact" },
            ].map((item, index) => (
              <Link className="block" key={index} href={item.link}>
                <li className="group relative w-fit cursor-pointer">
                  {item.label}

                  <span className="border-red absolute -bottom-1 left-0 w-0 transform border-b-2 duration-300 ease-in group-hover:w-full" />
                </li>
              </Link>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Need Help?</h3>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="tel:+923001234968"> Contact: +92 300 1234968</Link>
            </li>

            <li>hello@kashiftextile.pk</li>
            <li>
              For queries related to orders please contact us at{" "}
              <Link className="hover:text-red" href="tel:+923001234968">
                {" "}
                +92 300 1234968
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium">Main Menu</h3>
          <ul className="space-y-3 text-sm">
            {[
              { label: "Summer Tracksuits", link: "/category/8" },
              { label: "Polo Shirts", link: "/category/1" },
              { label: "Kids Collections", link: "/category/7" },
              { label: "Trousers & Shorts", link: "/category/3" },
              { label: "Contact", link: "/contact" },
            ].map((item, index) => (
              <li className="group relative w-fit cursor-pointer" key={index}>
                <Link href={item.link}>{item.label}</Link>

                <span className="border-red absolute -bottom-1 left-0 w-0 transform border-b-2 duration-300 ease-in group-hover:w-full" />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="main-padding bg-dark-grey mt-0 flex flex-col items-center gap-2 border-t text-sm text-white md:flex-row md:justify-between lg:mt-5">
        <span className="flex items-center gap-2">
          <FaRegCopyright /> Kashif Textile All Rights Reserved.
        </span>
        <div className="flex items-center gap-5">
          <span className="font-medium">100% Safe Checkout</span>
          <Image
            className="h-auto w-[40%]"
            src={IMAGES.PAYMENT_METHODS}
            alt="Payment methods"
          />
        </div>
      </div>
    </footer>
  );
}
