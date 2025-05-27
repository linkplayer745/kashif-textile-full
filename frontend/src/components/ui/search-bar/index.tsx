import { IMAGES } from "@/constants/images";
import { cn } from "@/utils/cn";
import Image, { StaticImageData } from "next/image";
import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { IoSearch } from "react-icons/io5";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { PRODUCTS } from "@/data/products";

type Suggestion = {
  id: number;
  name: string;
  image: string | StaticImageData;
};

const mockSuggestions: Suggestion[] = [
  {
    id: 1,
    name: "Plain Sky Classic Fit Shirt",
    image: IMAGES.POLO_SHIRT,
  },
  {
    id: 2,
    name: "Plain Grey Tailored Smart Fit Shirt",
    image: IMAGES.POLO_SHIRT,
  },
  {
    id: 3,
    name: "Stripe White/Red Tailored Shirt",
    image: IMAGES.POLO_SHIRT,
  },
  {
    id: 4,
    name: "Printed White/Red Shirt",
    image: IMAGES.POLO_SHIRT,
  },
];

const SearchBar = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [query, setQuery] = useState("");

  const close = () => {
    onClose();
    setQuery("");
  };

  const filteredSuggestions = query
    ? PRODUCTS.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()),
      )
    : [];

  return (
    <div
      className={cn(
        "fixed top-0 left-0 z-50 flex h-[40%] w-full -translate-y-full flex-col items-center justify-center bg-white/95 px-6 shadow-md transition-transform duration-500 lg:px-[30px]",
        isOpen ? "translate-y-0" : "",
      )}
    >
      <button
        onClick={close}
        className="absolute top-7 right-8 ml-4 text-2xl font-bold"
      >
        <ImCross />
      </button>

      <div className="relative flex w-full flex-col items-start border-b-2 py-3">
        <div className="flex w-full items-center">
          <input
            type="text"
            placeholder="Search a Product"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded py-2 pr-4 text-lg placeholder-black outline-none"
          />
          <span className="ml-2">
            <IoSearch strokeWidth={4} className="size-5 lg:size-7" />
          </span>
        </div>

        {/* Slide-down animation */}
        <AnimatePresence>
          {filteredSuggestions.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute top-full z-10 mt-2 max-h-96 w-full overflow-y-auto bg-white px-6 py-2 shadow-lg"
            >
              {filteredSuggestions.map((item) => (
                <Link
                  onClick={close}
                  key={item.id}
                  href={`/product/${item.id}`}
                >
                  <motion.li
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.35 }}
                    className="flex cursor-pointer items-center py-2 hover:bg-gray-100"
                  >
                    <Image
                      height={64}
                      width={64}
                      src={item.images[0]}
                      alt={item.name}
                      className="mr-4 size-16"
                    />
                    <span className="text-sm">{item.name}</span>
                  </motion.li>
                </Link>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SearchBar;
