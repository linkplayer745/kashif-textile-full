"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppSelector } from "@/redux/hooks"
import { ShoppingBag, Heart, MapPin, User } from "lucide-react"

export default function DashboardPage() {
  const user = useAppSelector((state) => state.user.currentUser)
//   const orders = useAppSelector((state) => state.orders.orders)
  const wishlistItems = useAppSelector((state) => state.wishlist.productId)

  const stats = [
    {
      title: "Total Orders",
      value: 3,
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Wishlist Items",
      value:wishlistItems?.length??0,
      icon: Heart,
      color: "text-red-600",
    },
    {
      title: "Pending Orders",
    //   value: orders.filter((order) => order.status === "pending").length,
      value: 2,

      icon: ShoppingBag,
      color: "text-yellow-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Here's an overview of your account</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-gray-600">Full Name</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">{user?.email}</p>
              <p className="text-sm text-gray-600">Email Address</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
