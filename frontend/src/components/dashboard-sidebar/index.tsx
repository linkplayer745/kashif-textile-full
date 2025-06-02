"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Menu,
  X,
  SettingsIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// import { logout } from "../store/slices/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { clearUser } from "@/redux/slices/userSlice";
import { Separator } from "../ui/separator";

const navigationItems = [
  {
    name: "Account Info",
    href: "/dashboard",
    icon: User,
  },
  {
    name: "My Orders",
    href: "/dashboard/orders",
    icon: ShoppingBag,
  },
  {
    name: "My Wishlist",
    href: "/dashboard/wishlist",
    icon: Heart,
  },
  {
    name: "Setting",
    href: "/dashboard/settings",
    icon: SettingsIcon,
  },
];

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  //   const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-20 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:inset-0 lg:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} `}
      >
        <div className="flex h-full flex-col">
          {/* User Profile Section */}
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-800">John Doe</h2>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        isActive
                          ? "border-l-4 border-red-600 bg-red-50 text-red-600"
                          : "text-gray-700 hover:bg-gray-50"
                      } `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
              <Separator />
              {/* Logout Button */}
              <li className="">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-700 hover:bg-gray-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Log Out
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-30 bg-black lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
