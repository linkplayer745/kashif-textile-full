"use client";
import { IMAGES } from "@/constants/images";
import React, { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { IoIosSearch } from "react-icons/io";
import Image from "next/image";
import SearchBar from "../ui/search-bar";
import MultilevelSidebar from "../sidebar";
import Link from "next/link";
import CartComponent from "../ui/cart";

function NavBar({ secondary }: { secondary?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const onClose = () => setIsSearchOpen(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div
        className={`flex w-full items-center justify-around px-5 py-2 transition-all duration-300 ${
          isScrolled
            ? `fixed top-0 left-0 z-50 bg-white text-black shadow-md lg:px-[60px]`
            : `z-20 lg:px-[30px] ${secondary ? "fixed bg-white text-black shadow-md" : "absolute text-white"}`
        } `}
      >
        <div className="w-1/3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex cursor-pointer items-center gap-1"
          >
            <HiMenu className="size-7" />
            <span className="hidden text-sm md:text-base lg:block">Menu</span>
          </button>
        </div>

        <Link
          href={"/"}
          className="flex w-1/3 items-center justify-center gap-1"
        >
          <Image
            className="h-[50px] w-auto object-contain md:h-[60px]"
            src={IMAGES.LOGO}
            alt="Logo"
          />
        </Link>

        <div className="flex w-1/3 items-center justify-end gap-2 lg:gap-8">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex cursor-pointer items-center gap-2"
          >
            <IoIosSearch className="size-7" />
            <span className="hidden text-sm sm:block md:text-base">SEARCH</span>
          </button>

          <CartComponent />
        </div>
      </div>

      <SearchBar isOpen={isSearchOpen} onClose={onClose} />

      <MultilevelSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </>
  );
}

export default NavBar;
