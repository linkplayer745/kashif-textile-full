"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUser } from "@/redux/slices/userSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import Marquee from "react-fast-marquee";
import { FaPhoneAlt } from "react-icons/fa";
import { SiWhatsapp } from "react-icons/si";
import { TfiUser } from "react-icons/tfi";

export default function TopBar() {
  const user = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  return (
    <div className="bg-light-grey flex items-center justify-between px-5 lg:px-[38px]">
      <div className="hidden w-full gap-[1.5vh] px-[3vh] text-[2vh] lg:flex">
        <Link href="tel:+923001234968" className="flex items-center gap-[1vh]">
          <FaPhoneAlt />
          <p className="leading-[4vh] text-nowrap">+92 300 1234968</p>
        </Link>
        <Link
          target="_blank"
          href="https://wa.me/923001234968"
          className="flex items-center gap-[1vh]"
        >
          <SiWhatsapp />
          <p className="leading-[4vh] text-nowrap">+92 300 1234968</p>
        </Link>
      </div>

      <Marquee speed={25}>
        <p className="small-text">Free shipping on order over PKR 1500.</p>
      </Marquee>

      <div className="group relative hidden w-full lg:block">
        <button
          className="small-text my-auto flex items-center gap-1 justify-self-end"
          type="button"
        >
          <TfiUser /> My Account
        </button>
        <div className="invisible absolute right-0 z-30 mt-2 w-44 origin-top-right translate-y-[10px] transform rounded-md bg-white py-1 opacity-0 shadow-md transition-all duration-300 ease-in-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="block px-4 py-2 text-sm hover:bg-gray-100 lg:text-base"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 lg:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block px-4 py-2 text-sm hover:bg-gray-100 lg:text-base"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-4 py-2 text-sm hover:bg-gray-100 lg:text-base"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
