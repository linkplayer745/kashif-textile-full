"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  User,
  Calendar,
} from "lucide-react";
import api from "@/utils/axiosInstance";

type OrderStatus = "pending" | "paid" | "shipped" | "completed" | "cancelled";

interface OrderTrackingData {
  orderId: string;
  status: OrderStatus;
  customerName: string;
  orderDate: string;
}

const OrderTrackingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [orderData, setOrderData] = useState<OrderTrackingData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get status configuration
  const getStatusConfig = (status: OrderStatus) => {
    const configs = {
      pending: {
        color: "bg-amber-500",
        icon: Clock,
        label: "Order Pending",
        description: "Your order is being processed",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
      },
      paid: {
        color: "bg-blue-500",
        icon: DollarSign,
        label: "Payment Confirmed",
        description: "Payment received successfully",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
      },
      shipped: {
        color: "bg-purple-500",
        icon: Truck,
        label: "Order Shipped",
        description: "Your order is on the way",
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
      },
      completed: {
        color: "bg-green-500",
        icon: CheckCircle,
        label: "Order Delivered",
        description: "Order completed successfully",
        bgColor: "bg-green-50",
        textColor: "text-green-700",
      },
      cancelled: {
        color: "bg-red-500",
        icon: XCircle,
        label: "Order Cancelled",
        description: "This order has been cancelled",
        bgColor: "bg-red-50",
        textColor: "text-red-700",
      },
    };
    return configs[status] || configs.pending;
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter an order ID");
      return;
    }

    setLoading(true);
    setError("");
    setOrderData(null);

    try {
      const response = await api.get(
        `/order/track-order/${searchQuery.trim()}`,
      );

      if (response.status === 200) {
        setOrderData(response.data);
      } else {
        setError("Order not found");
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError("Order not found. Please check your order ID.");
      } else {
        console.log(err);
        setError(
          err.response.data.message ||
            "Something went wrong. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const statusConfig = orderData ? getStatusConfig(orderData.status) : null;
  const StatusIcon = statusConfig?.icon;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto mt-20 px-4 py-12">
        <div className="mx-auto max-w-2xl space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <div className="bg-red mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">
              Track Your Order
            </h1>
            <p className="text-lg text-gray-600">
              Enter your order ID to check the current status
            </p>
          </div>

          {/* Search Card */}
          <Card className="border-0 bg-white/70 drop-shadow-2xl backdrop-blur-sm">
            <CardHeader className="pb-6 text-center">
              <CardTitle className="text-2xl text-gray-800">
                Order Lookup
              </CardTitle>
              <CardDescription className="text-gray-600">
                Find your order using the ID provided in your confirmation email
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label
                  htmlFor="orderId"
                  className="text-sm font-medium text-gray-700"
                >
                  Order ID
                </Label>
                <div className="flex gap-3">
                  <Input
                    id="orderId"
                    placeholder="Enter your order ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyUp={(e) => e.key === "Enter" && handleSearch()}
                    className="h-12 flex-1 border-gray-300 text-lg focus:border-blue-500 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <Button
                    onClick={handleSearch}
                    disabled={loading || !searchQuery.trim()}
                    className="bg-red hover:bg-red/50 h-12 px-8 font-medium text-white"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Searching...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" />
                        Track Order
                      </div>
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert className="border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-700">
                    {error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Order Status Result */}
          {orderData && statusConfig && StatusIcon && (
            <Card className="overflow-hidden border-0 bg-white/90 shadow-xl backdrop-blur-sm">
              <div className={`h-2 ${statusConfig.color}`} />
              <CardContent className="p-8">
                <div className="space-y-6 text-center">
                  {/* Status Icon & Badge */}
                  <div className="flex flex-col items-center space-y-4">
                    <div
                      className={`h-20 w-20 rounded-full ${statusConfig.bgColor} flex items-center justify-center`}
                    >
                      <StatusIcon
                        className={`h-10 w-10 ${statusConfig.textColor}`}
                      />
                    </div>

                    <Badge
                      className={`${statusConfig.color} px-6 py-2 text-lg font-medium text-white`}
                    >
                      {statusConfig.label}
                    </Badge>

                    <p
                      className={`text-lg ${statusConfig.textColor} font-medium`}
                    >
                      {statusConfig.description}
                    </p>
                  </div>

                  {/* Order Details */}
                  <div className="space-y-4 rounded-xl bg-gray-50 p-6">
                    <div className="flex items-center justify-center gap-3 text-gray-700">
                      <User className="h-5 w-5" />
                      <span className="text-lg font-semibold">
                        {orderData.customerName}
                      </span>
                    </div>

                    <div className="flex items-center justify-center gap-3 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Order placed on {formatDate(orderData.orderDate)}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => {
                      setOrderData(null);
                      setSearchQuery("");
                    }}
                    variant="outline"
                    className="mt-6 border-gray-300 hover:bg-gray-50"
                  >
                    Track Another Order
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && (
            <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-4 text-center">
                  <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                  <p className="text-lg text-gray-600">
                    Searching for your order...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
