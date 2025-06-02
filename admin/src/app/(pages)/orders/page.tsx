"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Pagination from "@/components/pagination";
import Filters, { FilterConfig } from "@/components/filters"; // Adjust path as needed
import { useAppDispatch, useAppSelector } from "@/hooks/useStore";
import { toast } from "sonner";
import { fetchOrders, updateOrderStatus } from "@/redux/slices/orderSlice";
import {
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Eye,
  MapPin,
  User,
  Mail,
  Phone,
  FileText,
} from "lucide-react";

// Define order status options
const ORDER_STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "shipped", label: "Shipped" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const {
    results: orders,
    page,
    limit,
    totalPages,
    totalResults,
    hasNextPage,
    hasPrevPage,
    status,
    error,
    searchId,
  } = useAppSelector((state) => state.order);

  // Filter state
  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    orderId: "",
    status: "",
  });

  // Configure filters
  const filterConfigs: FilterConfig[] = [
    {
      key: "orderId",
      type: "search",
      placeholder: "Search by Order ID...",
    },
    {
      key: "status",
      type: "select",
      placeholder: "Filter by Status",
      options: ORDER_STATUS_OPTIONS,
    },
  ];

  // Fetch orders when filters or pagination changes
  useEffect(() => {
    const params = {
      page,
      limit,
      orderId: filterValues.orderId || undefined,
      status: filterValues.status || undefined,
    };

    dispatch(fetchOrders(params))
      .unwrap()
      .catch((e) => toast.error(e));
  }, [dispatch, page, limit, filterValues]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Reset to first page when filters change
    if (page !== 1) {
      dispatch(
        fetchOrders({
          page: 1,
          limit,
          orderId: key === "orderId" ? value : filterValues.orderId,
          status: key === "status" ? value : filterValues.status,
        }),
      );
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilterValues({
      orderId: "",
      status: "",
    });
  };

  // Handle status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status: newStatus }),
      ).unwrap();

      // Refresh orders
      // dispatch(
      //   fetchOrders({
      //     page,
      //     limit,
      //     orderId: filterValues.orderId || undefined,
      //     status: filterValues.status || undefined,
      //   }),
      // );
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(
      fetchOrders({
        page: newPage,
        limit,
        orderId: filterValues.orderId || undefined,
        status: filterValues.status || undefined,
      }),
    );
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(
      fetchOrders({
        page: 1,
        limit: newLimit,
        orderId: filterValues.orderId || undefined,
        status: filterValues.status || undefined,
      }),
    );
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";

    switch (status.toLowerCase()) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "processing":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "shipped":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "delivered":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return <Package className="h-3 w-3" />;
      case "processing":
        return <Package className="h-3 w-3" />;
      case "shipped":
        return <Truck className="h-3 w-3" />;
      case "delivered":
        return <CheckCircle className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  // Order Details Component
  const OrderDetailsModal = ({ order }: { order: any }) => (
    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Details - {order.id}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6">
        {/* Order Status & Summary */}
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={getStatusBadge(order.status)}>
              {getStatusIcon(order.status)}
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-medium">
              {new Date(order.createdAt || Date.now()).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg font-bold">Rs.{order.total}</p>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Package className="h-4 w-4" />
            Order Items ({order.items?.length || 0})
          </h3>
          <div className="space-y-3">
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="mt-2 space-y-1">
                      {item.selectedVariant && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(item.selectedVariant).map(
                            ([key, value]) => (
                              <Badge
                                key={key}
                                variant="secondary"
                                className="text-xs"
                              >
                                {key}: {value as string}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × Rs.{item.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      Rs.{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Shipping Information */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Truck className="h-4 w-4" />
            Shipping Information
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{order.shipping?.fullName}</p>
                  <p className="text-sm text-gray-600">Full Name</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{order.shipping?.email}</p>
                  <p className="text-sm text-gray-600">Email</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{order.shipping?.phone}</p>
                  <p className="text-sm text-gray-600">Phone</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {order.shipping?.address1}
                    {order.shipping?.address2 && `, ${order.shipping.address2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shipping?.city}, {order.shipping?.state}{" "}
                    {order.shipping?.postalCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shipping?.country}
                  </p>
                  <p className="text-xs text-gray-500">Shipping Address</p>
                </div>
              </div>

              {order.shipping?.orderNotes && (
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{order.shipping.orderNotes}</p>
                    <p className="text-sm text-gray-600">Order Notes</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <Separator />

        {/* Order Summary */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Order Summary</h3>
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs.{order.subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Rs.{order.shippingCost}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>Rs.{order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <p className="text-gray-600">Manage and track your orders</p>
      </div>

      {/* Filters */}
      <Filters
        filters={filterConfigs}
        values={filterValues}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading State */}
      {status === "loading" && (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Loading orders…</div>
        </div>
      )}

      {/* Error State */}
      {status === "failed" && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {/* No Results */}
      {status === "succeeded" && orders.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
          No orders found.
        </div>
      )}

      {/* Orders Table */}
      {orders.length > 0 && (
        <>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <span className={getStatusBadge(order.status)}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell>Rs.{order.subTotal}</TableCell>
                    <TableCell>Rs.{order.shippingCost}</TableCell>
                    <TableCell className="font-medium">
                      Rs.{order.total}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* View Details */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <OrderDetailsModal order={order} />
                        </Dialog>

                        {/* Quick Status Update */}
                        <Select
                          value={order.status}
                          onValueChange={(newStatus) =>
                            handleStatusUpdate(order.id, newStatus)
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ORDER_STATUS_OPTIONS.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        {/* Cancel Order (only for pending/processing orders) */}
                        {order.status === "pending" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                Cancel
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Cancel Order
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel order{" "}
                                  {order.id}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  Keep Order
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleStatusUpdate(order.id, "cancelled")
                                  }
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Cancel Order
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalResults={totalResults}
            hasNextPage={hasNextPage}
            hasPrevPage={hasPrevPage}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
            limit={limit}
          />
        </>
      )}
    </div>
  );
}
