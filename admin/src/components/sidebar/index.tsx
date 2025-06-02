"use client";
import { cn } from "@/utils/cn";
import {
  BarChart,
  Menu,
  X,
  AlignJustify,
  ShoppingBag,
  LogOutIcon,
  NotebookIcon,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function AdminSidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="text-base-color fixed top-4 left-4 z-20 rounded-md p-2 shadow-md lg:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-10 bg-black lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-20 h-screen w-64 transform bg-white p-4 shadow-lg transition-transform duration-300 ease-in-out lg:sticky ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="mt-2 mb-8 flex items-center justify-between">
          <h1 className="text-base-color text-lg font-bold">Admin Dashboard</h1>
          <button
            className="text-base-color hover:text-muted lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav>
          <ul className="space-y-2">
            {[
              // { name: "Dashboard", icon: BarChart, id: "dashboard" },
              { name: "Orders", icon: NotebookIcon, id: "orders" },
              { name: "Products", icon: ShoppingBag, id: "products" },
              { name: "Categories", icon: AlignJustify, id: "categories" },
            ].map((item) => {
              const isActive = pathname.includes(`/${item.id}`);
              return (
                <li key={item.id}>
                  <Link
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "relative flex w-full transform items-center rounded-md border-2 border-transparent px-4 py-2 antialiased transition duration-500",
                      isActive
                        ? "bg-secondary text-emphasis scale-100 font-semibold"
                        : "text-base-color hover:border-secondary scale-95",
                    )}
                    href={`/${item.id}`}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </li>
              );
            })}

            {/* Logout with AlertDialog */}
            <li>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "hover:border-secondary text-base-color flex w-full scale-95 transform items-center rounded-md border-2 border-transparent px-4 py-2 antialiased transition duration-500",
                    )}
                  >
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to log out? You will be redirected
                      to the login page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Logout
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}
