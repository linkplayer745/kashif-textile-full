"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, ShoppingBag, Heart, MapPin, Settings, LogOut, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
// import { logout } from "../store/slices/userSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

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
    name: "Address",
    href: "/dashboard/address",
    icon: MapPin,
  },
  {
    name: "Account Details",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
//   const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    // dispatch(logout())
    // Redirect to login page
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-40 w-80 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:inset-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* User Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-3">
                {/* <span className="text-white text-xl font-bold">{user.name.charAt(0).toUpperCase()}</span> */}
              </div>
              {/* <h3 className="font-semibold text-gray-900">{user.name}</h3> */}
              {/* <p className="text-sm text-gray-600">{user.email}</p> */}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                        ${
                          isActive
                            ? "bg-red-50 text-red-600 border-l-4 border-red-600"
                            : "text-gray-700 hover:bg-gray-50"
                        }
                      `}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-700 hover:bg-gray-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Log Out
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  )
}
