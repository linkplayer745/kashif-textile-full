// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/redux/hooks";
import { ShoppingBag, Heart, MapPin, User } from "lucide-react";
import api from "@/utils/axiosInstance";

interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
}

export default function DashboardPage() {
  const user = useAppSelector((state) => state.user.currentUser);
  const wishlistItems = useAppSelector((state) => state.wishlist.productId);

  const [orderStats, setOrderStats] = useState<OrderStats>({
    totalOrders: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    api
      .get<OrderStats>(`/order/order-stats`)
      .then((response) => {
        setOrderStats({
          totalOrders: response.data.totalOrders,
          pendingOrders: response.data.pendingOrders,
        });
      })
      .catch((err) => {
        console.error("Failed to fetch order stats:", err);
        setError("Could not load order stats.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.id]);

  if (!user) {
    return (
      <p className="p-4 text-red-600">
        You must be logged in to view your dashboard.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600">Here's an overview of your account</p>
      </div>

      {loading && <p className="text-gray-500">Loading order stats…</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          {
            title: "Total Orders",
            value: orderStats.totalOrders,
            icon: ShoppingBag,
            color: "text-blue-600",
          },
          {
            title: "Wishlist Items",
            value: wishlistItems?.length ?? 0,
            icon: Heart,
            color: "text-red-600",
          },
          {
            title: "Pending Orders",
            value: orderStats.pendingOrders,
            icon: ShoppingBag,
            color: "text-yellow-600",
          },
        ].map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
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
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">Full Name</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="h-5 w-5 text-gray-400" />
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-600">Email Address</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
