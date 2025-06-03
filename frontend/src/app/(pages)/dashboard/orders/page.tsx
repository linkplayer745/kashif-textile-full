// src/pages/orders.tsx (or /app/orders/page.tsx if using App Router)
"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Pagination from "@/components/pagination";
import Filters, { FilterConfig } from "@/components/filters";

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

import {
  fetchOrders,
  setFilters,
  clearFilters,
  setPage,
  setLimit,
} from "@/redux/slices/orderSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

// Types (you can move these to a separate types file)
interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  selectedVariant?: Record<string, string>;
}

interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  state?: string;
  city: string;
  postalCode?: string;
  address1: string;
  address2?: string;
  shipToBilling: boolean;
  orderNotes?: string;
}

interface Order {
  id: string;
  user?: string;
  items: OrderItem[];
  shipping: ShippingInfo;
  subTotal: number;
  shippingCost: number;
  total: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const dispatch = useAppDispatch();

  // Select data from Redux store
  const orders = useAppSelector((state) => state.order.orders);
  const status = useAppSelector((state) => state.order.status);
  const error = useAppSelector((state) => state.order.error);
  const pagination = useAppSelector((state) => state.order.pagination);
  const filters = useAppSelector((state) => state.order.filters);

  // Define status options for the "select" filter
  const ORDER_STATUS_OPTIONS = [
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "shipped", label: "Shipped" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  // Build our FilterConfig array
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

  // Fetch orders when component mounts or when pagination/filters change
  useEffect(() => {
    dispatch(
      fetchOrders({
        page: pagination.page,
        limit: pagination.limit,
        orderId: filters.orderId || undefined,
        status: filters.status || undefined,
      }),
    );
  }, [
    dispatch,
    pagination?.page,
    pagination?.limit,
    filters?.orderId,
    filters?.status,
  ]);

  const handleFilterChange = (key: string, value: string) => {
    dispatch(setFilters({ [key]: value }));
    dispatch(setPage(1)); // Reset to first page when filtering
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setLimit(newLimit));
  };

  const getStatusBadge = (stat: string) => {
    const baseClasses =
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium";
    switch (stat.toLowerCase()) {
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "paid":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "shipped":
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "cancelled":
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (stat: string) => {
    switch (stat.toLowerCase()) {
      case "pending":
        return <Package className="h-3 w-3" />;
      case "paid":
        return <Package className="h-3 w-3" />;
      case "shipped":
        return <Truck className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "cancelled":
        return <XCircle className="h-3 w-3" />;
      default:
        return <Package className="h-3 w-3" />;
    }
  };

  const OrderDetailsModal = ({ order }: { order: Order }) => (
    <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Order Details — {order.id}
        </DialogTitle>
      </DialogHeader>

      <div className="space-y-6 px-4 pb-4">
        {/* 1. Order Status / Summary Grid */}
        <div className="grid grid-cols-1 gap-4 rounded-lg bg-gray-50 p-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <span className={getStatusBadge(order.status)}>
              {getStatusIcon(order.status)}
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Order Date</p>
            <p className="font-medium">
              {new Intl.DateTimeFormat("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              }).format(new Date(order.createdAt))}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Amount</p>
            <p className="text-lg font-bold">Rs. {order.total}</p>
          </div>
        </div>

        {/* 2. Order Items */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
            <Package className="h-4 w-4" />
            Order Items ({order.items?.length || 0})
          </h3>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="rounded-lg border p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <div className="mt-2 space-y-1">
                      {item.selectedVariant && (
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(item.selectedVariant).map(
                            ([k, v]) => (
                              <Badge
                                key={k}
                                variant="secondary"
                                className="text-xs"
                              >
                                {k}: {v}
                              </Badge>
                            ),
                          )}
                        </div>
                      )}
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × Rs. {item.price}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* 3. Shipping Info */}
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
                  <p className="font-medium">{order.shipping.fullName}</p>
                  <p className="text-sm text-gray-600">Full Name</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{order.shipping.email}</p>
                  <p className="text-sm text-gray-600">Email</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{order.shipping.phone}</p>
                  <p className="text-sm text-gray-600">Phone</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">
                    {order.shipping.address1}
                    {order.shipping.address2 && `, ${order.shipping.address2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shipping.city}, {order.shipping.state}{" "}
                    {order.shipping.postalCode}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shipping.country}
                  </p>
                  <p className="text-xs text-gray-500">Shipping Address</p>
                </div>
              </div>
              {order.shipping.orderNotes && (
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

        {/* 4. Order Summary */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">Order Summary</h3>
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>Rs. {order.subTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>Rs. {order.shippingCost}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>Rs. {order.total}</span>
            </div>
          </div>
        </div>
      </div>
    </DialogContent>
  );

  return (
    <div className="space-y-6 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold">Your Orders</h1>
        <p className="text-gray-600">Review your past and current orders</p>
      </div>

      {/* Filters row */}
      <Filters
        filters={filterConfigs}
        values={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Loading spinner */}
      {status === "loading" && (
        <div className="flex justify-center py-8">
          <div className="text-gray-500">Loading orders…</div>
        </div>
      )}

      {/* Error message */}
      {status === "failed" && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">{error}</div>
      )}

      {/* No orders found */}
      {status === "succeeded" && orders.length === 0 && (
        <div className="rounded-lg bg-gray-50 p-8 text-center text-gray-500">
          You have no orders yet.
        </div>
      )}

      {/* Orders table */}
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
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell>Rs. {order.subTotal}</TableCell>
                    <TableCell>Rs. {order.shippingCost}</TableCell>
                    <TableCell className="font-medium">
                      Rs. {order.total}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {/* View Details modal */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="mr-1 h-4 w-4" />
                              Details
                            </Button>
                          </DialogTrigger>
                          <OrderDetailsModal order={order} />
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination controls */}
          <div className="mt-6">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalResults={pagination.totalResults}
              limit={pagination.limit}
              hasNextPage={pagination.hasNextPage}
              hasPrevPage={pagination.hasPrevPage}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </div>
        </>
      )}
    </div>
  );
}
